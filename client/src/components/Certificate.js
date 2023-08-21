import { useContext, useEffect, useState, useRef } from 'react';
import { Web3Context } from './Web3Context';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './../assets/css/game.css'

const Certificate = ({ scrollToRef }) => {
    const { walletAddress } = useContext(Web3Context);
    const { nftContract } = useContext(Web3Context);

    useEffect(() => {
        const fetchData = async () => {
          if (!walletAddress || !nftContract) {
            return;
          }
        };
        fetchData();
      }, [walletAddress, nftContract]);

    async function mint(){
        console.log("Mint function triggered");
        console.log(walletAddress);
        console.log(nftContract._address);
        
        try {
            await nftContract.methods.finalMint().send({
              from: walletAddress,
              gas: 700000,
            })
              .once("error", (err) => {
                console.log(err);
              })
              .once("receipt", async () => {
                const balance = await nftContract.methods.balanceOf(walletAddress, 18).call();
                console.log(balance);
                toast.success("Minting completed successfully!");
              });

          } catch (err) {
            console.error(err.message);
            toast.error("Minting failed.");
          }
    }

    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <button 
                className="btn btn-black button-custom button-position" 
                style={{  }} 
                onClick={mint}
            >
                Claim Your Certificate
            </button>
            <img src={process.env.PUBLIC_URL + "/finalErc.jpeg"}
                alt="certificate"
                style={{ width: "100%" }}
            />
            <ToastContainer position={toast.POSITION.BOTTOM_RIGHT} />

        </div>
    );
};

export default Certificate;
