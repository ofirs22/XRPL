import React, { useState, useRef, useContext, useEffect } from 'react';
import SocialNetworkShare from '../components/SocialNetworkShare.js'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { a11yDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { Web3Context } from '../components/Web3Context.js';
import InstanceABI from '../interfaces/LevelFactory.json'
import { FormGroup, Button, Input, Container, Card, CardBody, CardTitle, Collapse } from "reactstrap";
import { CopyToClipboard } from 'react-copy-to-clipboard';
 import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../assets/css/game.css';

function Game14() {
  const [Add, setAdd] = useState("");
  const [InstanceAddress, setInstanceAddress] = useState("");
  const [TokenBalance, setTokenBalance] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const codeRef = useRef(null);
  const { walletAddress, factoryContract, nftContract, web3 } = useContext(Web3Context);
  const [instanceContract, setInstanceContract] = useState(null);
  const [isHintVisible, setIsHintVisible] = useState(false);
  const [CorrectPrediction, setCorrectPrediction] = useState(null);
  const [Salt, setSalt] = useState(null);
  const [Bytecode, setBytecode] = useState(null);
  const [_addr, set_addr] = useState("");
  const [_sal, set_sal] = useState("");
  const [_bytecode, set_bytecode] = useState("");
  const [_Address, set_Address] = useState("");



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
      const balance = await nftContract.methods.balanceOf(walletAddress, 14).call();
      setTokenBalance(balance);
    };
    fetchData();
  }, [walletAddress, nftContract, TokenBalance]);

  const createGame = async () => {
    try {
      setIsLoading(true);
      const receipt = await factoryContract.methods.deploy(14).send({
        from: walletAddress,
        gas: 1200000,
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
      toast.error("Game creation failed. Please make sure your Metamask wallet is properly connected."); // Error toast
    }
  };


  const _deploy = async (Add) => {

    if (instanceContract) {
      try {

        await instanceContract.methods.deploy(Add).send({
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
              await nftContract.methods.mint(14, InstanceAddress).send({
                from: walletAddress,
                gas: 700000,
              })
                .once("error", (err) => {
                  console.log(err);
                  toast.error("Minting failed."); // Error toast
                })
                .once("receipt", async () => {
                  const balance = await nftContract.methods.balanceOf(walletAddress, 14).call();
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

  const correctPrediction = async () => {
    const correctPrediction = await instanceContract.methods.correctPrediction().call()
    setCorrectPrediction(correctPrediction)
    console.log(correctPrediction);
  }


  const _Salt = async () => {
    const _Salt = await instanceContract.methods._salt().call()
    setSalt(_Salt)
    console.log(_Salt);
  }

  const bytecode = async () => {
    const bytecode = await instanceContract.methods.bytecode().call()
    setBytecode(bytecode)
    console.log(bytecode);
  }

  const checkAddress = async (_addr, _sal, _bytecode) => {
    if (instanceContract) {
      try {
        const _address = await instanceContract.methods.checkAddress(_addr, Number(_sal), _bytecode).call();
        console.log(_address);
        set_Address(_address)
      } catch (err) {
        console.error(err.message);
      }
    }
  };

  const code = `
  
  // SPDX-License-Identifier: MIT

  pragma solidity ^0.8.10;
  
  contract SomeContract {
    /*
          ~~~~                                       ~~~~ 
      ~~                                           ~~
        ~~                                           ~~
      ~~                                            ~~
        ~~                                           ~~
      ________                                    _______
     /  |   | \\                                  / |   | \\
    / __|___|__\\                                /__|___|__\\
   / ||_|___|_||\\                              /||_|___|_||\\
  /              \\                            /             \\
 /                \\                          /               \\
/__________________\\ ______________________ /_________________\\
|   ____________    ||   ____    ____     ||   ____________    |
|  |            |   ||  |    |  |    |    ||  |            |   |
|  |____________|   ||  |____|  |____|    ||  |____________|   |
|                   ||                    ||                   |
|   _____________   ||   _____________    ||   _____________   |
|  |             |  ||  |             |   ||  |             |  |
|  |   _     _   |  ||  |   _     _   |   ||  |   _     _   |  |
|  |  | |   | |  |  ||  |  | |   | |  |   ||  |  | |   | |  |  |
|__|__| |___| |__|__||__|__| |___| |__|___||__|__| |___| |__|__|        
                                                                 */
  }
  
  contract Factory {
      SomeContract[] public SomeContracts;
  
      bool public correctPrediction;
  
      uint256 public _salt = 1;
  
      bytes public bytecode = type(SomeContract).creationCode;
  
      function checkAddress(address _addr, uint256 _sal, bytes memory _bytecode)
          external
          pure
          returns (address)
      {
          bytes32 result = keccak256(
              abi.encodePacked(
                  bytes1(0xff),
                  address(_addr),
                  _sal,
                  keccak256(_bytecode)
              )
          );
          return address(uint160(uint256(result)));
      }
  
      function deploy(address _add) external{
            require(_add != address(0), "Address must not be null");
            bytes32 salt = bytes32(_salt);
            SomeContract someContract = (new SomeContract){salt: salt}();
            SomeContracts.push(someContract);
            if (address(SomeContracts[0]) == _add){
            correctPrediction = true;
            }
            require(correctPrediction,"not correct");
        }
  }
  `;

  return (
    <>
      <Container className="game-container container-padding-fix" >
        <Card className="game-card" style={{ backgroundColor: '#000000', color: 'white' }}>
          <CardBody>
            <CardTitle className="game-title title-color" ><b>Contract Learning Lab</b></CardTitle>
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
            <p><b>Anticipate contract deployments in Solidity. Calculate and predict with accuracy. </b>
              <br /><br />
              <b><strong> You need:</strong>understand how a smart contract address is calculated and calculate the address where the SomeContract contract will be deployed.</b></p>
            <div>
              <Button style={{backgroundColor: '#c97539' , color: 'white'}} className="button-margin" onClick={createGame}>
                Create Instance
              </Button>
            </div>
          </CardBody>
        </Card>

        {!isLoading && InstanceAddress !== "" && (
          <>
            <Card className="game-card" style={{ backgroundColor: '#000000', color: 'white' }}>
              <CardBody>
              <CardTitle className="card-title title-color" ><b>State Variables & Call Functions</b></CardTitle>

                <div style={{ display: 'flex', alignItems: 'flex-start', minHeight: '50px' }}>
                  <Button style={{backgroundColor: '#355f7d' , color: 'white'}} className="mt-1" onClick={() => correctPrediction()}>
                    CorrectPrediction
                  </Button>
                  {CorrectPrediction !== null &&
                    <p style={{ marginLeft: '10px', marginTop: '12px' }}>
                      {CorrectPrediction ? "True" : "False"}
                    </p>
                  }                </div>
                <br />
                <div style={{ display: 'flex', alignItems: 'flex-start', minHeight: '50px' }}>
                  <Button style={{backgroundColor: '#355f7d' , color: 'white'}} className="mt-1" onClick={() => _Salt()}>
                    Salt
                  </Button>
                  {Salt !== '' && <p style={{ marginLeft: '10px', marginTop: '12px' }}>{Salt}</p>}
                </div>
                <br />
                <div style={{ display: 'flex', alignItems: 'flex-start', minHeight: '50px' }}>
                  <Button style={{backgroundColor: '#355f7d' , color: 'white'}} className="mt-1" onClick={() => bytecode()}>
                    bytecode
                  </Button>
                  {Bytecode !== null &&
                    <p style={{ wordBreak: "break-all" }}> {JSON.stringify(Bytecode)}</p>}
                </div>
                <br />
                <FormGroup>
                  <Input
                    className="form-control-alternative"
                    id="input-city"
                    placeholder="_addr"
                    type="text"
                    onChange={(e) => set_addr(e.target.value)}
                  />
                  <br />
                  <Input
                    className="form-control-alternative"
                    id="input-city"
                    placeholder="_sal"
                    type="text"
                    onChange={(e) => set_sal(e.target.value)}
                  />
                  <br />
                  <Input
                    className="form-control-alternative"
                    id="input-city"
                    placeholder="_bytecode"
                    type="text"
                    onChange={(e) => set_bytecode(e.target.value)}
                  />
                </FormGroup>
                <Button style={{backgroundColor: '#355f7d' , color: 'white'}} className="mt-1" onClick={() => checkAddress(_addr, _sal, _bytecode)}>
                  checkAddress
                </Button>
                {_Address !== '' && <p style={{ marginLeft: '10px', marginTop: '12px' }}>{_Address}</p>}
                <br />
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
                    placeholder="_add"
                    type="text"
                    onChange={(e) => setAdd(e.target.value)}
                  />
                </FormGroup>
                <Button style={{backgroundColor: '#c97539' , color: 'white'}} className="mt-1" onClick={() => _deploy(Add)}>
                  deploy
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
                calc the deployed address: keccak256(abi.encodePacked(bytes1(0xff), address(this), salt, keccak256(bytecode)))
                .
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
              <SocialNetworkShare description={'Factory'}/>
            </div>
          )}
        </p>
      </Container>
       
      <ToastContainer position={toast.POSITION.BOTTOM_RIGHT} />

    </>
  );
}

export default Game14;
