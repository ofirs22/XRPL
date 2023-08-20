
const { ethers, upgrades } = require("hardhat");

async function main() {
    const GameFactory = await ethers.getContractFactory("GameFactory");
    console.log("Deploying GameFactory...");
    const game = await upgrades.deployProxy(GameFactory);
    await game.deployed();
    console.log("game deployed to:", game.address);
}

main();