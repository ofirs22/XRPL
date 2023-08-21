import React, { useState, useRef, useContext, useEffect } from 'react';
import SocialNetworkShare from '../components/SocialNetworkShare.js'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { a11yDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { Web3Context } from '../components/Web3Context.js';
import InstanceABI from '../interfaces/EducatedGuess.json'
import InstanceABI_2 from '../interfaces/EducatedGuessHack.json'

import { FormGroup, Button, Input, Container, Card, CardBody, CardTitle } from "reactstrap";
import { CopyToClipboard } from 'react-copy-to-clipboard';
 import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../assets/css/game.css';

function Game17() {
  const [Gusess, setGusess] = useState("");
  const [InstanceAddress, setInstanceAddress] = useState("");
  const [InstanceAddress_2, setInstanceAddress_2] = useState("");
  const [TokenBalance, setTokenBalance] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const codeRef = useRef(null);
  const { walletAddress, factoryContract, nftContract, web3 } = useContext(Web3Context);
  const [instanceContract, setInstanceContract] = useState(null);
  const [instanceContract_2, setInstanceContract_2] = useState(null);
  const [_correctGuess, set_correctGuess] = useState(0)
  const [isHintVisible, setIsHintVisible] = useState(false);
  const [Target, setTarget] = useState("");
  const [attackerContract, setattackerContract] = useState("");
  const [Num, setNum] = useState("");
  const [CorrectGuess, setCorrectGuess] = useState(null);

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
      const balance = await nftContract.methods.balanceOf(walletAddress, 17).call();
      setTokenBalance(balance);
    };
    fetchData();
  }, [walletAddress, nftContract, TokenBalance]);

  const createGame = async () => {
    try {
      setIsLoading(true);
      const receipt = await factoryContract.methods.deploy(17).send({
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


  const random = async (guess) => {

    if (instanceContract) {
      try {

        await instanceContract.methods.random(guess).send({
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


  const correctGuess = async () => {
    const bool = await instanceContract.methods.correctGuess().call()
    setCorrectGuess(bool)
    console.log(bool);
  }

  const attack = async (_target, attackerContract, num) => {

    if (instanceContract) {
      try {

        await instanceContract_2.methods.attack(_target, attackerContract, num).send({
          from: walletAddress,
          gas: 700000,
        }).then(async () => {

          toast.success(`The hack was successful!`); // Success toast
        });
      } catch (err) {
        console.error(err.message);
        toast.error("Transaction failed."); // Error toast
      }
    }
  };
  const checkEducatedGuess = async () => {
    const correctGuess = await instanceContract.methods.correctGuess().call();
    console.log(correctGuess);
    set_correctGuess(correctGuess);
    if (correctGuess == true) {
      console.log('The Mission Is Complete');
      toast("Well done! You have solved this level!", {
        position: toast.POSITION.TOP_CENTER,
        autoClose: 5000,
      });
      if (TokenBalance < 1) {
        try {
          await nftContract.methods.mint(17, InstanceAddress).send({
            from: walletAddress,
            gas: 700000,
          })
            .once("error", (err) => {
              console.log(err);
              toast.error("Minting failed."); // Error toast
            })
            .once("receipt", async () => {
              const balance = await nftContract.methods.balanceOf(walletAddress, 17).call();
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
  
  contract EducatedGuess {
      bool public correctGuess;
  
      function random(uint256 guess) public {
          uint256 randomnumber = uint256(keccak256(abi.encodePacked(block.timestamp, msg.sender))) % 1000;
          require(guess == randomnumber, "Your guess is incorrect");
          correctGuess = true;
      }
  }
  
  contract HackEducatedGuess {
      EducatedGuess target;
  
      function attack(address _target , address attackerContract, uint num) public returns (uint256) {
          target = EducatedGuess(_target);
          uint256 _randomnumber = uint256(keccak256(abi.encodePacked(block.timestamp, attackerContract))) % num;
          target.random(_randomnumber);
          return _randomnumber;
      }
  }
  `;

  return (
    <>
      <Container className="game-container container-padding-fix" >
        <Card className="game-card" style={{ backgroundColor: '#000000', color: 'white' }}>
          <CardBody>
            <CardTitle className="game-title title-color" ><b>Random Number Learning Lab </b></CardTitle>
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
            <p><b>Navigate Solidity's number generation. Track and master the art of randomness. </b>
              <br /><br />
              <b><strong> You need:</strong> In order to play, you need to find a way to track the process of generating a random number in Solidity.</b></p>
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
                <h3 className="mt-1 title-color" >EducatedGuess  Address: <p className="Instance-color"> {InstanceAddress} </p></h3>
                <h3 className="mt-1 title-color" >HackEducatedGuess  Address: <p className="Instance-color"> {InstanceAddress_2} </p></h3>
              </CardBody>
            </Card>
            <Card className="game-card" style={{ backgroundColor: '#000000', color: 'white' }}>
              <CardBody>
                <CardTitle className="card-title title-color" ><b>EducatedGuess </b></CardTitle>
                <div style={{ display: 'flex', alignItems: 'flex-start', minHeight: '50px' }}>
                  <Button className="mt-1" onClick={() => correctGuess()} style={{ backgroundColor: '#355f7d', color: 'white' }}>
                    correctGuess
                  </Button>
                  {CorrectGuess !== null &&
                    <p style={{ marginLeft: '10px', marginTop: '12px' }}>
                      {CorrectGuess.toString()}
                    </p>
                  }
                </div>
                <br />
                <FormGroup>
                  <Input
                    className="form-control-alternative"
                    id="input-city"
                    placeholder="Gusess"
                    type="text"
                    onChange={(e) => setGusess(e.target.value)}
                  />
                </FormGroup>
                <Button style={{ backgroundColor: '#c97539', color: 'white' }} className="mt-1" onClick={() => random(Gusess)}>
                  random
                </Button>
              </CardBody>
            </Card>
            <Card className="game-card" style={{ backgroundColor: '#000000', color: 'white' }}>
              <CardBody>
                <CardTitle className="card-title" style={{ color: 'red' }} ><b>HackEducatedGuess </b></CardTitle>
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
                    placeholder="attackerContract"
                    type="text"
                    onChange={(e) => setattackerContract(e.target.value)}
                  />
                  <br />
                  <Input
                    className="form-control-alternative"
                    id="input-city"
                    placeholder="num"
                    type="text"
                    onChange={(e) => setNum(e.target.value)}
                  />
                </FormGroup>
                <Button style={{ backgroundColor: '#c97539', color: 'white' }} className="mt-1" onClick={() => attack(Target, attackerContract, Num)}>
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
                <Button style={{ backgroundColor: '#c97539', color: 'white' }} className="button" onClick={checkEducatedGuess}>
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
                Consider how external factors, such as the block.timestamp, can influence the generation of a "random" number.
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

export default Game17;
