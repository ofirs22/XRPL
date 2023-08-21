import { useContext, useEffect, useState, useRef } from 'react';
import { Card, CardBody, CardTitle, Container, Row, Col } from "reactstrap";
import { Web3Context } from '../Web3Context';
import { TypeAnimation } from 'react-type-animation';
import '../../assets/css/game.css'

const Header = ({ scrollToRef }) => {
  const web3Context = useContext(Web3Context);
  const [walletAddress, setWalletAddress] = useState(web3Context.walletAddress);
  const [Chain, setChain] = useState(web3Context.Chain);
  const { nftContract } = useContext(Web3Context);
  const [tokenIDs, setTokenIDs] = useState(JSON.parse(localStorage.getItem('achievements')) || []);
  const walletAddressRef = useRef(walletAddress);
  const chainRef = useRef(Chain);

  // useEffect(() => {
  //   console.log('Chain:', Chain);
  //   console.log('tokenIDs:', tokenIDs);
  //   console.log('walletAddress:', walletAddress);

  //   if (nftContract !== null) {
  //     console.log('nftContract:', nftContract);
  //     console.log('nftContract _address:', nftContract._address);
  //   } else {
  //     console.log("nftContract is null");
  //   }
  // }, [tokenIDs, walletAddress, nftContract, Chain]);
  
  useEffect(() => {
    if (nftContract) {
      updateAchievements(walletAddress);
    }
  }, [nftContract, walletAddress]);

  const updateAchievements = async (address) => {
    if (!nftContract) {
      console.error("nftContract is null");
      return;
    }
  
    let tempTokenIDs = [];
    for (let index = 1; index <= 17; index++) {
      try {
        const balance = await nftContract.methods.balanceOf(address, index).call();
        if (balance > 0) {
          tempTokenIDs.push(index);
        }
      } catch (e) {
        console.error(`Failed to fetch balance for token ${index} on network ${chainRef.current}. Error: ${e.message}`);
      }
    }
    setTokenIDs(tempTokenIDs);
  };

  
  useEffect(() => {
    if (tokenIDs.length > 0) {
      localStorage.setItem('achievements', JSON.stringify(tokenIDs));
    }
  }, [tokenIDs]);

  useEffect(() => {
    walletAddressRef.current = walletAddress;
    chainRef.current = Chain;
    updateAchievements(walletAddress);
  }, [walletAddress, Chain]);

  useEffect(() => {
    setWalletAddress(web3Context.walletAddress);
    setChain(web3Context.Chain);
    const ethereum = window.ethereum;
    if (ethereum && ethereum.on) {
      const handleAccountsChanged = function (accounts) {
        setWalletAddress(accounts[0]);
        
      };
      const handleChainChanged = (chainId) => {
        const decimalChainId = parseInt(chainId, 16);
        setChain(decimalChainId);
      };

      ethereum.on('accountsChanged', handleAccountsChanged);
      ethereum.on('chainChanged', handleChainChanged);

      return () => {
        if (ethereum && ethereum.removeListener) {
          ethereum.removeListener('accountsChanged', handleAccountsChanged);
          ethereum.removeListener('chainChanged', handleChainChanged);
        }
      }
    }
  }, [web3Context.walletAddress, web3Context.Chain]);


useEffect(() => {
    walletAddressRef.current = walletAddress;
    chainRef.current = Chain;
}, [walletAddress, Chain]);

useEffect(() => {
    const fetchData = async () => {
        let tempTokenIDs = [];
        for (let index = 1; index <= 17; index++) {
            try {
                const balance = await nftContract.methods.balanceOf(walletAddressRef.current, index).call();
                if (balance > 0) {
                    tempTokenIDs.push(index);
                }
            } catch (e) {
                console.error(`Failed to fetch balance for token ${index} on network ${chainRef.current}. Error: ${e.message}`);
            }
        }
        setTokenIDs(tempTokenIDs);
    };
        fetchData();
}, [nftContract]);

const tokenIDtoGame = {
  1: 'Byte2 Lab',
  2: 'Fallback Lab',
  3: 'Balance Lab',
  4: 'Wei Lab',
  5: 'Timestamp Lab',
  6: 'Gas Lab',
  7: 'Password Lab',
  8: 'Overflow Lab',
  9: 'BlockHash Lab',
  10: 'Signature Lab',
  11: 'EncodeData Lab',
  12: 'Hash Lab',
  13: 'DecodeData Lab',
  14: 'Contract Lab',
  15: 'Interface Lab',
  16: 'Ticket Lab',
  17: 'Random Lab'
};
  return (
    <div className="header header-component mt--0  pt-md-9 header-background ">
      <br />
      <Container fluid>
        <div className="header-body">
          <Row>
            <Col xl="1" />

            <Col lg="6" xl="8">
              <Card className=" mb-4 mb-xl-0 card-fixed " style={{ backgroundColor: '#000000', color: 'white', position: 'relative', top: '320px' }}>
                <CardBody>
                  <Row>
                    <div className="col">
                      <CardTitle
                        tag="h5"
                        className="text-uppercase mb--1 "
                        style={{ color: '#ffffff', fontFamily: 'Montserrat', fontSize: '17px' }}
                      >
                        Achievements
                      </CardTitle>
                      <br />
                      <Row>
                        {tokenIDs.length === 0 ? (
                          <Col className="d-flex align-items-center justify-content-center">
                            <span className="h2 font-weight-bold mb-0 mb--6" style={{ color: '#a3a4af', fontSize: '13px' }}>
                              There are no achievements
                            </span>
                          </Col>
                        ) : (
                          tokenIDs.map((id, index) => (
                            <Col md="2" key={index}>
                              <span className="h2 font-weight-bold mb-0 " style={{ color: '#a3a4af', fontSize: '11px' }}>
                                {tokenIDtoGame[id]}
                                <i className="fas fa-medal" style={{ marginLeft: '5px', color: '#f2a23dba' }} />
                              </span>
                            </Col>
                          ))
                        )}
                      </Row>
                    </div>
                  </Row>
                </CardBody>
              </Card>
            </Col>
            <Col xl="2">
              <button 
                className="btn btn-black button-custom button-fixed align-items-center justify-content-center hide-on-small" 
                style={{position: 'relative', top: '370px', color:'#31EA8A'}}
                onClick={() => {
                  if (scrollToRef.current) {
                    scrollToRef.current.scrollIntoView({ behavior: 'smooth' });
                  }
                }}
              >
                GET STARTED
              </button>
            </Col>
          </Row>
        </div>
      </Container>
      <br />



    </div>
  );
};

export default Header;
