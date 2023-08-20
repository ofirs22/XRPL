# XRPL LEARNING LAB - An Educational Game for Solidity Enthusiasts

## Project Description
Welcome to **XRPL LEARNING LAB**, an educational game developed by **tocon.io** for the XRPL summer hackathon. Our mission is to provide new developers with a fun and actionable environment to learn and practice the intricacies of Solidity. Dive into the world of smart contracts in the most engaging and cost-effective manner - by doing!

## Table of Contents
- [Getting Started](#getting-started)
- [How to Play](#how-to-play)
- [Features](#features)
- [Vision](#vision)
- [Team](#team)
- [Contact](#contact)
  [Solutions](#solutions)
---

## Getting Started

### Running the Game Locally
To run the game on localhost, execute the following commands:
```

cd .\client\
npm i
npm start
```
## Technical Details for Deployment

### Setting Up
If you want to deploy the contract using hardhat, enter values for the following parameters in the `.env` file:
```
PRI_KEY = <your-private-key>
```

### Deploying Contracts
- in the root folder execute command npm i.

- Deploy the `gameFactory` contract with the command:
```
npx hardhat run --network xrpl .\scripts\deploy_factory.js
```
- Deploy the `NFTbadge` contract using the command:
```
npx hardhat run --network xrpl .\scripts\deploy_nft.js
```

- **Connect Your Wallet**: Before diving into the game, ensure you've connected your wallet. If the XRPL EVM Sidechain (1440002) is not configured in your MetaMask wallet, follow the steps below to set it up:

  ### Configuring the XRPL EVM Sidechain in MetaMask:
  1. Open the MetaMask extension.
  2. Use the drop-down menu to choose **Add Network**.
  3. Enter the XRP Ledger Devnet endpoint information:
     - **Network Name**: XRPL EVM Sidechain
     - **New RPC URL**: https://rpc-evm-sidechain.xrpl.org
     - **Chain ID**: 1440002
     - **Currency Symbol**: XRP
     - **Block Explorer**: https://evm-sidechain.xrpl.org

- **About the Game**: Familiarize yourself with the game's objectives and mechanics.
- **Preparation**: Make sure you're connected to the testnet and have received the necessary tokens from the faucet.

---

## How to Play
- **Mini Games / Challenges**: Each mini-game represents a unique challenge where you'll deploy a smart contract reflecting one or more fundamental concepts of Solidity.
- **Solve the Challenges**: Call functions correctly and provide the right parameters to solve the mini-games.
- **Earn Certificates**: After conquering a mini-game, you'll receive an ERC 1155 non-transferable certificate, a testament to your victory and acquired knowledge.
- **The Final Challenge**: Upon completing all mini-games, you have the opportunity to mint the final ERC 1155 certificate, signifying your mastery over all challenges.

---

## Features
- **Interactive Learning**: Engage in hands-on learning by deploying and interacting with smart contracts.
- **Certification**: Earn ERC 1155 non-transferable certificates as you progress, showcasing your achievements.
- **Comprehensive Challenges**: Each mini-game is designed to test and enhance your understanding of specific Solidity concepts.

---

## Vision
The potential of **XRPL LEARNING LAB** extends beyond just a game. We envision this system being utilized for:
- **Educational Purposes**: A revolutionary tool for institutions aiming to teach Solidity and blockchain concepts.
- **Hiring Mechanisms**: A unique filter to assess the practical skills of potential hires in the blockchain domain.

---

## Team
**tocon.io**: https://www.tocon.io/about.

---

## Contact
For any queries, suggestions, or feedback, feel free to reach out to us at matan.cohen@tocon.io.

---

## Solutions:

### Byte2 Learning Lab:
- Any number between `0x0000` and `0xFFFF` can be entered in the `_biggerNum` input box. 
- Press the `increaseNum` button and confirm the transaction.

---

### Fallback Learning Lab:
Follow these steps:
- Copy the smart contract code and paste it into a new file in the Remix IDE.
- In Remix IDE, click the `Deploy & RUN TRANSACTIONS` tab, then click the select box under the `ENVIRONMENT` heading and select the `Injected Provider: MetaMask` option. (Make sure the digital wallet is set to chain 1440002).
- Copy the smart contract address, which is under the heading `Your Test Address`, navigate to Remix IDE, and paste the contract address in the `At Address` input box. Next, click the `At Address` button to enable access to the deployed smart contract's user interface.
- Now click on the newly created tab under the heading `Deployed Contracts`, then click on the `Transact` button, which is under the heading `CALLDATA` and confirm the transaction. (To verify that the transaction was successfully completed, click the `FixMe` button in Remix IDE or on the game website and check that the value has changed to true.)
- Navigate to the game site and click the `Submit` button.

---

### Balance Learning Lab:
- Enter the wallet address `0x781bb0b55489fd296E977CfE67f212b6E7A67A77` in the `_account` input box.
- Enter the number 0 in the `_amount` input box.
- Press the `checkBalance` button and confirm the transaction.

---

### Wei Learning Lab:
Follow these steps:
- Copy the smart contract code and paste it into a new file in the Remix IDE.
- In Remix IDE, click the `DEPLOY & RUN TRANSACTIONS` tab, then click the select box under the `ENVIRONMENT` heading and select the `Injected Provider: MetaMask` option. (Make sure the digital wallet is set to chain 1440002).
- Copy the smart contract address, which is under the heading `Your Test Address`, navigate to Remix IDE, and paste the contract address in the `At Address` input box. Next, click the `At Address` button to enable access to the deployed smart contract's user interface.
- Enter the number 1 in the input box under the heading `VALUE`, ensuring that the ETHEREUM UNIT is set to Wei.
- Now click on the newly created tab under the heading `Deployed Contracts`, then click on the `Transact` button under the heading `CALDATA` and confirm the transaction. (To verify that the transaction was successfully completed, note that the amount of ETH sent to the contract is equal to Balance: 0.000000000000000001 ETH.)
- Navigate to the game site and click the `Submit` button.

---

### Timestamp Learning Lab:
- Click the hint button and copy the hash that represents the newly deployed contract, and paste it into the search box on the website `https://evm-sidechain.xrpl.org/`.
- Copy the block number.
- Open the code editor you use and create an index.js file with the following code:
```javascript
const Web3 = require('web3');
const https = 'https://rpc-evm-sidechain.xrpl.org';
const web3 = new Web3(https);
web3.eth.getBlock("<Block-Number>",console.log)
currentBlocks()
```
- Replace `<Block-Number>` with the block number you copied.
- Run the script and copy the timestamp from the received output.
- Navigate to the game site, enter the timestamp you copied into the `_Timestamp` input box, and press the `timeReset` button, then confirm the transaction.

---

### Gas Learning Lab:
- Enter the number 20 in the `iterations` input box.
- Click the `complexOperation` button and confirm the transaction.

---

### Password Learning Lab:
- Enter the hexadecimal number `0x000000000000446f6e277420466f72676574205468652050617373776f726421` in the input box `_password`.
- Enter the number 1 in the `newPassword` input box.
- Click the `changePassword` button and confirm the transaction.

---

### Overflow Learning Lab:
- Enter the number 7 in the `value` input box.
- Click the `add` button and confirm the transaction.

---

### BlockHash Learning Lab:
- Click the hint button, copy the hash that represents the newly deployed contract, and paste it into the search box on the website `https://evm-sidechain.xrpl.org/`.
- Click on the block number.
- Copy the block number.
- Navigate to the game site, enter the block number you copied into the `blockNumber` input box.
- Copy the hash that represents the block.
- Navigate to the game site, enter the hash you copied into the `blockHash` input box.
- Click the `blockHashCheck` button and confirm the transaction.

---

### Signature Learning Lab:
- Enter `0x794bc9a0` in the `ID` input box.
- Press the `CalcMe` button and confirm the transaction.

---

### Encode Data Learning Lab:
- Enter `0x00000000000000000000000000000000000000000000000000000000000040000000000000000000000000000000000000000000000 0000000000003000000000000000000000000000000000000000000000000000000000000000357454200000000000000000000000000000000000 00000000000000000` in the `encodedData` input box.
- Click the `encode` button and confirm the transaction.

---

### Hash Learning Lab:
- Enter `0x2bb80d537b1da3e38bd30361aa855686bde0eacd7162fef6a25fe97bf527a25b` in the `guess` input box.
- Click the `findCollision` button and confirm the transaction.

---

### Decode Data Learning Lab:
- Enter `I Am Number` in the `_str` input box.
- Enter the number 1 in the `_num` input box.
- Press the `decode` button and confirm the transaction.

---

### Contract Learning Lab:
Follow these steps:
- Copy the smart contract address, which is under the heading `Your Test Address` and paste it in the input box `_addr`.
- Enter the number 1 in the `_sal` input box.
- Press the `bytecode` button and copy the bytecode that appears on the screen.
- Paste the bytecode in the `_bytecode` input box.
- Click the `checkAddress` button and copy the smart contract address that appears on the screen.
- Paste the smart contract address in the `_add` input box.
- Click the `deploy` button and confirm the transaction.

---

### Interface Learning Lab:
- Enter `0x4199e8e3` in the `ID` input box.
- Click the `calculateXOR` button and confirm the transaction.

---

### Ticket Learning Lab:
Follow these steps:
- Copy the smart contract address, which is under the heading `LimitedTickets Address` and paste it in the input box `_target`.
- Copy your digital wallet address (which appears in the navbar) and paste it into the `attacker` input box.
- Enter the number 3 in the `ticketAmount` input box.
- Press the `attack` button and confirm the transaction (do it twice).
- Click the `Submit` button and confirm the transaction.

---

### Random Number Learning Lab:
Follow these steps:
- Copy the smart contract address, which is under the heading `EducatedGuess Address`, and paste it in the `_target` input box.
- Copy the smart contract address, which is under the heading `HackEducatedGuess Address` and paste it into the `attackerContract` input box.
- Enter the number 1000 in the `num` input box.
- Click the `attack` button and confirm the transaction.
- Click the `Submit` button and confirm the transaction.

---

