import React, { useState, useRef, useContext, useEffect } from 'react';
import SocialNetworkShare from '../components/SocialNetworkShare.js'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { a11yDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { Web3Context } from '../components/Web3Context.js';
import InstanceABI from '../interfaces/Timestamp.json'
import { FormGroup, Button, Input, Container, Card, CardBody, CardTitle } from "reactstrap";
import { CopyToClipboard } from 'react-copy-to-clipboard';
 import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../assets/css/game.css';
function Game5() {
  const [Timestamp, setTimestamp] = useState("");
  const [InstanceAddress, setInstanceAddress] = useState("");
  const [TokenBalance, setTokenBalance] = useState("");
  const [isLoading, setIsLoading] = useState(false); 
  const codeRef = useRef(null);
  const { walletAddress, factoryContract, nftContract, web3 } = useContext(Web3Context);
  const [instanceContract, setInstanceContract] = useState(null);
  const [isHintVisible, setIsHintVisible] = useState(false);
  const [successState, setSuccessState] = useState(null);
  const [Hash, setHash] = useState("");
  const hintLink2 = 'https://web3js.readthedocs.io/en/v1.2.11/web3-eth.html?highlight=getBlock#getblock'

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
      const balance = await nftContract.methods.balanceOf(walletAddress, 5).call();
      setTokenBalance(balance);
    };
    fetchData();
  }, [walletAddress, nftContract, TokenBalance]);

  const createGame = async () => {
    try {
      setIsLoading(true); 
      const receipt = await factoryContract.methods.deploy(5).send({
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
            setHash(receipt.transactionHash)
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

  const timeReset = async (_Timestamp) => {
    if (isNaN(_Timestamp)) {
      alert('Invalid timestamp!');
      return;
    }
  
    if (instanceContract) {
      try {
        await instanceContract.methods.timeReset(_Timestamp).send({
          from: walletAddress,
          gas: 700000,
        }).then(async () => {
          console.log('The Mission Is Complete');
          toast("Well done! You have solved this level!", {
              position: toast.POSITION.TOP_CENTER,
              autoClose: 5000, 
            }); 
          if (TokenBalance < 1) {
            try {
              await nftContract.methods.mint(5, InstanceAddress).send({
                from: walletAddress,
                gas: 700000,
              })
                .once("error", (err) => {
                  console.log(err);
                  toast.error("Minting failed."); // Error toast
                })
                .once("receipt", async () => {
                  const balance = await nftContract.methods.balanceOf(walletAddress, 5).call();
                  setTokenBalance(balance);
                  console.log(balance);
                  toast.success("Minting completed successfully!"); // Success toast
                });
            } catch (err) {
              console.error(err.message);
              toast.error("Minting failed."); // Error toast
            }
          }
        });
      } catch (err) {
        console.log(err);
        toast.error("Time reset failed."); // Error toast
      }
    }
  };
  const success = async () => {
    const success = await instanceContract.methods.success().call();
    console.log(success);
    setSuccessState(success);
  }
  const code = `// SPDX-License-Identifier: MIT
  pragma solidity 0.8.10;
  
  contract Timestamp {
      uint256 private currentBlockTimestamp;
      bool public success;
  
      constructor() {
          currentBlockTimestamp = block.timestamp;
      }
      function timeReset(uint256 _Timestamp) external {
          require(currentBlockTimestamp == _Timestamp,"This Is Not The Timestamp");
          currentBlockTimestamp = 0;
          success = true;
      }
  }`;

  return (
    <>
    <Container className="game-container container-padding-fix">
      <Card className="game-card"  style={{ backgroundColor: '#000000', color: 'white' }}>

        <CardBody>
          <CardTitle className="game-title title-color" ><b>Timestamp Learning Lab</b></CardTitle>
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

      <Card className="game-card"  style={{ backgroundColor: '#000000', color: 'white' }}>
        <CardBody>
          <CardTitle className="card-title  title-color" ><b>Game Description</b></CardTitle>
          <p><b>Engage with Solidity's block.timestamp. Understand and ensure perfect synchronization.</b>
            <br /><br />
            <b><strong> You need:</strong>  To complete this puzzle, you need to understand how block.timestamp works in Solidity and how to access it. </b></p>
          <div>
            <Button style={{backgroundColor: '#c97539' , color: 'white'}}  className="button-margin" onClick={createGame}>
              Create Instance
            </Button>
          </div>
        </CardBody>
      </Card>
      {!isLoading && InstanceAddress !== "" && (
          <>
            <Card className="game-card"  style={{ backgroundColor: '#000000', color: 'white', minHeight: '150px' }}>
              <CardBody>
              <CardTitle className="card-title title-color" ><b>State Variables</b></CardTitle>

                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <Button style={{backgroundColor: '#355f7d' , color: 'white'}} className="mt-1" onClick={() => success()}>
                    success
                  </Button>
                  {successState !== null && 
                    <p style={{ marginLeft: '10px', marginTop: '12px' }}>
                      {successState.toString()}
                    </p>
                  }
                </div>
                <br />
                <Button style={{backgroundColor: '#355f7d' , color: 'white'}} className="mt-1" onClick={toggleHint}>
                  {isHintVisible ? 'Hide Hint' : 'Show Hint'}
                </Button>
              </CardBody>
            </Card>
            
            <Card className="game-card"  style={{ backgroundColor: '#000000', color: 'white' }}>
              <CardBody>
                <h3 className="mt-1 title-color" >Your Test Address: <p className="Instance-color"> {InstanceAddress} </p></h3>
                <FormGroup>
                <Input
                className="form-control-alternative"
                id="input-city"
                placeholder="_Timestamp"
                type="text"
                onChange={(e) => setTimestamp(e.target.value)}
              />
                </FormGroup>
                <Button style={{backgroundColor: '#c97539' , color: 'white'}} className="mt-1" onClick={() => timeReset(Timestamp)}>
                  timeReset
                </Button>
              </CardBody>
            </Card>
          </>
        )}
     
      {isHintVisible && (
        <Card className="card"  style={{ backgroundColor: '#000000', color: 'white' }}>
          <CardBody>
            <CardTitle className="card-title title-color" ><b>Hint</b></CardTitle>
            <p>
              <strong>
                <p style={{ wordBreak: "break-all" }}> You will find the block number in the block explorer by this hash: "{Hash}".</p>
                <br />
                <p style={{ wordBreak: "break-all" }}>Then use this function:</p>
                <a style={{ textDecoration: "underline" }} href={hintLink2} target="_blank" rel="noopener noreferrer"> https://web3js.readthedocs.io/en/v1.2.11/web3-eth.html?highlight=getBlock#getblock</a>
              </strong>.
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
              <SocialNetworkShare description={'Timestamp'}/>
            </div>
          )}
            </p>
    </Container>
     
    <ToastContainer position={toast.POSITION.BOTTOM_RIGHT} />
    </>
  );


}

export default Game5;
