import { Indexer, ZgFile } from "@0gfoundation/0g-storage-ts-sdk";
import { ethers } from "ethers";
import dotenv from "dotenv";

dotenv.config();

const evmRpc = "https://evmrpc-testnet.0g.ai";
const indRpc = "https://indexer-storage-testnet-turbo.0g.ai";

const provider = new ethers.JsonRpcProvider(evmRpc);
const signer = new ethers.Wallet(process.env.PRIVATE_KEY, provider);

const file = await ZgFile.fromFilePath("./note.txt");

console.log("Building Merkle tree...");

const [tree, treeErr] = await file.merkleTree();

if (treeErr) {
    console.error(treeErr);
    process.exit(1);
}

console.log("Root Hash:", tree.rootHash());

const indexer = new Indexer(indRpc);

console.log("Uploading...");

const [tx, uploadErr] = await indexer.upload(
    file,
    evmRpc,
    signer
);

if (uploadErr) {
    console.error("Upload failed:", uploadErr);
} else {
    console.log("Success!");
    console.log("TX:", tx);
}

await file.close();
