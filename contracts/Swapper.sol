//SPDX-License-Identifier: Unlicense
pragma solidity >0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract Swapper {
    address public fromAddress;
    IERC20 public fromToken;
    IERC20 public toToken;
    uint256 public amount;

    constructor(IERC20 _fromToken, IERC20 _toToken) {
        fromToken = _fromToken;
        toToken = _toToken;
    }

    function swap() public {
        toToken.transfer(msg.sender, amount);
    }

    function provide(uint256 _amount) public {
        amount = _amount;
        fromToken.transferFrom(msg.sender, address(this), _amount);
    }

    function withdraw() public {
        toToken.transfer(msg.sender, 20000000000000000000);
        amount = 0;
    }
}
