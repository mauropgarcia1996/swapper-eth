//SPDX-License-Identifier: Unlicense
pragma solidity >0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@uniswap/v2-periphery/contracts/interfaces/IUniswapV2Router02.sol";
// import "http://github.com/Uniswap/uniswap-v2-periphery/blob/master/contracts/interfaces/IUniswapV2Router02.sol";

contract Swapper {
    IERC20 public fromToken;
    IERC20 public toToken;

    address internal constant UNISWAP_ROUTER_ADDRESS = 0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D ;
    address private personalDaiAddress = 0x4F96Fe3b7A6Cf9725f59d353F723c1bDb64CA6Aa;
    IUniswapV2Router02 public uniswapRouter;

    constructor(IERC20 _fromToken, IERC20 _toToken) {
        fromToken = _fromToken;
        toToken = _toToken;
        uniswapRouter = IUniswapV2Router02(UNISWAP_ROUTER_ADDRESS);
    }

    struct Swap {
        address userAddress;
        uint swapAmount;
    }

    mapping (address => uint) userSwapAmount;

    function provide(uint256 _amount) public {
        fromToken.transferFrom(msg.sender, address(this), _amount);
    }

    function swap() public {
        uint contractBalance = fromToken.balanceOf(address(this));
        userSwapAmount[msg.sender] = contractBalance;
    }

    function swapDai(uint _amount) public payable {
        address[] memory swapPath = new address[](2);
        swapPath[0] = uniswapRouter.WETH();
        swapPath[1] = personalDaiAddress;
        uniswapRouter.swapETHForExactTokens(_amount, swapPath, address(this), block.timestamp + 15);
        (bool success,) = msg.sender.call{ value: address(this).balance }("");
        require(success, "refund failed");
    }

    function getAccountSwapBalance() public view returns(uint) {
        return userSwapAmount[msg.sender];
    }

    function withdraw() public {
        uint contractBalance = fromToken.balanceOf(address(this));
        toToken.transfer(msg.sender, contractBalance);
    }
}
