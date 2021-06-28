// We require the Hardhat Runtime Environment explicitly here. This is optional 
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
const hre = require("hardhat");

async function main() {

  const [deployer, address1, address2] = await hre.ethers.getSigners();

  const CoinOne = await hre.ethers.getContractFactory("CoinOne");
  const coinOne = await CoinOne.deploy([]);

  await coinOne.deployed();

  console.log("CoinOne deployed to:", coinOne.address);
  console.log("CoinTwo address to:", (await coinOne.signer.getAddress()).toString());

  const CoinTwo = await hre.ethers.getContractFactory("CoinTwo");
  const coinTwo = await CoinTwo.deploy([]);

  await coinTwo.deployed();

  console.log("CoinTwo deployed to:", coinTwo.address);
  console.log("CoinTwo address to:", (await coinTwo.signer.getAddress()).toString());

  const Swapper = await hre.ethers.getContractFactory("Swapper");
  const swapper = await Swapper.deploy((await coinOne.signer.getAddress()).toString(), (await coinTwo.signer.getAddress()).toString());

  await swapper.deployed();

  console.log("Swapper deployed to:", swapper.address);
  console.log("Swapper address to:", (await swapper.signer.getAddress()).toString());
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
