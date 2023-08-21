import React, { useState, useRef, useContext, useEffect } from 'react';
import SocialNetworkShare from '../components/SocialNetworkShare.js'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { a11yDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { Web3Context } from '../components/Web3Context.js';
import InstanceABI from '../interfaces/LimitedTickets.json'
import InstanceABI_2 from '../interfaces/LimitedTicketsHack.json'
import { FormGroup, Button, Input, Container, Card, CardBody, CardTitle } from "reactstrap";
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../assets/css/game.css';

function Game16() {
  const [Receiver, setReceiver] = useState("");
  const [TicketAmount, setTicketAmount] = useState("");
  const [InstanceAddress, setInstanceAddress] = useState("");
  const [InstanceAddress_2, setInstanceAddress_2] = useState("");
  const [TokenBalance, setTokenBalance] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const codeRef = useRef(null);
  const { walletAddress, factoryContract, nftContract, web3 } = useContext(Web3Context);
  const [instanceContract, setInstanceContract] = useState(null);
  const [instanceContract_2, setInstanceContract_2] = useState(null);
  const [MaxTicketsPerAddress, setMaxTicketsPerAddress] = useState("");
  const [UserTicketsCount, setUserTicketsCount] = useState(0)
  const [isHintVisible, setIsHintVisible] = useState(false);
  const [Counter, setCounter] = useState("");
  const [inputCounter, setInputCounter] = useState("");
  const [Target, setTarget] = useState("");
  const [Attacker, setAttcker] = useState("");
  const [TicketsAmount, setTicketsAmount] = useState("");

  const toggleHint = () => {
    setIsHintVisible(!isHintVisible);
  };

  useEffect(() => {
    if (web3.utils.isAddress(InstanceAddress) && web3.utils.isAddress(InstanceAddress_2)) {
      setInstanceContract(new web3.eth.Contract(InstanceABI, InstanceAddress));
      setInstanceContract_2(new web3.eth.Contract(InstanceABI_2, InstanceAddress_2));

    }
  }, [InstanceAddress, InstanceAddress_2]);

  useEffect(() => {
    const fetchData = async () => {
      if (!walletAddress || !nftContract) {
        return;
      }
      const balance = await nftContract.methods.balanceOf(walletAddress, 16).call();
      setTokenBalance(balance);
    };
    fetchData();
  }, [walletAddress, nftContract, TokenBalance]);

  const createGame = async () => {
    try {
      setIsLoading(true);
      const receipt = await factoryContract.methods.deploy(16).send({
        from: walletAddress,
        gas: 1000000,
      });

      const deployInstanceEvent = receipt.events.DeployInstance;
      if (deployInstanceEvent) {
        console.log(deployInstanceEvent[0].returnValues.Instance);
        console.log(deployInstanceEvent[1].returnValues.Instance);
        setInstanceAddress(deployInstanceEvent[0].returnValues.Instance);
        setInstanceAddress_2(deployInstanceEvent[1].returnValues.Instance);
        toast.success("Game created successfully!"); // Success toast
      } else {
        toast.error("Game creation failed."); // Error toast
      }

      setIsLoading(false);
    } catch (err) {
      setIsLoading(false);
      console.log(err);
      toast.error("Game creation failed. Please make sure your Metamask wallet is properly connected."); // Error toast
    }
  };


  const claimTickets = async (receiver, ticketAmount) => {

    if (instanceContract) {
      try {

        await instanceContract.methods.claimTickets(receiver, ticketAmount).send({
          from: walletAddress,
          gas: 700000,
        }).then(async () => {
          toast.success("Claiming was completed successfully!"); // Success toast
        });
      } catch (err) {
        console.error(err.message);
        toast.error("Transaction failed."); // Error toast
      }
    }
  };

  const Count = async () => {
    try {
      const Count = await instanceContract.methods.Count(inputCounter).call()
      setCounter(Count);
      console.log(Count);
    } catch (err) {
      console.error(err);
      toast.error("Failed to get Count."); // Error toast
    }
  }


  const maxTicketsPerAddress = async () => {
    const num = await instanceContract.methods.maxTicketsPerAddress().call()
    setMaxTicketsPerAddress(num)
    console.log(num);
  }

  const attack = async (_target, attacker, ticketAmount) => {

    if (instanceContract) {
      try {

        await instanceContract_2.methods.attack(_target, attacker, ticketAmount).send({
          from: walletAddress,
          gas: 700000,
        }).then(async () => {
          const count = await instanceContract.methods.Count(walletAddress).call();
          setUserTicketsCount(count);
          toast.success(`Claiming was completed successfully! You have ${Number(UserTicketsCount) + Number(ticketAmount)} tickets.`); // Success toast
        });
      } catch (err) {
        console.error(err.message);
        toast.error("Transaction failed."); // Error toast
      }
    }
  };
  const checkLimitedTickets = async () => {
    const count = await instanceContract.methods.Count(walletAddress).call();
    console.log(count);
    setUserTicketsCount(count);
    if (UserTicketsCount > 3) {
      console.log('The Mission Is Complete');
      toast("Well done! You have solved this level!", {
        position: toast.POSITION.TOP_CENTER,
        autoClose: 5000,
      });
      if (TokenBalance < 1) {
        try {
          await nftContract.methods.mint(16, InstanceAddress).send({
            from: walletAddress,
            gas: 700000,
          })
            .once("error", (err) => {
              console.log(err);
              toast.error("Minting failed."); // Error toast
            })
            .once("receipt", async () => {
              const balance = await nftContract.methods.balanceOf(walletAddress, 16).call();
              setTokenBalance(balance);
              console.log(balance);
              toast.success("Minting completed successfully!"); // Success toast
            });
        } catch (err) {
          console.error(err.message);
          toast.error("Minting failed."); // Error toast
        }
      }
    } else {
      toast.error("You don't have enough tickets."); // Error toast
    }
  };

  const code = `
  // SPDX-License-Identifier: MIT

  pragma solidity ^0.8.10;
  
  contract LimitedTickets {
  
      mapping(address => uint256) public Count;
      uint8 public maxTicketsPerAddress = 3;
  
      function claimTickets(address receiver, uint256 ticketAmount) public {
          require(
              Count[msg.sender] + ticketAmount <= maxTicketsPerAddress,
              "max tickets per address exceeded"
          );
          for (uint256 i = 0; i < ticketAmount; i++) {
              Count[receiver]++;
          }
      }
  }
  
  contract HacklimitedTickets {
      LimitedTickets target;
  
      function attack(address _target ,address attacker, uint256 ticketAmount) public {
          target = LimitedTickets(_target);
          target.claimTickets(attacker,ticketAmount);
      }
  }
  `;

  return (
    <>
      <Container className="game-container container-padding-fix" >
        <Card className="game-card" style={{ backgroundColor: '#000000', color: 'white' }}>
          <CardBody>
            <CardTitle className="game-title title-color" ><b>Ticket Learning Lab</b></CardTitle>
            <div className="code-section">
              <CopyToClipboard text={code}>
                <Button className="button-copy">
                  Copy code
                </Button>
              </CopyToClipboard>
              <SyntaxHighlighter language="javascript" style={a11yDark} ref={codeRef}>
                {code}
              </SyntaxHighlighter>
            </div>
          </CardBody>
        </Card>

        <Card className="game-card card-color" style={{ backgroundColor: '#000000', color: 'white' }}>
          <CardBody>
            <CardTitle className="game-title title-color" ><b>Game Description</b></CardTitle>
            <p><b>Strategize and bypass ticket limitations in Solidity. Challenge the system and claim rewards. </b>
              <br /><br />
              <b><strong> You need:</strong> To play this game, you must creatively explore communication with the ticketing contract, understanding how to potentially bypass a limitation that restricts users to three tickets. Familiarity with intermediate contracts could prove valuable.</b></p>
            <div>
              <Button style={{ backgroundColor: '#c97539', color: 'white' }} className="button-margin" onClick={createGame}>
                Create Instance
              </Button>
            </div>
          </CardBody>
        </Card>

        {!isLoading && InstanceAddress !== "" && (
          <>
            <Card className="game-card" style={{ backgroundColor: '#000000', color: 'white' }}>
              <CardBody>
                <h3 className="mt-1 title-color" >LimitedTickets Address: <p className="Instance-color"> {InstanceAddress} </p></h3>
                <h3 className="mt-1 title-color" >HacklimitedTickets Address: <p className="Instance-color"> {InstanceAddress_2} </p></h3>
              </CardBody>
            </Card>
            <Card className="game-card" style={{ backgroundColor: '#000000', color: 'white' }}>
              <CardBody>
                <CardTitle className="card-title title-color" ><b>LimitedTickets</b></CardTitle>

                <Input
                  className="form-control-alternative"
                  id="input-city"
                  placeholder="address"
                  type="text"
                  onChange={(e) => setInputCounter(e.target.value)}
                />
                <br />
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <Button style={{ backgroundColor: '#355f7d', color: 'white' }} className="mt-1" onClick={() => Count(Counter)}>
                    Count
                  </Button>
                  {Counter &&
                    <p style={{ marginLeft: '10px', marginTop: '12px', wordBreak: "break-all" }}>
                      {Counter}
                    </p>
                  }

                </div>
                <br />

                <div style={{ display: 'flex', alignItems: 'flex-start', minHeight: '50px' }}>
                  <Button className="mt-1" onClick={() => maxTicketsPerAddress()} style={{ backgroundColor: '#355f7d', color: 'white' }}>
                    maxTicketsPerAddress
                  </Button>
                  {MaxTicketsPerAddress !== '' && <p style={{ marginLeft: '10px', marginTop: '12px' }}>{MaxTicketsPerAddress}</p>}
                </div>
                <br />
                <FormGroup>
                  <Input
                    className="form-control-alternative"
                    id="input-city"
                    placeholder="Receiver"
                    type="text"
                    onChange={(e) => setReceiver(e.target.value)}
                  />
                  <br />
                  <Input
                    className="form-control-alternative"
                    id="input-city"
                    placeholder="TicketAmount"
                    type="text"
                    onChange={(e) => setTicketAmount(e.target.value)}
                  />
                </FormGroup>
                <Button style={{ backgroundColor: '#c97539', color: 'white' }} className="mt-1" onClick={() => claimTickets(Receiver, TicketAmount)}>
                  claimTickets
                </Button>
              </CardBody>
            </Card>
            <Card className="game-card" style={{ backgroundColor: '#000000', color: 'white' }}>
              <CardBody>
                <CardTitle className="card-title" style={{ color: 'red' }} ><b>HacklimitedTickets</b></CardTitle>
                <FormGroup>
                  <Input
                    className="form-control-alternative"
                    id="input-city"
                    placeholder="_target"
                    type="text"
                    onChange={(e) => setTarget(e.target.value)}
                  />
                  <br />
                  <Input
                    className="form-control-alternative"
                    id="input-city"
                    placeholder="attacker"
                    type="text"
                    onChange={(e) => setAttcker(e.target.value)}
                  />
                  <br />
                  <Input
                    className="form-control-alternative"
                    id="input-city"
                    placeholder="ticketAmount"
                    type="text"
                    onChange={(e) => setTicketsAmount(e.target.value)}
                  />
                </FormGroup>
                <Button style={{ backgroundColor: '#c97539', color: 'white' }} className="mt-1" onClick={() => attack(Target, Attacker, TicketsAmount)}>
                  attack
                </Button>
                <br /> <br />
                <Button style={{ backgroundColor: '#355f7d', color: 'white' }} className="mt-1" onClick={toggleHint}>
                  {isHintVisible ? 'Hide Hint' : 'Show Hint'}
                </Button>
              </CardBody>
            </Card>


            <Card className="card" style={{ backgroundColor: '#000000', color: 'white' }}>
              <CardBody style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <Button style={{ backgroundColor: '#c97539', color: 'white' }} className="button" onClick={checkLimitedTickets}>
                  Submit
                </Button>
              </CardBody>
            </Card>
          </>
        )}

        {isHintVisible && (
          <Card className="card" style={{ backgroundColor: '#000000', color: 'white' }}>
            <CardBody>
              <CardTitle className="card-title title-color" ><b>Hint</b></CardTitle>
              <p>
                Consider how the 'claimTickets' function tracks ticket count. When the attacker contract calls this function, it's defined as the msg.sender. Even though the tickets are transferred to your address through the attacker contract, the balance of the attacker contract will always remain at zero tickets.
              </p>
            </CardBody>
          </Card>
        )}

        <p style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          {TokenBalance < 1 ? null : (
            <div>

              <br />
              <strong>
                Congratulations! You Got A Badge{" "}
                <i className="fas fa-medal" style={{ color: "gold", fontSize: "20px", position: 'relative', top: '3px' }}></i>
              </strong>
              <br /><br /><br />
              <SocialNetworkShare description={'SupportInterface'} />
            </div>
          )}
        </p>
      </Container>

      <ToastContainer position={toast.POSITION.BOTTOM_RIGHT} />

    </>
  );
}

export default Game16;
