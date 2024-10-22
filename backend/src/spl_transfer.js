const solanaWeb3 = require('@solana/web3.js');
const splToken = require('@solana/spl-token');
const fs = require('fs');

// Function to transfer SPL tokens
async function transfer(sender_address, sender_keypair, receive_address, value) {
  try {
    const rpcData = JSON.parse(fs.readFileSync('../data/rpc.json', 'utf-8'));
    const programData = JSON.parse(fs.readFileSync('../data/program.json', 'utf-8'));
    const connection = new solanaWeb3.Connection(rpcData.rpcUrl, 'confirmed');

    const mintPublicKey = new solanaWeb3.PublicKey(programData.mintAddress);
    const senderPublicKey = new solanaWeb3.PublicKey(sender_address);
    const receivePublicKey = new solanaWeb3.PublicKey(receive_address);

    // Get associated token accounts for sender and receiver
    const senderTokenAddress = await splToken.getAssociatedTokenAddress(
      mintPublicKey,
      senderPublicKey
    );
    let receiveTokenAddress;
    try {
      receiveTokenAddress = await splToken.getAssociatedTokenAddress(
        mintPublicKey,
        receivePublicKey
      );
      // Check if the receiver token account exists
      await connection.getTokenAccountBalance(receiveTokenAddress);
    } catch (error) {
      console.log('Receiver address does not exist, creating token account.');
      // Create associated token account for receiver
      receiveTokenAddress = await splToken.createAssociatedTokenAccount(
        connection,
        sender_keypair,
        mintPublicKey,
        receivePublicKey
      );
    }

    // Transfer tokens
    const transaction = new solanaWeb3.Transaction().add(
      splToken.createTransferInstruction(
        senderTokenAddress,
        receiveTokenAddress,
        sender_keypair.publicKey,
        value * Math.pow(10, 9) // Assuming token has 9 decimals
      )
    );

    const signature = await solanaWeb3.sendAndConfirmTransaction(
      connection,
      transaction,
      [sender_keypair]
    );

    console.log('Transfer successful with signature:', signature);
    return { status: 200, signature };
  } catch (error) {
    console.error('Error during SPL token transfer:', error);
    return { status: 500, message: 'Error during SPL token transfer' };
  }
}

// Test function to test transfer
async function test() {
  // try {
  //   // Read sender keypair from bank.json
  //   const bankData = JSON.parse(fs.readFileSync('../data/bank.json', 'utf-8'));
  //   const sender_keypair = solanaWeb3.Keypair.fromSecretKey(Buffer.from(bankData));
  //   const sender_address = sender_keypair.publicKey.toBase58();

  //   // Define receiver address
  //   const receive_address = 'EU6Cmc8W4CLC2G8mA17ekekgGGd4B8ibDr6xjehm2Toa';
  //   const value = 10; // Amount to transfer

  //   // Perform transfer
  //   const result = await transfer(sender_address, sender_keypair, receive_address, value);
  //   console.log('Test transfer result:', result);
  // } catch (error) {
  //   console.error('Error during test transfer:', error);
  // }
}

test();

module.exports = { transfer };
