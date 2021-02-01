require('dotenv').config();
const { Conflux, Drip } = require('js-conflux-sdk');
const fs = require('fs');
let abi = JSON.parse(fs.readFileSync('./contract/CfxTransferStation.abi', 'utf-8'));
let bytecode = fs.readFileSync('./contract/CfxTransferStation.bin', 'utf-8');
const cfx = new Conflux({
    url: 'https://testnet-rpc.conflux-chain.org.cn/v2',
    networkId: 1,
    // logger: console,
});

const account = cfx.wallet.addPrivateKey(process.env.PRIVATE_KEY);
// console.log(account.address);

async function main() {
    await transfer();    
    await setSponsor();
}

main().catch(console.log);

async function deploy () {
    let receipt = await cfx.sendTransaction({
        from: account.address,
        data: '0x' + bytecode,
    }).executed();
    console.log(receipt);
}

async function transfer() {
    const address = 'CFXTEST:TYPE.CONTRACT:ACH758TZ0PM7M2HH3725F2Z2P9M7X929SUTTZW4AY6';
    let contract = cfx.Contract({abi, address});
    let receipt = await contract.transfer("0x1BE45681aC6C53D5A40475f7526baC1Fe7590fb8").sendTransaction({
        from: account,
        value: Drip.fromCFX(10)
    }).executed();
    console.log(receipt);
}

async function setSponsor() {
    const address = 'CFXTEST:TYPE.CONTRACT:ACH758TZ0PM7M2HH3725F2Z2P9M7X929SUTTZW4AY6';
    let sponsor = cfx.InternalContract('SponsorWhitelistControl');
    // let receipt = await sponsor.setSponsorForGas(address, 100000).sendTransaction({
    //     from: account.address,
    //     value: Drip.fromCFX(101)
    // }).executed();
    // console.log(receipt);
    // let receipt = await sponsor.addPrivilegeByAdmin(address, ['0x0000000000000000000000000000000000000000']).sendTransaction({
    //     from: account.address
    // }).executed();
    // console.log(receipt);
    let sponsorForGas = await sponsor.getSponsorForGas(address);
    console.log(sponsorForGas);
    let upperBound = await sponsor.getSponsoredGasFeeUpperBound(address);
    console.log(upperBound);
    let sponsorBalance = await sponsor.getSponsoredBalanceForGas(address);
    console.log(sponsorBalance);
    let isAll = await sponsor.isAllWhitelisted(address);
    console.log(isAll);
}