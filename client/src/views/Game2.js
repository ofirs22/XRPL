import React, { useState, useRef, useContext, useEffect } from 'react';
import SocialNetworkShare from '../components/SocialNetworkShare.js'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { a11yDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { Web3Context } from '../components/Web3Context.js';
import { Button, Container, Card, CardBody, CardTitle } from "reactstrap";
import { CopyToClipboard } from 'react-copy-to-clipboard';
import InstanceABI from '../interfaces/Fallback.json'
 import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../assets/css/game.css';

function Game2() {
    const [InstanceAddress, setInstanceAddress] = useState("");
    const [TokenBalance, setTokenBalance] = useState("");
    const [isLoading, setIsLoading] = useState(false); 
    const codeRef = useRef(null);
    const { walletAddress, factoryContract, nftContract, web3 } = useContext(Web3Context);
    const [isHintVisible, setIsHintVisible] = useState(false);
    const [instanceContract, setInstanceContract] = useState(null);
    const [fixMeState, setFixMeState] = useState(false);
    const [isButtonClicked, setIsButtonClicked] = useState(false);

    const hintLink = "https://docs.soliditylang.org/en/v0.8.10/contracts.html?highlight=fallback#fallback-function";

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
            const balance = await nftContract.methods.balanceOf(walletAddress, 2).call();
            setTokenBalance(balance);
            console.log(TokenBalance);
        };
        fetchData();
    }, [walletAddress, nftContract, TokenBalance]);

    const createGame = async () => {
        try {
            setIsLoading(true); 
            const receipt = await factoryContract.methods.deploy(2).send({
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
            toast.success("Game created successfully!"); // Success toast
        } catch (err) {
            setIsLoading(false);
            console.log(err);
            toast.error("Game creation failed. Please make sure your Metamask wallet is properly connected."); // Error toast
        }
    };

    const checkFallbackGame = async () => {
        const fixMeValue = await instanceContract.methods.fixMe().call();
        console.log(fixMeValue);
        setFixMeState(fixMeValue);
        if(fixMeValue == true){
            console.log('The Mission Is Complete');
            toast("Well done! You have solved this level!", {
                position: toast.POSITION.TOP_CENTER,
                autoClose: 5000, 
              }); 
        if (TokenBalance < 1) {
            try {
                await nftContract.methods.mint(2, InstanceAddress).send({
                    from: walletAddress,
                    gas: 700000,
                })
                    .once("error", (err) => {
                        console.log(err);
                        toast.error("Minting failed."); // Error toast
                    })
                    .once("receipt", async () => {
                        const balance = await nftContract.methods.balanceOf(walletAddress, 2).call();
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
    };
    const fixMe = async () => {
        setIsButtonClicked(true); 
        const fixMeValue = await instanceContract.methods.fixMe().call();
        console.log(fixMeValue);
        setFixMeState(fixMeValue);
    }


    const code = `// SPDX-License-Identifier: MIT
    pragma solidity ^0.8.10;
    
    contract Fallback {
        uint8 num = 0;
        
        function fixMe() external view returns (bool) {
            return num == 1;
        }
    
        fallback() external {
            num = 1;
        }
    }`;

    return (
        <>
            <Container className="game-container container-padding-fix">
                <Card className="card" style={{ backgroundColor: '#000000', color: 'white' }}>

                    <CardBody>
                        <CardTitle className="card-title title-color" ><b>Fallback Learning Lab</b></CardTitle>
                        <div style={{ position: 'relative' }}>
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

                <Card className="card" style={{ backgroundColor: '#000000', color: 'white' }}>
                    <CardBody>
                        <CardTitle className="card-title title-color" ><b>Game Description</b></CardTitle>
                        <p><b>Delve into Solidity's fallback intricacies. Discover its mechanics and maximize its potential. </b>
                            <br /><br />
                            <b><strong> You need:</strong>  To complete this mission, you need to understand how Solidity's fallback function works, when it's triggered, and how to activate it. </b></p>
                        <div>
                            <Button style={{backgroundColor: '#c97539' , color: 'white'}} className="button" onClick={createGame}>
                                Create Instance
                            </Button>
                        </div>

                    </CardBody>
                </Card>

                {!isLoading && InstanceAddress !== "" && (
                    <>
                        <Card className="card" style={{ backgroundColor: '#000000', color: 'white', minHeight: '150px' }}>
                            <CardBody>
                            <CardTitle className="card-title title-color" ><b>State Variables & Call Functions</b></CardTitle>
                                <div style={{ display: 'flex', alignItems: 'center' }}>
                                    <Button style={{backgroundColor: '#355f7d' , color: 'white'}} className="button" onClick={fixMe}>
                                        fixMe
                                    </Button>
                                    {isButtonClicked && fixMeState !== null && <p style={{ marginLeft: '10px', marginTop: '12px' }}>{fixMeState.toString()}</p>}
                                </div>
                                <br />
                                <Button style={{backgroundColor: '#355f7d' , color: 'white'}} className="button" onClick={toggleHint}>
                                    {isHintVisible ? 'Hide Hint' : 'Show Hint'}
                                </Button>
                            </CardBody>
                        </Card>


                        <Card className="card" style={{ backgroundColor: '#000000', color: 'white' }}>
                            <CardBody>
                                <h3 className="mt-1 title-color" >Your Test Address: <p className="Instance-color"> {InstanceAddress} </p></h3>
                                <Button style={{backgroundColor: '#c97539' , color: 'white'}} className="button" onClick={checkFallbackGame}>
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
                                <strong>Interact with the contract using Remix, and remember that the fallback function is executed on a call to the contract if none of the other functions match the given function signature or if no data was supplied at all and there is no receive Ether function. 
                                The fallback function always receives data, but in order to also receive Ether it must be marked payable.
                                    You Can Read More  </strong> <a style={{ textDecoration: "underline" }} href={hintLink} target="_blank" rel="noopener noreferrer"><strong>Here</strong></a>.
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
              <SocialNetworkShare description={'Fallback'}/>
            </div>
          )}
                </p>
            </Container>
             
            <ToastContainer position={toast.POSITION.BOTTOM_RIGHT} />

        </>
    );

}

export default Game2;
