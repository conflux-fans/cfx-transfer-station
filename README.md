# cfx-transfer-station
CFX transfer station is a `contract` with a payable method `transfer`.
The `transfer` method will transfer CFX you send to it, to another address specified by parameter, and emit a `CfxTransfered` event.

```js
event CfxTransfered(address from, address to, uint256 value);

function transfer(address payable to) public payable {
    require(msg.value > 0, "msg.value should greater than 0");
    to.transfer(msg.value);
    emit CfxTransfered(msg.sender, to, msg.value);
}
```

You can used it for:

1. Send CFX and no need pay gas fee.
2. Send `all` CFX of one address to another one easily (if send CFX directly, you need minus gas fee from balance manully).


### Deployed contract
This contract is already deployed on both mainnet and testnet, also sponsor is setted, the `gas_fee_upper_bound` is `100000`

* mainnet: `CFX:TYPE.CONTRACT:ACEHC96BH52YXGU8DUSPUKEJS6ZEDP427YFUT5M81J`
* testnet: `CFXTEST:TYPE.CONTRACT:ACH758TZ0PM7M2HH3725F2Z2P9M7X929SUTTZW4AY6`


### How to transfer
You can find contract's ABI in `contract` folder.

```js
let abi = JSON.parse(fs.readFileSync('./contract/CfxTransferStation.abi', 'utf-8'));
let address = 'CFX:TYPE.CONTRACT:ACEHC96BH52YXGU8DUSPUKEJS6ZEDP427YFUT5M81J';
let contract = cfx.Contract({abi, address});
let hash = await contract.transfer('target-address').sendTransaction({
    from: 'from-address',
    value: 1000  // the cfx amount in Drip
});
```