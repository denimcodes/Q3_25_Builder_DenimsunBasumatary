
import { Connection, Keypair, LAMPORTS_PER_SOL } from "@solana/web3.js"
import wallet from "./dev-wallet.json"

const keypair = Keypair.fromSecretKey(new Uint8Array(wallet));
const connection = new Connection("https://devnet.helius-rpc.com/?api-key=df4ddede-7336-4cd7-84be-e2fc00e9ddae");

(async () => {
  try {
    const txHash = await connection.requestAirdrop(keypair.publicKey, 2 * LAMPORTS_PER_SOL);
    console.log(`Success! Check out your TX here: https://explorer.solana.com/tx/${txHash}?cluster=devnet`)
  } catch (e) {
    console.error(`Oops, something went wrong: ${e}`)
  }
})();