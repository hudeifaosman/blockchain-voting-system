// scripts/deploy.js
const hre = require("hardhat");
const fs  = require("fs");
const path = require("path");

async function main() {
  await hre.run("compile");

  const rawNames = [
    "Joshua Lukak",
    "Hudeifa Osman",
    "Abenezer",
    "Precious Nwoke"
  ];
  const candidateNames = rawNames.map(name =>
    hre.ethers.utils.formatBytes32String(name)
  );

  const Voting = await hre.ethers.getContractFactory("Voting");
  const voting = await Voting.deploy(candidateNames, { gasLimit: 3e6 });
  await voting.deployed();

  console.log("Voting deployed to:", voting.address);

  const artifact = require("../artifacts/contracts/Voting.sol/Voting.json");
  const out = {
    contractAddress: voting.address,
    abi: artifact.abi
  };
  fs.writeFileSync(
    path.resolve(__dirname, "../ui/blockchain.json"),
    JSON.stringify(out, null, 2)
  );
  console.log("Wrote ui/blockchain.json");
}

main()
  .then(() => process.exit(0))
  .catch(err => {
    console.error(err);
    process.exit(1);
  });
