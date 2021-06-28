const { expect } = require("chai");

describe("Swapper", () => {
  it("Should deploy Swapper, CoinOne, CoinTwo and provide CoinOne to it", async () => {
    const [deployer, address1, address2] = await hre.ethers.getSigners();

    const CoinOne = await hre.ethers.getContractFactory("CoinOne");
    const coinOne = await CoinOne.connect(address1).deploy();

    await coinOne.deployed();

    const CoinTwo = await hre.ethers.getContractFactory("CoinTwo");
    const coinTwo = await CoinTwo.deploy();

    await coinTwo.deployed();

    const Swapper = await hre.ethers.getContractFactory("Swapper");
    const swapper = await Swapper.deploy(
      (await coinOne.signer.getAddress()).toString(),
      (await coinTwo.signer.getAddress()).toString()
    );

    await swapper.deployed();

    // let coinOneAddress = coinOne.address;
    // let coinTwoAddress = coinTwo.address;

    const address1Balance = await coinOne.balanceOf(address1.address);
    expect(parseFloat(await address1Balance)).to.equal(100000000000000000000);

    await swapper.connect(address1).provide(20000000000000000000n);
  });
});
