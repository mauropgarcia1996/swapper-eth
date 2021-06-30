const { expect } = require("chai");

describe("Swapper", () => {
  describe("Swapper Contract", () => {
    let CoinOne;
    let coinOne;
    let CoinTwo;
    let coinTwo;
    let Swapper;
    let swapper;
    let address1;
    let address2;
    let address3;
    let mintedAmount = "100000000000000000000"
    let amount = "20000000000000000000"; // As a string.

    beforeEach(async () => {
      [address1, address2, address3] = await ethers.getSigners();

      CoinOne = await ethers.getContractFactory("CoinOne");
      coinOne = await CoinOne.connect(address1).deploy();
      await coinOne.deployed();

      CoinTwo = await ethers.getContractFactory("CoinTwo");
      coinTwo = await CoinTwo.connect(address2).deploy();
      await coinTwo.deployed();

      Swapper = await ethers.getContractFactory("Swapper");
      swapper = await Swapper.connect(address2).deploy(coinOne.address, coinTwo.address);
      await swapper.deployed();

      const cointTwoToContract = await coinTwo.connect(address2).transfer(swapper.address, ethers.BigNumber.from(amount));
      await cointTwoToContract.wait();
    });

    // it("Should return DAI amount from ETH", async() => {
    //   const daiAmount = await swapper.connect(address1).swapDai(1);
    //   await daiAmount.wait();
    //   console.log(daiAmount);
    // })

    it("Should provide CoinOne to Swapper", async () => {
      const approval = await coinOne.approve(swapper.address, ethers.BigNumber.from(amount));
      await approval.wait();
      const provided = await swapper.connect(address1).provide(ethers.BigNumber.from(amount));
      await provided.wait()
      expect((await coinOne.balanceOf(address1.address)).toString()).to.equal((ethers.BigNumber.from(mintedAmount) - ethers.BigNumber.from(amount)).toString());
      expect((await coinOne.balanceOf(swapper.address)).toString()).to.equal(amount);
    });

    it("Should allow user to withdraw CoinTwo", async () => {
      const approval = await coinOne.approve(swapper.address, ethers.BigNumber.from(amount));
      await approval.wait();
      const provided = await swapper.connect(address1).provide(ethers.BigNumber.from(amount));
      await provided.wait()
      const withdrawed = await swapper.connect(address1).withdraw();
      await withdrawed.wait();
      expect((await coinTwo.balanceOf(address1.address)).toString()).to.equal(amount);
    });

    it("Should swap CoinOne to CoinTwo", async () => {
      const approval = await coinOne.approve(swapper.address, ethers.BigNumber.from(amount));
      await approval.wait();
      const provided = await swapper.connect(address1).provide(ethers.BigNumber.from(amount));
      await provided.wait()

      const swapped = await swapper.connect(address1).swap();
      swapped.wait();

      const withdrawed = await swapper.connect(address1).withdraw();
      await withdrawed.wait();

      expect((await coinTwo.balanceOf(address1.address)).toString()).to.equal(amount);
      expect((await coinTwo.balanceOf(address1.address)).toString()).to.equal(amount);
      expect((await coinTwo.balanceOf(swapper.address)).toString()).to.equal('0')
    });
  });
});
