require('dotenv').config();
const { Conflux, Drip, format } = require('js-conflux-sdk');
const fs = require('fs');
let abi = JSON.parse(fs.readFileSync('./contract/CfxTransferStation.abi', 'utf-8'));
let bytecode = '0x' + fs.readFileSync('./contract/CfxTransferStation.bin', 'utf-8');
const cfx = new Conflux({
    url: process.env.MAIN_NET,
    logger: console,
});
// const hexAddress = '0x1386B4185A223EF49592233b69291bbe5a80C527';
let sender;
const MAIN_NET_CONTRACT = 'CFX:TYPE.CONTRACT:ACEHC96BH52YXGU8DUSPUKEJS6ZEDP427YFUT5M81J';
const TEST_NET_CONTRACT = 'CFXTEST:TYPE.CONTRACT:ACH758TZ0PM7M2HH3725F2Z2P9M7X929SUTTZW4AY6';

async function main() {
    await cfx.updateNetworkId();
    const account = cfx.wallet.addPrivateKey(process.env.PRIVATE_KEY);
    sender = account.address;
    const balance = await cfx.getBalance(sender);
    console.log(`Sender ${sender}, balance ${new Drip(balance).toCFX()} CFX`);
    
    // await setSponsor(deployedContract);

    let info = await getSponsorInfo(MAIN_NET_CONTRACT);
    console.log("sponsor info: ", info);

    // let receipt = await transfer(MAIN_NET_CONTRACT, '0x13d2bA4eD43542e7c54fbB6c5fCCb9f269C1f94C', balance);
    // console.log("Transfer status: ", receipt.outcomeStatus);
}

main().catch(console.log);

async function deploy () {
    let receipt = await cfx.sendTransaction({
        from: sender,
        data: bytecode,
    }).executed();
    return receipt;
}

async function transfer(address, to, amount) {
    let contract = cfx.Contract({abi, address});
    let receipt = await contract.transfer(to).sendTransaction({
        from: sender,
        // gasPrice: 2,
        value: amount,
    }).executed();
    return receipt;
}

async function setSponsor(address) {
    const gasFeeUpperBound = 100000;
    const zeroAddress = '0x0000000000000000000000000000000000000000';
    let sponsor = cfx.InternalContract('SponsorWhitelistControl');
    let receipt = await sponsor.setSponsorForGas(address, gasFeeUpperBound).sendTransaction({
        from: sender,
        value: Drip.fromCFX(10)
    }).executed();
    console.log("Set sponsor status: ", receipt.outcomeStatus);
    let addReceipt = await sponsor.addPrivilegeByAdmin(address, [zeroAddress]).sendTransaction({
        from: sender
    }).executed();
    console.log("Set whitelist status: ", addReceipt.outcomeStatus);
}

async function getSponsorInfo(address) {
    let sponsor = cfx.InternalContract('SponsorWhitelistControl');
    let sponsorForGas = await sponsor.getSponsorForGas(address);
    let upperBound = await sponsor.getSponsoredGasFeeUpperBound(address);
    let sponsorBalance = await sponsor.getSponsoredBalanceForGas(address);
    let isAll = await sponsor.isAllWhitelisted(address);
    let info = {
        sponsorForGas,
        upperBound,
        sponsorBalance,
        isAll
    };
    return info;
}