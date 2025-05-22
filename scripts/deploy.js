// scripts/deploy.js
const hre = require("hardhat");

async function main() {
  await hre.run("compile");

  // Convert human strings to bytes32
  const rawNames = ["Alice", "Bob", "Carol"];
  const candidateNames = rawNames.map(name =>
    hre.ethers.utils.formatBytes32String(name)
  );

  const Voting = await hre.ethers.getContractFactory("Voting");
  const voting = await Voting.deploy(candidateNames, { gasLimit: 3e6 });
  await voting.deployed();

  console.log("Voting deployed to:", voting.address);
}

main()
  .then(() => process.exit(0))
  .catch(err => {
    console.error(err);
    process.exit(1);
  });