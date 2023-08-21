import React, { useState, useRef, useContext, useEffect } from 'react';
import SocialNetworkShare from '../components/SocialNetworkShare.js'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { a11yDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { Web3Context } from '../components/Web3Context.js';
import InstanceABI from '../interfaces/InterfaceId.json'
import { FormGroup, Button, Input, Container, Card, CardBody, CardTitle } from "reactstrap";
import { CopyToClipboard } from 'react-copy-to-clipboard';
 import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../assets/css/game.css';
function Game10() {
  const [id, setid] = useState("");
  const [InstanceAddress, setInstanceAddress] = useState("");
  const [TokenBalance, setTokenBalance] = useState("");
  const [isLoading, setIsLoading] = useState(false); 
  const codeRef = useRef(null);
  const { walletAddress, factoryContract, nftContract, web3 } = useContext(Web3Context);
  const [instanceContract, setInstanceContract] = useState(null);
  const [isHintVisible, setIsHintVisible] = useState(false);
  const hintLink = 'https://emn178.github.io/online-tools/keccak_256.html'
  const [_answer, setAnswer] = useState(null); 

  const toggleHint = () => {
    setIsHintVisible(!isHintVisible);
  };

  useEffect(() => {
    if (web3.utils.isAddress(InstanceAddress)) {
      setInstanceContract(new web3.eth.Contract(InstanceABI, InstanceAddress));
    }
  }, [InstanceAddress]);

  useEffect(() => {
    const fetchData = async () => {
      if (!walletAddress || !nftContract) {
        return;
      }
      const balance = await nftContract.methods.balanceOf(walletAddress, 10).call();
      setTokenBalance(balance);
    };
    fetchData();
  }, [walletAddress, nftContract, TokenBalance]);

  const createGame = async () => {
    try {
      setIsLoading(true); 
      const receipt = await factoryContract.methods.deploy(10).send({
        from: walletAddress,
        gas: 700000,
      });
      const blockNumber = await web3.eth.getBlockNumber();
      await factoryContract.getPastEvents('DeployInstance', {
        filter: { sender: walletAddress },
        fromBlock: blockNumber - 900, toBlock: 'latest'
      }, async (error, events) => {
        for (let index = 0; index < events.length; index++) {
          if (receipt.transactionHash === events[index].transactionHash) {
            setInstanceAddress(events[index].returnValues.Instance);
          }
        }
      });
      setIsLoading(false);
      toast.success("Game created successfully!");
    } catch (err) {
      setIsLoading(false);
      console.log(err);
      toast.error("Game creation failed. Please make sure your Metamask wallet is properly connected.");
    }
  };


  const CalcMe = async (id) => {
    let inputid = id.startsWith('0x') ? id.slice(2) : id;

    if (!web3.utils.isHex(id) && isNaN(id) || !/^([0-9A-Fa-f]{8})$/.test(inputid)) {
      alert('Invalid input! Please provide a valid integer or hexadecimal');
      return;
    }


    let inputId = isNaN(id) ? id : web3.utils.toHex(id);

    if (instanceContract) {
      try {
        await instanceContract.methods.CalcMe(inputId).send({
          from: walletAddress,
          gas: 700000,
        }).then(async () => {
          const ans = await instanceContract.methods.answer().call()

          if (ans == true) { 
            console.log('The Mission Is Complete');
            toast("Well done! You have solved this level!", {
                position: toast.POSITION.TOP_CENTER,
                autoClose: 5000, 
              }); 
            if (TokenBalance < 1) {
              try {
                await nftContract.methods.mint(10, InstanceAddress).send({
                  from: walletAddress,
                  gas: 700000,
                })
                  .once("error", (err) => {
                    console.log(err);
                    toast.error("Minting failed."); // Error toast
                  })
                  .once("receipt", async () => {
                    const balance = await nftContract.methods.balanceOf(walletAddress, 10).call();
                    setTokenBalance(balance);
                    console.log(balance);
                    toast.success("Minting completed successfully!"); // Success toast
                  });
              } catch (err) {
                console.error(err.message);
                toast.error("Minting failed."); // Error toast
              }
            }
          }

        });
      } catch (err) {
        console.error(err.message);
        toast.error("CalcMe operation failed."); // Error toast
      }
    }
  };

  const answer = async () => {
    const ans = await instanceContract.methods.answer().call()
    console.log(ans);
    setAnswer(ans); 
  }

  const code = `// SPDX-License-Identifier: MIT
  pragma solidity ^0.8.10;
  
  contract InterfaceId {
      bool public answer;
  
      function CalcMe(bytes4 id) external {
          require(id == bytes4(keccak256("CalcMe(bytes4)")), "Calc Me Again!");
          answer = true;
      }
  }
  `;

  return (
    <>
      <Container className="game-container container-padding-fix">
        <Card className="game-card" style={{ backgroundColor: '#000000', color: 'white' }}>

          <CardBody>
            <CardTitle className="game-title title-color" ><b>Signature Learning Lab</b></CardTitle>
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

        <Card className="game-card" style={{ backgroundColor: '#000000', color: 'white' }}>
          <CardBody>
            <CardTitle className="card-title title-color" ><b>Game Description</b></CardTitle>
            <p><b>Decipher function signatures in Solidity. Compute and match using cryptographic functions.</b>
              <br /><br />
              <b><strong> You need:</strong> To solve this puzzle, you need to understand function signatures in Solidity, how to compute them using the keccak256 hash function, and how to convert them into the bytes4 type. </b>
            </p>
            <div>
              <Button style={{backgroundColor: '#c97539' , color: 'white'}} className="button-margin" onClick={createGame}>
                Create Instance
              </Button>
            </div>
          </CardBody>
        </Card>

        {!isLoading && InstanceAddress !== "" && (
          <>
            <Card className="game-card" style={{ backgroundColor: '#000000', color: 'white', minHeight: '150px' }}>
              <CardBody>
              <CardTitle className="card-title title-color" ><b>State Variables</b></CardTitle>

                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <Button style={{backgroundColor: '#355f7d' , color: 'white'}} className="mt-1" onClick={() => answer()}>
                    answer
                  </Button>
                  {_answer !== null && 
                  <p style={{ marginLeft: '10px', marginTop: '12px' }}>
                    {_answer.toString()}
                  </p>}
                </div>
                <br />
                <Button style={{backgroundColor: '#355f7d' , color: 'white'}} className="mt-1" onClick={toggleHint}>
                  {isHintVisible ? 'Hide Hint' : 'Show Hint'}
                </Button>
              </CardBody>
            </Card>

            <Card className="game-card" style={{ backgroundColor: '#000000', color: 'white' }}>
              <CardBody>
                <h3 className="mt-1 title-color" >Your Test Address: <p className="Instance-color"> {InstanceAddress} </p></h3>
                <FormGroup>
                  <Input
                    className="form-control-alternative"
                    id="input-city"
                    placeholder="ID"
                    type="text"
                    onChange={(e) => setid(e.target.value)}
                  />
                </FormGroup>
                <Button style={{backgroundColor: '#c97539' , color: 'white'}} className="mt-1" onClick={() => CalcMe(id)}>
                  CalcMe
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
                <strong>Calculate the function signature </strong> <a style={{ textDecoration: "underline" }} href={hintLink} target="_blank" rel="noopener noreferrer"><strong>Here</strong></a>.
                <br />
                <strong><strong>Or</strong></strong>
                <br />
                <strong>Write a function according to the following interface:<strong> function Calc() external pure returns (bytes4);</strong></strong>
              </p>
            </CardBody>
          </Card>
        )}
        <p style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        {TokenBalance < 1 ? null : (
            <div>
 
              <strong>
                Congratulations! You Got A Badge{" "}
                <i className="fas fa-medal" style={{ color: "gold", fontSize: "20px", position: 'relative', top: '3px' }}></i>
              </strong>
              <br/><br/>
              <SocialNetworkShare description={'Interfaceid'}/>
            </div>
          )}
        </p>
      </Container>
       
      <ToastContainer position={toast.POSITION.BOTTOM_RIGHT} />
    </>
  );


}

export default Game10;
