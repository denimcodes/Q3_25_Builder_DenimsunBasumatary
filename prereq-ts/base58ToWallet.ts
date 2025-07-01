import { bs58 } from "@coral-xyz/anchor/dist/cjs/utils/bytes";
import promptSync from "prompt-sync";

const prompt = promptSync();

function bs58ToWallet(bs58Str: string): number[] {
  return bs58.decode(bs58Str).toJSON().data;
}

const input = prompt("Enter private key: ");
const wallet = bs58ToWallet(input);

console.log(wallet);
