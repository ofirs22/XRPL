import React, { useState, useRef, useContext, useEffect } from 'react';
import SocialNetworkShare from '../components/SocialNetworkShare.js'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { a11yDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { Web3Context } from '../components/Web3Context.js';
import InstanceABI from '../interfaces/Bytes2.json'
import { FormGroup, Button, Input, Container, Card, CardBody, CardTitle, Collapse } from "reactstrap";
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../assets/css/game.css';
function Game1() {
  const [Bytes2, setBytes2] = useState("");
  const [InstanceAddress, setInstanceAddress] = useState("");
  const [TokenBalance, setTokenBalance] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const codeRef = useRef(null);
  const { walletAddress, factoryContract, nftContract, web3 } = useContext(Web3Context);
  const [instanceContract, setInstanceContract] = useState(null);
  const [isHintVisible, setIsHintVisible] = useState(false);
  const [Num, setNum] = useState("");

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
      const balance = await nftContract.methods.balanceOf(walletAddress, 1).call();
      setTokenBalance(balance);
    };
    fetchData();
  }, [walletAddress, nftContract, TokenBalance]);

  const createGame = async () => {
    try {
      setIsLoading(true);
      const receipt = await factoryContract.methods.deploy(1).send({
        from: walletAddress,
        gas: 700000,
      });

      const deployInstanceEvent = receipt.events.DeployInstance;
      if (deployInstanceEvent) {
        setInstanceAddress(deployInstanceEvent.returnValues.Instance);
        toast.success("Game created successfully!"); // Success toast
      } else {
        toast.error("Game creation failed."); // Error toast
      }

      setIsLoading(false);
    } catch (err) {
      setIsLoading(false);
      console.log(err);
      toast.error(`Game creation failed. 
      Please make sure:
-That your Metamask wallet is properly connected.`); // Error toast
    }
  };


  const increaseNum = async (Bytes2) => {
    let inputBytes2 = Bytes2.startsWith('0x') ? Bytes2.slice(2) : Bytes2;

    if (!/^([0-9A-Fa-f]{1,4})$/.test(inputBytes2)) {
      alert('Invalid input! Please provide a valid hexadecimal string (2 bytes)');
      return;
    }

    if (instanceContract) {
      try {
        let paddedInput = inputBytes2.padStart(4, '0');

        await instanceContract.methods.increaseNum(web3.utils.toHex('0x' + paddedInput)).send({
          from: walletAddress,
          gas: 700000,
        }).then(async () => {
          console.log('Transaction sent successfully!');
          toast("Well done! You have solved this level!", {
            position: toast.POSITION.TOP_CENTER,
            autoClose: 5000,
          });          if (TokenBalance < 1) {
            try {
              await nftContract.methods.mint(1, InstanceAddress).send({
                from: walletAddress,
                gas: 700000,
              })
                .once("error", (err) => {
                  console.log(err);
                  toast.error("Minting failed."); // Error toast
                })
                .once("receipt", async () => {
                  const balance = await nftContract.methods.balanceOf(walletAddress, 1).call();
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
        console.error(err.message);
        toast.error("Transaction failed."); // Error toast
      }
    }
  };


  const num = async () => {
    const num = await instanceContract.methods.num().call()
    setNum(num)
    console.log(num);
  }


  const code = `// SPDX-License-Identifier: MIT
    pragma solidity ^0.8.10;
    
    contract Bytes2 {
        bytes2 public num = 0;
    
        function increaseNum(bytes2 _biggerNum) external {
            require(_biggerNum != bytes2(0), "biggerNum cannot be zero");
            num = _biggerNum;
        }
    }`;

  return (
    <>
      <Container className="game-container container-padding-fix" >
        <Card className="game-card" style={{ backgroundColor: '#000000', color: 'white' }}>

          <CardBody>
            <CardTitle className="game-title title-color" ><b>Byte2 Learning Lab</b></CardTitle>
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
            <p><b>Traverse the bytes2 data type in Solidity. Share insights and master byte manipulation. </b>
              <br /><br />
              <b><strong> You need:</strong>   To play this game, you need to understand Solidity's bytes data type, specifically bytes2, and how to use it in a contract function.</b></p>
            <div>
              <Button className="button-margin" onClick={createGame} style={{backgroundColor: '#c97539' , color: 'white'}}>
                Create Instance
              </Button>
            </div>
          </CardBody>
        </Card>

        {!isLoading && InstanceAddress !== "" && (
          <>
            <Card className="game-card" style={{ backgroundColor: '#000000', color: 'white' }}>
              <CardBody>
              <CardTitle className="card-title title-color" ><b>State Variables</b></CardTitle>
                <div style={{ display: 'flex', alignItems: 'flex-start', minHeight: '50px' }}>
                  <Button  className="mt-1" onClick={() => num()} style={{backgroundColor: '#355f7d' , color: 'white'}}>
                    num
                  </Button>
                  {Num !== '' && <p style={{ marginLeft: '10px', marginTop: '12px' }}>{Num}</p>}
                </div>
                <br />
                <Button className="mt-1" onClick={toggleHint} style={{backgroundColor: '#355f7d' , color: 'white'}}>
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
                    placeholder="_biggerNum"
                    type="text"
                    onChange={(e) => setBytes2(e.target.value)}
                  />
                </FormGroup>
                <Button style={{backgroundColor: '#c97539' , color: 'white'}} className="mt-1" onClick={() => increaseNum(Bytes2)}>
                  increaseNum
                </Button>
              </CardBody>
            </Card>
          </>
        )}

        <Collapse isOpen={isHintVisible}>
          <Card className="game-card" style={{ backgroundColor: '#000000', color: 'white' }}>
            <CardBody>
              <CardTitle className="game-title title-color" >Hint</CardTitle>
              <p>
                A bytes2 data type is represented by four hexadecimal digits.
                Each hexadecimal digit represents four binary bits,
                and since a bytes2 consists of sixteen bits, it requires four hexadecimal digits to represent all possible values.
                In hexadecimal notation, the values range from 0x0000 to 0xFFFF,
                where 0x0000 represents the minimum value (0 in decimal) and 0xFFFF represents the maximum value (65535 in decimal).
              </p>
            </CardBody>
          </Card>
        </Collapse>
        <p style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          {TokenBalance < 1 ? null : (
            <div>
 
              <strong>
                Congratulations! You Got A Badge{" "}
                <i className="fas fa-medal" style={{ color: "gold", fontSize: "20px", position: 'relative', top: '3px' }}></i>
              </strong>
              <br/><br/>
              <SocialNetworkShare description={'Bytes2'} />
            </div>
          )}
        </p>
      </Container>
       
      <ToastContainer position={toast.POSITION.BOTTOM_RIGHT} />

    </>
  );




}

export default Game1;
