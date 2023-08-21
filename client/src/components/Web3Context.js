import { createContext, useState, useEffect } from 'react';
import Web3 from "web3";
import gameABI from "../interfaces/GameFactory";
import nftABI from "../interfaces/NFTbadge";

export const Web3Context = createContext();

export const Web3Provider = ({ children }) => {
  const [walletAddress, setWalletAddress] = useState("");
  const [Chain, setChain] = useState("");
  const [factoryContract, setFactoryContract] = useState(null);
  const [nftContract, setNftContract] = useState(null);
  const web3 = new Web3(window.ethereum);

  const contractAddresses = {
    1440002: { // Xrp network
      gameAddress: "0xdaC40F1bC566a9FcA030fB1f146678E271cAB7c4",
      nftAddress: "0x7516f8Ab047aBAeA4a59C87f2F5af3B89e790df7"
    }
  };
  const switchToXRPLChain = async () => {
    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: '0x' + (1440002).toString(16) }], 
      });
    } catch (switchError) {
      if (switchError.code === 4902) {
        console.log('This chain does not exist on the user wallet. You might want to add it manually or provide a way to let the user add it.');
      } else {
        console.error(switchError);
      }
    }
  };
  
  useEffect(() => {
    const init = async () => {
      if (window.ethereum) {
        const accounts = await window.ethereum.request({
          method: "eth_accounts",
        });
        const chainId = parseInt(window.ethereum.chainId, 16);
        setChain(chainId);
        setWalletAddress(accounts[0] || "");
      }
    };
    init();
  }, []);

  useEffect(() => {
    if (Chain) {
      const addresses = contractAddresses[Chain];
      if (addresses) {
        const gameContract = new web3.eth.Contract(gameABI, addresses.gameAddress);
        const nftContractInstance = new web3.eth.Contract(nftABI, addresses.nftAddress);
        console.log('gameContract:', gameContract);
        console.log('nftContractInstance:', nftContractInstance);
        setFactoryContract(gameContract);
        setNftContract(nftContractInstance);
      } else {
        console.log(`No contract addresses available for chain ID: ${Chain}`);
      }
    }
  }, [Chain]);

  useEffect(() => {
    const init = async () => {
      if (window.ethereum) {
        const accounts = await window.ethereum.request({
          method: "eth_accounts",
        });
        const chainId = parseInt(window.ethereum.chainId, 16);
        setChain(chainId);
        setWalletAddress(accounts[0] || "");
      }
    };
    init();
  }, []);


  useEffect(() => {
    const handleAccountsChanged = async (accounts) => {
      console.log(accounts);
      console.log(accounts[0]);
      setWalletAddress(accounts[0]);
    };

    const handleChainChanged = (chainId) => {
      const decimalChainId = parseInt(chainId, 16);
      setChain(decimalChainId);
    };

    if (window.ethereum) {
      window.ethereum.on('accountsChanged', handleAccountsChanged);
      window.ethereum.on('chainChanged', handleChainChanged);
    }

    return () => {
      if (window.ethereum) {
        window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
        window.ethereum.removeListener('chainChanged', handleChainChanged);
      }
    }
  }, []);

  useEffect(() => {
    if (walletAddress) {
      localStorage.setItem('walletAddress', walletAddress);
    }
  }, [walletAddress]);

  const requestAccount = async () => {
    console.log('Requesting account...');
    if (window.ethereum) {
      const chainId = parseInt(window.ethereum.chainId, 16);
      setChain(chainId);
  
      if (chainId !== 1440002) {
        await switchToXRPLChain();
      }
  
      try {
        const accounts = await window.ethereum.request({
          method: "eth_requestAccounts",
        });
        setWalletAddress(accounts[0]);
      } catch (error) {
        console.log(error);
      }
    }else {
      // Check if the user is on a mobile device
      if (/Mobi|Android/i.test(navigator.userAgent)) {
        // Create a MetaMask deep link
        const metaMaskDeepLink = 'https://metamask.app.link/dapp/xrpl-tocon.xyz/';
  
        // Open the MetaMask app in a new tab
        window.open(metaMaskDeepLink, '_blank');
      } else {
        alert('MetaMask not detected');
      }
    }
  };
  

  return (
    <Web3Context.Provider value={{ Chain, walletAddress, factoryContract, nftContract, web3, requestAccount  }}>
      {children}
    </Web3Context.Provider>
  );
};
