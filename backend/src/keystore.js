const solanaWeb3 = require('@solana/web3.js');
const fs = require('fs');
const { get_sol_addr } = require('./address');

// Function to generate a key pair
function genKey() {
  const keyPair = solanaWeb3.Keypair.generate();
  const secretArray = Array.from(keyPair.secretKey);
  console.log('Generated secret key:', secretArray);
  return keyPair;
}

// Function to create a key pair from a secret key in a file
function genKey_file(filePath) {
  try {
    const keyPair = solanaWeb3.Keypair.fromSecretKey(Buffer.from(JSON.parse(require('node:fs').readFileSync(filePath, 'utf-8'))));
    console.log('Generated key pair from file:', keyPair);
    return keyPair;
  } catch (error) {
    console.error('Error creating key pair from file:', error);
    return null;
  }
}

// Function to create a key pair from a given secret key
function getKeypair(secretKeyArray) {
  try {
    const secretKey = new Uint8Array(secretKeyArray);
    const keyPair = solanaWeb3.Keypair.fromSecretKey(secretKey);
    console.log('Generated key pair from secret key:', keyPair);
    const address = get_sol_addr(keyPair);
    console.log(`address ${address}`);
    return keyPair;
  } catch (error) {
    console.error('Error creating key pair from secret key:', error);
    return null;
  }
}

// Test function to test genKey, genKey_file, and getKeypair
function test() {
  // Test genKey
//   const keyPair = genKey();
//   console.log('Test genKey result:', keyPair);

//   // Test genKey_file
  // const keyPairFromFile = genKey_file('../data/bank.json');
  // console.log('Test genKey_file result:', keyPairFromFile);

  // const solAddr = get_sol_addr(keyPairFromFile);
  // console.log('Test get_sol_addr result:', solAddr);

//   // Test getKeypair
//   const keyPairFromSecret = getKeypair(Array.from(keyPair.secretKey));
//   console.log('Test getKeypair result:', keyPairFromSecret);
}

test();

module.exports = { genKey, genKey_file, getKeypair };
