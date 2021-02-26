// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <=0.8.1;
pragma experimental ABIEncoderV2;

contract CfxTransferStation {
    event CfxTransfered(address from, address to, uint256 value);

    struct TransferJob {
        address payable to;
        uint256 value;
    }

    function transfer(address payable to) public payable {
        require(msg.value > 0, "msg.value should greater than 0");
        to.transfer(msg.value);
        emit CfxTransfered(msg.sender, to, msg.value);
    }

    // batch transfer
    function batchTransfer(TransferJob[] memory jobs) public payable {
        require(jobs.length > 0, "jobs length should greater than 0");

        uint256 total = 0;
        for (uint8 i = 0; i < jobs.length; i++) {
            total += jobs[i].value;
        }
        require(msg.value >= total, "msg.value should greater than total");

        uint256 sent = 0;
        for (uint16 i = 0; i < jobs.length; i++) {
            TransferJob memory job = jobs[i];
            job.to.transfer(job.value);
            emit CfxTransfered(msg.sender, job.to, job.value);
            sent += job.value;
        }

        // send remains back
        if (msg.value > sent) {
            address payable back;
            back.transfer(msg.value - sent);
        }
    }
}
