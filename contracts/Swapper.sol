//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@uniswap/v2-periphery/contracts/interfaces/IUniswapV2Router02.sol";

contract Swapper {
    IUniswapV2Router02 uniswapRouter =
        IUniswapV2Router02(0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D);
    IERC20 public fromToken;
    IERC20 public toToken;

    constructor(IERC20 _fromToken, IERC20 _toToken) {
        fromToken = _fromToken;
        toToken = _toToken;
    }

    struct Swap {
        address userAddress;
        uint256 swapAmount;
    }

    mapping(address => uint256) userSwapAmount;

    function provide(uint256 _amount) public {
        fromToken.transferFrom(msg.sender, address(this), _amount);
    }

    function swap() public {
        uint256 contractBalance = fromToken.balanceOf(address(this));
        userSwapAmount[msg.sender] = contractBalance;
    }

    function getPathForETHToToken(address crypto)
        private
        view
        returns (address[] memory)
    {
        address[] memory path = new address[](2);
        path[0] = uniswapRouter.WETH();
        path[1] = crypto;

        return path;
    }

    function swapDai(uint256 _amount) public payable returns (uint256) {
        address multiDaiKovan = 0x4F96Fe3b7A6Cf9725f59d353F723c1bDb64CA6Aa;
        uint256 deadline = block.timestamp + 15;
        uniswapRouter.swapETHForExactTokens{value: msg.value}(
            _amount,
            getPathForETHToToken(multiDaiKovan),
            address(this),
            deadline
        );

        // refund leftover ETH
        (bool success, ) = msg.sender.call{value: address(this).balance}("");
        require(success, "refund failed");
    }

    function getAccountSwapBalance() public view returns (uint256) {
        return userSwapAmount[msg.sender];
    }

    function withdraw() public {
        uint256 contractBalance = fromToken.balanceOf(address(this));
        toToken.transfer(msg.sender, contractBalance);
    }

    receive() external payable {}
}
