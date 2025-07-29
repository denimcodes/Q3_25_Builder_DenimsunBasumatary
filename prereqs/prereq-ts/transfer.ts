import * as web3 from "@solana/web3.js";
import wallet from "./dev-wallet.json";

// Import our dev wallet keypair from the wallet file
const from = web3.Keypair.fromSecretKey(new Uint8Array(wallet));
// Define our Turbin3 public key
const to = new web3.PublicKey("C8MxGwhe53cdKJuTvQ9rHz5swH4vdWULZtyc1Hqnkbgn");
const connection = new web3.Connection(
  "https://devnet.helius-rpc.com/?api-key=df4ddede-7336-4cd7-84be-e2fc00e9ddae",
);

(async () => {
  try {
    const balance = await connection.getBalance(from.publicKey);
    const transaction = new web3.Transaction().add(
      web3.SystemProgram.transfer({
        fromPubkey: from.publicKey,
        toPubkey: to,
        lamports: balance,
      }),
    );

    transaction.recentBlockhash = (
      await connection.getLatestBlockhash("confirmed")
    ).blockhash;
    transaction.feePayer = from.publicKey;

    const fee =
      (
        await connection.getFeeForMessage(
          transaction.compileMessage(),
          "confirmed",
        )
      ).value || 0;

    transaction.instructions.pop();

    transaction.add(
      web3.SystemProgram.transfer({
        fromPubkey: from.publicKey,
        toPubkey: to,
        lamports: balance - fee,
      }),
    );
    const signature = await web3.sendAndConfirmTransaction(
      connection,
      transaction,
      [from],
    );
    console.log(
      `Success! Check out your TX here: https://explorer.solana.com/tx/${signature}?cluster=devnet`,
    );
  } catch (error) {
    console.error(`Oops, something went wrong ${error}`);
  }
})();
