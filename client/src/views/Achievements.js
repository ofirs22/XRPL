import { useContext, useEffect, useState, useRef } from 'react';
import { Web3Context } from '../components/Web3Context';
import 'react-toastify/dist/ReactToastify.css';
import '../assets/css/game.css';

const Achievements = ({ scrollToRef }) => {
   const web3Context = useContext(Web3Context);
   const [walletAddress, setWalletAddress] = useState(web3Context.walletAddress);
   const [Chain, setChain] = useState(web3Context.Chain);
   const { nftContract } = useContext(Web3Context);
   const [tokenIDs, setTokenIDs] = useState(JSON.parse(localStorage.getItem('achievements')) || []);
   const walletAddressRef = useRef(walletAddress);
   const chainRef = useRef(Chain);
   const [selectedImage, setSelectedImage] = useState(null);

   const baseURL = "https://ipfs.io/ipfs/QmVLYCo36zD44BSnU51RDLmReAHctvm6uv4JZv4zmTdVjh/";

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
     for (let index = 1; index <= 18; index++) { 
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
         for (let index = 1; index <= 18; index++) {
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

   return (
    <div className="card-container-custom" style={{ backgroundColor: 'black', minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        {tokenIDs.length > 0 ? (
            <>
                {tokenIDs.map(id => {
                    const fileExtension = id === 18 ? 'jpeg' : 'png'; 
                    return (
                        <div key={id} className="card-custom" onClick={() => setSelectedImage(`${baseURL}${id}.${fileExtension}`)}>
                            <img className="card-image-custom2" src={`${baseURL}${id}.${fileExtension}`} alt={`Achievement ${id}`} />
                            <div className="card-content-custom">
                            </div>
                        </div>
                    );
                })}
                {selectedImage && (
                    <div 
                        style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', backgroundColor: 'rgba(0,0,0,0.9)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}
                        onClick={() => setSelectedImage(null)}
                    >
                        <img src={selectedImage} alt="Selected Achievement" style={{ maxHeight: '80vh', maxWidth: '80vw' }} />
                    </div>
                )}
            </>
        ) : (
            <h1 style={{ color: 'white', fontSize: '3rem' }}>There Are No Achievements</h1>
        )}
    </div>
   );
};

export default Achievements;
