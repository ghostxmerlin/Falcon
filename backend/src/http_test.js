const axios = require('axios');

async function testLogin() {
  try {
    const response = await axios.post('http://localhost:3000/login', {
      tid: '11111111'
    });
    console.log('Test /login response:', response.data);
  } catch (error) {
    if (error.response) {
      console.error('Test /login error response:', error.response.data);
    } else {
      console.error('Test /login error:', error.message);
    }
  }
}

async function testgetagent() {
  try {
    const response = await axios.post('http://localhost:3000/getagent', {
      tid: '11111111'
    });
    console.log('Test /testgetagent response:', response.data);
  } catch (error) {
    if (error.response) {
      console.error('Test /testgetagent error response:', error.response.data);
    } else {
      console.error('Test /testgetagent error:', error.message);
    }
  }
}

async function testMakeAgent() {
  try {
    const response = await axios.post('http://localhost:3000/make_agent', {
      tid: '22222222',
      rid: '11111111'
    });
    console.log('Test /make_agent response:', response.data);
  } catch (error) {
    if (error.response) {
      console.error('Test /make_agent error response:', error.response.data);
    } else {
      console.error('Test /make_agent error:', error.message);
    }
  }
}

async function testGetEsim() {
  try {
    const response = await axios.post('http://localhost:3000/getesim', {
      id: '11111111',
      type: 'tid' // This can be 'tid', 'uid', or 'opid'
    });
    console.log('Test /getesim response:', response.data);
  } catch (error) {
    if (error.response) {
      console.error('Test /getesim error response:', error.response.data);
    } else {
      console.error('Test /getesim error:', error.message);
    }
  }
}

async function testSellEsim() {
  try {
    const response = await axios.post('http://localhost:3000/sellesim', {
      tid: '11111111',
      uid: '22222222' // This can be 'tid', 'uid', or 'opid'
    });
    console.log('Test /getesim response:', response.data);
  } catch (error) {
    if (error.response) {
      console.error('Test /getesim error response:', error.response.data);
    } else {
      console.error('Test /getesim error:', error.message);
    }
  }
}

async function testGetdp() {
  try {
    const response = await axios.post('http://localhost:3000/getdp', {
      sequ: 1
    });
    console.log('Test /getesim response:', response.data);
  } catch (error) {
    if (error.response) {
      console.error('Test /getesim error response:', error.response.data);
    } else {
      console.error('Test /getesim error:', error.message);
    }
  }
}
//sequ,opid,devid,iccid
async function testActesim() {
  try {
    const response = await axios.post('http://localhost:3000/actesim', {
      sequ: 1,
      opid: '11111111',
      devid:'34343434',
      iccid:'1111222233334444'

    });
    console.log('Test /getesim response:', response.data);
  } catch (error) {
    if (error.response) {
      console.error('Test /getesim error response:', error.response.data);
    } else {
      console.error('Test /getesim error:', error.message);
    }
  }
}

function http_test()
{
// Test the /login endpoint
    //testLogin();
    //testMakeAgent();
    //testGetEsim();
    //testSellEsim();
    //testGetdp();
    //testActesim() ;
    //testgetagent();
}


module.exports = { http_test };