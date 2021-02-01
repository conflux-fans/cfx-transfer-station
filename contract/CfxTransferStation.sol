// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <=0.8.1;

contract CfxTransferStation {
    event CfxTransfered(address from, address to, uint256 value);

    function transfer(address payable to) public payable {
        require(msg.value > 0, "msg.value should greater than 0");
        to.transfer(msg.value);
        emit CfxTransfered(msg.sender, to, msg.value);
    }
}
