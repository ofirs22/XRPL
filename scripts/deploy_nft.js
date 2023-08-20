
const { ethers, upgrades } = require("hardhat");

async function main() {
    const NFTbadge = await ethers.getContractFactory("NFTbadge");
    console.log("Deploying NFTbadge...");
    const nft = await upgrades.deployProxy(NFTbadge);
    await nft.deployed();
    console.log("nft deployed to:", nft.address);
}

main();