const fs = require('fs');
const solanaWeb3 = require('@solana/web3.js');
const { getUser } = require('./account');
const { getKeypair } = require('./keystore');
const { get_sol_addr } = require('./address');
const { transfer } = require('./spl_transfer');

async function normal_reward(tid, value) {
  try {
  const bankData = JSON.parse(fs.readFileSync('../data/bank.json', 'utf-8'));
  const sender_keypair = solanaWeb3.Keypair.fromSecretKey(Buffer.from(bankData));
  const sender_address = sender_keypair.publicKey.toBase58();
  console.log(`sender_address ${sender_address}`);
  // Get user by tid
  const userResult = getUser(tid);
  if (userResult.status !== 200) {
    return { status: 404, message: 'User not found' };
  }
  const user = userResult.user;
  const userKeypair = getKeypair(Uint8Array.from(user.secret));
  const userAddress = await get_sol_addr(userKeypair);
  const transferToUser = await transfer(sender_address, sender_keypair, userAddress, value);
    if (transferToUser.status !== 200) {
      return { status: 500, message: 'Failed to transfer reward to user' };
    }

    console.log('Rewards transferred successfully:', {
      toUser: transferToUser.signature,
    });
    return { status: 200, message: 'Rewards transferred successfully' };
  } catch (error) {
    console.error('Error during agent reward:', error);
    return { status: 500, message: 'Internal server error' };
  }
}
// Function to reward agents
async function agent_reward(tid) {
  try {
    // Read bank keypair from bank.json
    const bankData = JSON.parse(fs.readFileSync('../data/bank.json', 'utf-8'));
    const sender_keypair = solanaWeb3.Keypair.fromSecretKey(Buffer.from(bankData));
    const sender_address = sender_keypair.publicKey.toBase58();
    console.log(`sender_address ${sender_address}`);
    // Get user by tid
    const userResult = getUser(tid);
    if (userResult.status !== 200) {
      return { status: 404, message: 'User not found' };
    }

    const user = userResult.user;
    if (!user.rid) {
      return { status: 400, message: 'User has no referring user (rid)' };
    }

    // Get referring user by rid
    const refUserResult = getUser(user.rid);
    if (refUserResult.status !== 200) {
      return { status: 404, message: 'Referring user not found' };
    }

    const refUser = refUserResult.user;

    // Generate keypairs for tid and rid
    const userKeypair = getKeypair(Uint8Array.from(user.secret));
    const refUserKeypair = getKeypair(Uint8Array.from(refUser.secret));

    // Get addresses for tid and rid
    const userAddress = await get_sol_addr(userKeypair);
    const refUserAddress = await get_sol_addr(refUserKeypair);
    console.log(`userAddress ${userAddress}`);
    console.log(`refUserAddress ${refUserAddress}`);
    // Transfer rewards
    const transferToRefUser = await transfer(sender_address, sender_keypair, refUserAddress, 5000);
    if (transferToRefUser.status !== 200) {
      return { status: 500, message: 'Failed to transfer reward to referring user' };
    }

    const transferToUser = await transfer(sender_address, sender_keypair, userAddress, 10000);
    if (transferToUser.status !== 200) {
      return { status: 500, message: 'Failed to transfer reward to user' };
    }

    console.log('Rewards transferred successfully:', {
      toRefUser: transferToRefUser.signature,
      toUser: transferToUser.signature,
    });
    return { status: 200, message: 'Rewards transferred successfully' };
  } catch (error) {
    console.error('Error during agent reward:', error);
    return { status: 500, message: 'Internal server error' };
  }
}

// Test function to test agent_reward
async function test() {
//   try {
//     const result = await agent_reward('22222222');
//     console.log('Test agent_reward result:', result);
//   } catch (error) {
//     console.error('Error during test agent_reward:', error);
//   }
  // try {
  //   const result = await normal_reward('22222222',40);
  //   console.log('Test agent_reward result:', result);
  // } catch (error) {
  //   console.error('Error during test agent_reward:', error);
  // }
}

test();

module.exports = { agent_reward, normal_reward };
