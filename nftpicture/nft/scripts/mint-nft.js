require('dotenv').config();
const API_URL = process.env.API_URL;
const PUBLIC_KEY = process.env.PUBLIC_KEY;
const PRIVATE_KEY = process.env.PRIVATE_KEY;

const { createAlchemyWeb3 } = require("@alch/alchemy-web3");
const web3 = createAlchemyWeb3(API_URL);

const contract = require("../artifacts/contracts/MyNFT.sol/MyNFT.json");
const contractAddress = "0x3f6ee644788aec101084e1bc6406aa8d0df63461";
const nftContract = new web3.eth.Contract(contract.abi, contractAddress);

//step 3: Define the minting function
async function mintNFT(tokenURI) {
    const nonce = await web3.eth.getTransactionCount(PUBLIC_KEY, 'latest'); //get latest nonce
  
    //the transaction
    const tx = {
      'from': PUBLIC_KEY,
      'to': contractAddress,
      'nonce': nonce,
      'gas': 500000,
      'maxPriorityFeePerGas': 1999999987,
      'data': nftContract.methods.mintNFT(PUBLIC_KEY, tokenURI).encodeABI()
    };
//step 4: Sign the transaction
const signedTx = await web3.eth.accounts.signTransaction(tx, PRIVATE_KEY);
const transactionReceipt = await web3.eth.sendSignedTransaction(signedTx.rawTransaction);

console.log(`Transaction receipt: ${JSON.stringify(transactionReceipt)}`);
}

// const metadatalinks = ["https://gateway.pinata.cloud/ipfs/Qmeou5f7ttU98n96mYWfYzKHV7pfRe5rcZBhYznHZCUV7M" , "https://gateway.pinata.cloud/ipfs/QmaUK792RLARk4y3yZww1tnvu5GGAXdVqKYVr76dwrHVfp/1.json"]
// for (const s of metadatalinks) {
//   mintNFT(s)
// };


async function loop() {
    for(let i = 8; i < 10; i++){
        await mintNFT(`https://gateway.pinata.cloud/ipfs/Qmeou5f7ttU98n96mYWfYzKHV7pfRe5rcZBhYznHZCUV7M/${i}.png`);
    }
}

loop();

// mintNFT("https://gateway.pinata.cloud/ipfs/Qmeou5f7ttU98n96mYWfYzKHV7pfRe5rcZBhYznHZCUV7M/8.png");

// mintNFT("https://gateway.pinata.cloud/ipfs/Qmeou5f7ttU98n96mYWfYzKHV7pfRe5rcZBhYznHZCUV7M/7.png");