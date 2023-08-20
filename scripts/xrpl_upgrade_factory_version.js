// scripts/upgrade_box.js
const { ethers, upgrades } = require("hardhat");

const PROXY = "0xdaC40F1bC566a9FcA030fB1f146678E271cAB7c4";
async function main() {
    const GameFactoryV2 = await ethers.getContractFactory("GameFactory");
    console.log("Upgrading Box...");
    await upgrades.upgradeProxy(PROXY, GameFactoryV2);
    console.log("Box upgraded");
}

main();