const solanaWeb3 = require('@solana/web3.js');
const splToken = require('@solana/spl-token');
const fs = require('fs');

// Function to get SPL token balance for a given address
async function getBalance(address) {
  try {
    const rpcData = JSON.parse(fs.readFileSync('../data/rpc.json', 'utf-8'));
    const programData = JSON.parse(fs.readFileSync('../data/program.json', 'utf-8'));
    
    const connection = new solanaWeb3.Connection(rpcData.rpcUrl);
    const mintPublicKey = new solanaWeb3.PublicKey(programData.mintAddress);
    const addressPublicKey = new solanaWeb3.PublicKey(address);
    console.log(`addressPublicKey ${addressPublicKey}`);
    const associatedTokenAddress = await splToken.getAssociatedTokenAddress(
      mintPublicKey,
      addressPublicKey
    );
    console.log(`associatedTokenAddress ${associatedTokenAddress}`);
    const accountInfo = await connection.getTokenAccountBalance(associatedTokenAddress);
    if (!accountInfo || !accountInfo.value) {
      throw new Error('Token account does not exist');
    }
    const balance = parseFloat(accountInfo.value.amount) / Math.pow(10, 9); // Assuming token has 9 decimals
    console.log('SPL token balance:', balance);
    return balance;
  } catch (error) {
    console.error('Error getting SPL token balance:', error.message);
    return { status: 404, message: 'Address not found or invalid token account' };
  }
}

// Test function to test getBalance
async function test() {
  // const address = '9tLJJuBL7UD5iHd3wTBRxefJeXmBCeJkZawHmL4jnyzP';
  // const balance = await getBalance(address);
  // console.log('Test getBalance result:', balance);
}

test();

module.exports = { getBalance };
