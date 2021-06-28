//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract CoinOne is ERC20 {
    // address constant public myAddress = 0x70997970C51812dc3A010C7d01b50e0d17dc79C8;
    constructor() ERC20("CoinOne", "CON") {
        _mint(msg.sender, 100 * (10**uint256(decimals())));
    }
}
