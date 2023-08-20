// scripts/upgrade_box.js
const { ethers, upgrades } = require("hardhat");

const PROXY = "0x7516f8Ab047aBAeA4a59C87f2F5af3B89e790df7";
async function main() {
    const NFTbadgeV2 = await ethers.getContractFactory("NFTbadge");
    console.log("Upgrading Box...");
    await upgrades.upgradeProxy(PROXY, NFTbadgeV2);
    console.log("Box upgraded");
}

main();