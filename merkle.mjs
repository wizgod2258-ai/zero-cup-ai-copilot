import { ZgFile } from "@0gfoundation/0g-storage-ts-sdk";

const file = await ZgFile.fromFilePath("./note.txt");

const [tree, err] = await file.merkleTree();

if (err) {
    console.error(err);
    process.exit(1);
}

console.log("Root Hash:", tree.rootHash());

await file.close();
