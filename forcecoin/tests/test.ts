import { Buffer } from 'node:buffer';
import { PROGRAM_ID as TOKEN_METADATA_PROGRAM_ID } from '@metaplex-foundation/mpl-token-metadata';
import { ASSOCIATED_TOKEN_PROGRAM_ID, TOKEN_PROGRAM_ID, getAssociatedTokenAddress } from '@solana/spl-token';
import {
  Connection,
  Keypair,
  PublicKey,
  SYSVAR_RENT_PUBKEY,
  SystemProgram,
  Transaction,
  TransactionInstruction,
  sendAndConfirmTransaction,
} from '@solana/web3.js';
import { BN } from 'bn.js';
import { CreateTokenArgs, MintNftArgs, MintSplArgs, MyInstruction, TransferTokensArgs } from './instructions';

function createKeypairFromFile(path: string): Keypair {
  return Keypair.fromSecretKey(Buffer.from(JSON.parse(require('node:fs').readFileSync(path, 'utf-8'))));
}

describe('Transferring Tokens', async () => {

  console.log('test start!');
  //const connection = new Connection(`http://localhost:8899`, 'confirmed');
  const connection = new Connection(`https://rpc.devnet.soo.network/rpc`, 'confirmed');
  console.log('connection!');
  //const connection = new Connection('https://api.devnet.solana.com/', 'confirmed');
  const payer = createKeypairFromFile(`${require('node:os').homedir()}/.config/solana/id1.json`);
  console.log(`payer public:${payer.publicKey} private:${payer.secretKey}`);

  const program = createKeypairFromFile('./program/target/so/transfer_tokens_program-keypair.json');
  console.log(`program public:${program.publicKey} private:${program.secretKey}`);

  const tokenMintKeypair: Keypair = createKeypairFromFile('./program/target/so/transfer_tokens_program-mintkeypair.json');
  console.log(`tokenMintKeypair public:${tokenMintKeypair.publicKey} private:${tokenMintKeypair.secretKey}`);

  const recipientWallet = createKeypairFromFile('./program/target/so/transfer_tokens_program-anotherkeypair.json');
  console.log(`recipientWallet public:${recipientWallet.publicKey} private:${recipientWallet.secretKey}`);

  console.log('generated!');

  console.log(`TOKEN_METADATA_PROGRAM_ID ${TOKEN_METADATA_PROGRAM_ID}`);


  // it('Create an theRA Token!', async () => {
  //   const metadataAddress = PublicKey.findProgramAddressSync(
  //     [Buffer.from('metadata'), TOKEN_METADATA_PROGRAM_ID.toBuffer(), tokenMintKeypair.publicKey.toBuffer()],
  //     TOKEN_METADATA_PROGRAM_ID,
  //   )[0];

  //   const instructionData = new CreateTokenArgs({
  //     instruction: MyInstruction.Create,
  //     token_title: 'Solana Gold',
  //     token_symbol: 'GOLDSOL',
  //     token_uri: 'https://raw.githubusercontent.com/solana-developers/program-examples/new-examples/tokens/tokens/.assets/spl-token.json',
  //     decimals: 9,
  //   });

  //   const ix = new TransactionInstruction({
  //     keys: [
  //       {
  //         pubkey: tokenMintKeypair.publicKey,
  //         isSigner: true,
  //         isWritable: true,
  //       }, // Mint account
  //       { pubkey: payer.publicKey, isSigner: false, isWritable: true }, // Mint authority account
  //       { pubkey: metadataAddress, isSigner: false, isWritable: true }, // Metadata account
  //       { pubkey: payer.publicKey, isSigner: true, isWritable: true }, // Payer
  //       { pubkey: SYSVAR_RENT_PUBKEY, isSigner: false, isWritable: false }, // Rent account
  //       { pubkey: SystemProgram.programId, isSigner: false, isWritable: false }, // System program
  //       { pubkey: TOKEN_PROGRAM_ID, isSigner: false, isWritable: false }, // Token program
  //       {
  //         pubkey: TOKEN_METADATA_PROGRAM_ID,
  //         isSigner: false,
  //         isWritable: false,
  //       }, // Token metadata program
  //     ],
  //     programId: program.publicKey,
  //     data: instructionData.toBuffer(),
  //   });

  //   const sx = await sendAndConfirmTransaction(connection, new Transaction().add(ix), [payer, tokenMintKeypair]);

  //   console.log('Success!');
  //   console.log(`   Mint Address: ${tokenMintKeypair.publicKey}`);
  //   console.log(`   Tx Signature: ${sx}`);
  // });
 
  it('Mint some tokens to your wallet!', async () => {
    const associatedTokenAccountAddress = await getAssociatedTokenAddress(tokenMintKeypair.publicKey, payer.publicKey);

    const instructionData = new MintSplArgs({
      instruction: MyInstruction.MintSpl,
      quantity: new BN(100000099999999),
    });

    const ix = new TransactionInstruction({
      keys: [
        {
          pubkey: tokenMintKeypair.publicKey,
          isSigner: false,
          isWritable: true,
        }, // Mint account
        { pubkey: payer.publicKey, isSigner: false, isWritable: true }, // Mint authority account
        {
          pubkey: associatedTokenAccountAddress,
          isSigner: false,
          isWritable: true,
        }, // ATA
        { pubkey: payer.publicKey, isSigner: true, isWritable: true }, // Payer
        { pubkey: SystemProgram.programId, isSigner: false, isWritable: true }, // System program
        { pubkey: TOKEN_PROGRAM_ID, isSigner: false, isWritable: false }, // Token program
        {
          pubkey: ASSOCIATED_TOKEN_PROGRAM_ID,
          isSigner: false,
          isWritable: false,
        }, // Token metadata program
      ],
      programId: program.publicKey,
      data: instructionData.toBuffer(),
    });

    const sx = await sendAndConfirmTransaction(connection, new Transaction().add(ix), [payer]);

    console.log('Success!');
    console.log(`   ATA Address: ${associatedTokenAccountAddress}`);
    console.log(`   Tx Signature: ${sx}`);
  });

  // it('Prep a new test wallet for transfers', async () => {
  //   await connection.confirmTransaction(
  //     await connection.requestAirdrop(recipientWallet.publicKey, await connection.getMinimumBalanceForRentExemption(0)),
  //   );
  //   console.log(`Recipient Pubkey: ${recipientWallet.publicKey}`);
  // });



});
