import { Connection, Keypair, PublicKey, SystemProgram } from "@solana/web3.js";
import { Program, Wallet, AnchorProvider } from "@coral-xyz/anchor";
import { IDL, Turbin3Prereq } from "./programs/Turbin3_prereq";
import wallet from "./Turbin3-wallet.json";
const MPL_CORE_PROGRAM_ID = new PublicKey(
  "CoREENxT6tW1HoK8ypY1SxRMZTcVPm7R94rH4PZNhX7d",
);
const mintCollection = new PublicKey(
  "5ebsp5RChCGK7ssRZMVMufgVZhd2kFbNaotcZ5UvytN2",
);
const mint = Keypair.generate();

const turbin3Wallet = Keypair.fromSecretKey(new Uint8Array(wallet));
const connection = new Connection(
  "https://devnet.helius-rpc.com/?api-key=df4ddede-7336-4cd7-84be-e2fc00e9ddae",
);

const provider = new AnchorProvider(connection, new Wallet(turbin3Wallet), {
  commitment: "confirmed",
});
const program: Program<Turbin3Prereq> = new Program(IDL, provider);
const account_seeds = [
  Buffer.from("prereqs"),
  turbin3Wallet.publicKey.toBuffer(),
];
const [account_key] = PublicKey.findProgramAddressSync(
  account_seeds,
  program.programId,
);

const authority_seeds = [
  Buffer.from([99, 111, 108, 108, 101, 99, 116, 105, 111, 110]),
  mintCollection.toBuffer(),
];
const [authority_key] = PublicKey.findProgramAddressSync(
  authority_seeds,
  program.programId,
);

(async () => {
  try {
    const txhash = await program.methods
      .initialize("denimcodes")
      .accountsPartial({
        user: turbin3Wallet.publicKey,
        account: account_key,
        system_program: SystemProgram.programId,
      })
      .signers([turbin3Wallet])
      .rpc();

    console.log(
      `Success! Check out your TX here: https://explorer.solana.com/tx/${txhash}?cluster=devnet`,
    );
  } catch (e) {
    console.error(`Oops, something went wrong: ${e}`);
  }
})();

(async () => {
  try {
    const txhash = await program.methods
      .submitTs()
      .accountsPartial({
        user: turbin3Wallet.publicKey,
        account: account_key,
        mint: mint.publicKey,
        collection: mintCollection,
        authority: authority_key,
        mpl_core_program: MPL_CORE_PROGRAM_ID,
        system_program: SystemProgram.programId,
      })
      .signers([turbin3Wallet, mint])
      .rpc();
    console.log(
      `Success! Check out your TX here: https://explorer.solana.com/tx/${txhash}?cluster=devnet`,
    );
  } catch (e) {
    console.error(`Oops, something went wrong: ${e}`);
  }
})();
