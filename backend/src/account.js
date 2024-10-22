const fs = require('fs');
const { genKey } = require('./keystore');

// Function to count the number of users in users.json
function countUsers() {
  try {
    const data = fs.readFileSync('../database/users.json');
    const users = JSON.parse(data);
    return users.length;
  } catch (error) {
    console.error('Error reading or parsing users.json:', error);
    return 0;
  }
}

// Function to get a user by tid
function getUser(tid) {
  console.log(`getUser`);
  try {
    const data = fs.readFileSync('../database/users.json');
    const users = JSON.parse(data);
    const user = users.find(user => user.tid === tid);
    if (user) {
      return { status: 200, user };
    } else {
      return { status: 404, message: 'User not found' };
    }
  } catch (error) {
    console.error('Error reading or parsing users.json:', error);
    return { status: 500, message: 'Internal server error' };
  }
}

// Function to get the referring user by tid
function getRefUser(tid) {
  try {
    const data = fs.readFileSync('../database/users.json');
    const users = JSON.parse(data);

    const refUsers = users.filter(refUser => refUser.rid === tid);
    if (refUsers.length > 0) {
      return { status: 200, users: refUsers };
    } else {
      return { status: 404, message: 'Referring users not found' };
    }
  } catch (error) {
    console.error('Error reading or parsing users.json:', error);
    return { status: 500, message: 'Internal server error' };
  }
}

// Function to add a user to users.json
function addUser(tid) {
  try {
    const data = fs.readFileSync('../database/users.json');
    const users = JSON.parse(data);
    console.log(`add user`);
    // Check if tid already exists
    if (users.some(user => user.tid === tid)) {
      return { status: 400, message: 'User with this tid already exists' };
    }

    const newUser = {
      sequ: users.length + 1,
      tid: tid,
      secret: Array.from(genKey().secretKey),
      rid: null,
      rtime: new Date().toISOString(),
      isact: false,
      isagent: false,
      devid: "00000000"
    };

    users.push(newUser);
    fs.writeFileSync('../database/users.json', JSON.stringify(users, null, 2).replace(/\n\s+"secret": \[\s+([\s\S]*?)\s+\]/g, (match, p1) => `"secret": [${p1.replace(/\s+/g, ' ')}]`));

    console.log('User added successfully:', newUser);
    return { status: 201, user: newUser };
  } catch (error) {
    console.error('Error adding user to users.json:', error);
    return { status: 500, message: 'Internal server error' };
  }
}

// Function to activate a user by tid
function activateUser(tid, rid) {
  try {
    const data = fs.readFileSync('../database/users.json');
    const users = JSON.parse(data);

    // Find the user by tid
    const userIndex = users.findIndex(user => user.tid === tid);
    if (userIndex === -1) {
      return { status: 404, message: 'User not found' };
    }

    // Check if rid is a valid existing tid
    if (!users.some(user => user.tid === rid)) {
      return { status: 400, message: 'Invalid referring user tid (rid)' };
    }

    // Update user details
    users[userIndex].rid = rid;
    users[userIndex].isact = true;
    users[userIndex].isagent = true;
    users[userIndex].devid = Math.floor(10000000 + Math.random() * 90000000).toString();

    fs.writeFileSync('../database/users.json', JSON.stringify(users, null, 2).replace(/\n\s+"secret": \[\s+([\s\S]*?)\s+\]/g, (match, p1) => `"secret": [${p1.replace(/\s+/g, ' ')}]`));

    console.log('User activated successfully:', users[userIndex]);
    return { status: 200, user: users[userIndex] };
  } catch (error) {
    console.error('Error activating user in users.json:', error);
    return { status: 500, message: 'Internal server error' };
  }
}

// Test function to test countUsers, getUser, getRefUser, addUser, and activateUser, and print the results
function test() {
  // Test countUsers
  // const userCount = countUsers();
  // console.log(`Number of users: ${userCount}`);

  // // Test getUser with existing tid
  // const existingUserResult = getUser('11111111');
  // console.log('Test getUser with existing tid:', existingUserResult);

  // // Test getUser with non-existing tid
  // const nonExistingUserResult = getUser('000000000');
  // console.log('Test getUser with non-existing tid:', nonExistingUserResult);

  // // Test getRefUser with existing ref tid
  // const existingRefUserResult = getRefUser('11111111');
  // console.log('Test getRefUser with existing ref tid:', existingRefUserResult);

  // // Test getRefUser with non-existing ref tid
  // const nonExistingRefUserResult = getRefUser('000000001');
  // console.log('Test getRefUser with non-existing ref tid:', nonExistingRefUserResult);

  // Test addUser
  // const addUserResult = addUser('33333333');
  // console.log('Test addUser result:', addUserResult);

  // Test activateUser
  //   const activateUserResult = activateUser('22222222', '11111111');
  //   console.log('Test activateUser result:', activateUserResult);
}

test();

module.exports = { countUsers, getUser, getRefUser, addUser, activateUser };
