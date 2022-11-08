const { expect, assert } = require("chai");
const { ethers } = require("hardhat");

require("dotenv").config();

const {
    addressFactory,
    addressRouter,
    addressFrom,
    addressTo,
} = require("../utils/AddressList");

const { erc20ABI, factoryABI, routerABI } = require("../utils/AbiList");

const providerURL = process.env.RPC_URL;
const myAddress = process.env.ETH_ADDRESS;

describe("Read and Write to the Blockchain", () => {
    let provider,
        contractFactory,
        contractRouter,
        contractToken,
        decimals,
        amountIn;

    // connecting to provider
    provider = new ethers.providers.JsonRpcProvider(providerURL);

    // contract addresses
    contractFactory = new ethers.Contract(addressFactory, factoryABI, provider);
    contractRouter = new ethers.Contract(addressRouter, routerABI, provider);
    contractToken = new ethers.Contract(addressFrom, erc20ABI, provider);

    const amountInHuman = "1";
    amountIn = ethers.utils.parseUnits(amountInHuman, decimals).toString();

    // get price information
    const getAmountOut = async () => {
        decimals = await contractToken.decimals();

        const amountsOut = await contractRouter.getAmountsOut(amountIn, [
            addressFrom,
            addressTo,
        ]);

        return amountsOut[1].toString();
    };

    it("gets the price of amountsOut", async () => {
        const amount = await getAmountOut();
        assert(amount);
    });

    it("sends a transactions, i.e. swaps a token", async () => {
        const [ownerSigner] = await ethers.getSigners();

        const mainnetForkUniswapRouter = new ethers.Contract(
            addressRouter,
            routerABI,
            ownerSigner
        );

        const amountOut = await getAmountOut();

        const txSwap = await mainnetForkUniswapRouter.swapExactTokensForTokens(
            amountIn, // amount In,
            amountOut, // amount Out,
            [addressFrom, addressTo], // path,
            myAddress, // address to,
            Date.now() + 1000 * 60 * 5, // deadline,
            {
                gasLimit: 200000,
                gasPrice: ethers.utils.parseUnits("5.5", "gwei"),
            } // gas
        );

        assert(txSwap.hash);

        const mainnetForkProvider = ethers.provider;
        const txReceipt = await mainnetForkProvider.getTransactionReceipt(
            txSwap.hash
        );

        console.log("");
        console.log("SWAP TRANSACTION");
        console.log(txSwap);

        console.log("");
        console.log("TRANSACTION RECEIPT");
        console.log(txReceipt);
    });
});
