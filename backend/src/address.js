const solanaWeb3 = require('@solana/web3.js');
const splToken = require('@solana/spl-token');
const fs = require('fs');
// Function to get Solana account address from a keypair
function get_sol_addr(keyPair) {
  try {
    const publicKey = keyPair.publicKey.toBase58();
    console.log('Solana account address:', publicKey);
    return publicKey;
  } catch (error) {
    console.error('Error getting Solana account address:', error);
    return null;
  }
}

// Function to get SPL token address from a keypair
async function get_spl_address(keyPair) {
  try {
    const programData = JSON.parse(fs.readFileSync('../data/program.json', 'utf-8'));
    const mintPublicKey = new solanaWeb3.PublicKey(programData.mintAddress);
    console.log(`mint address ${mintPublicKey}`);
    const associatedTokenAddress = await splToken.getAssociatedTokenAddress(
      mintPublicKey,
      keyPair.publicKey
    );
    console.log('SPL token address:', associatedTokenAddress.toBase58());
    return associatedTokenAddress.toBase58();
  } catch (error) {
    console.error('Error getting SPL token address:', error);
    return null;
  }
}

// Test function to test get_sol_addr and get_spl_address
async function test() {
  // const keyPair = solanaWeb3.Keypair.generate();
  // const solAddr = get_sol_addr(keyPair);
  // console.log('Test get_sol_addr result:', solAddr);

  // // Test get_spl_address
  // const mintAddress = 'EdkKoVVqonryWzmdVfiDEdEmqdScqzX3rLHdk2cBqKHs';
  // const splAddress = await get_spl_address(keyPair);
  // console.log('Test get_spl_address result:', splAddress);
}

test();

module.exports = { get_sol_addr, get_spl_address };
