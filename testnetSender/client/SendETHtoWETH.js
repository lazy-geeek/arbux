const { ethers } = require("ethers");

require("dotenv").config();

// TESTNET PROVIDER
const providerTestnet = new ethers.providers.JsonRpcProvider(
    process.env.RPC_URL
);

// CREATE SIGNER
const myAddress = process.env.ETH_ADDRESS;
const privateKey = process.env.PRIVATE_KEY;
const walletSigner = new ethers.Wallet(privateKey, providerTestnet);

const exchangeETH = async () => {
    const sendValueHuman = "0.001";
    const gasPrice = await providerTestnet.getGasPrice();

    const nonce = await walletSigner.getTransactionCount();
    const txBuild = {
        from: myAddress, // from,
        to: "0xB4FBF271143F4FBf7B91A5ded31805e42b2208d6", // to (WETH on Goerli Test Network),
        value: ethers.utils.parseEther(sendValueHuman), // value,
        nonce: nonce, // nonce,
        gasLimit: 150000, // gas limit,
        gasPrice: gasPrice, // gas price
    };

    // SEND Transaction
    const txSend = await walletSigner.sendTransaction(txBuild);

    console.log("");
    console.log("TX SEND");
    console.log(txSend);
};

exchangeETH();
