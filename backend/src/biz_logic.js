const http = require('http');
const { getKeypair } = require('./keystore');
const { get_sol_addr } = require('./address');
const { getUser, addUser, activateUser,getRefUser } = require('./account');
const { get_esim, get_esim_opid, get_esim_uid, sell_esim, get_dp, act_esim } = require('./esimapi');
const { getBalance } = require('./spl_balance');
const { agent_reward, normal_reward } = require('./reward');


async function login(body, res) {
    console.log("login");
    const { tid } = JSON.parse(body);
    if (!tid) {
      res.writeHead(400, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ status: 400, message: 'tid is required' }));
      return;
    }
    console.log(`tid ${tid}`);
    let userResult = getUser(tid);
    if (userResult.status === 404) {
    console.log(`add tid ${tid}`);
      userResult = addUser(tid);
    }
  
    if (userResult.status !== 200 && userResult.status !== 201) {
      res.writeHead(userResult.status, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(userResult));
      return;
    }
  
    const user = userResult.user;
    const keypair = getKeypair(Uint8Array.from(user.secret));
    const address = await get_sol_addr(keypair);
    let balanceResult = await getBalance(address);
    let balance = balanceResult && balanceResult.status === 404 ? 0 : balanceResult;
    //let balance = 0;
    let isact = user.isact;
    let isagent = user.isagent;
    let rid = user.rid;
    let devid = user.devid;
  
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ address, balance, rid, isact, isagent, devid }));
  
  }

  async function getagent(body, res) {
    console.log("getagent");
    const { tid } = JSON.parse(body);
    if (!tid) {
      res.writeHead(400, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ status: 400, message: 'tid is required' }));
      return;
    }
  
    let userResult = getRefUser(tid);
    if (userResult.status !== 200 && userResult.status !== 201) {
      res.writeHead(userResult.status, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(userResult));
      return;
    }
  
    const users = userResult.users;
    const userList = await Promise.all(users.map(async user => {
      const keypair = getKeypair(Uint8Array.from(user.secret));
      const address = await get_sol_addr(keypair);
      return {
        address,
        isagent: user.isagent
      };
    }));
  
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(userList));
  }
  

  async function makeAgent(body, res) {
    console.log("makeAgent");
    const { tid, rid } = JSON.parse(body);
    if (!tid || !rid) {
      res.writeHead(400, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ status: 400, message: 'tid and rid are required' }));
      return;
    }

    // Activate the user
    const activationResult = activateUser(tid, rid);
    if (activationResult.status !== 200) {
      res.writeHead(activationResult.status, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(activationResult));
      return;
    }

    // Reward the agent
    const rewardResult = await agent_reward(tid);
    if (rewardResult.status !== 200) {
      res.writeHead(rewardResult.status, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(rewardResult));
      return;
    }

    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ status: 200, message: 'User activated and rewards transferred successfully' }));
}

async function getEsim(body, res) {
    console.log("getEsim");
    const { id, type } = JSON.parse(body);
    if (!id || !type) {
      res.writeHead(400, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ status: 400, message: 'id and type are required' }));
      return;
    }
  
    let esimResult;
    if (type === 'tid') {
      esimResult = get_esim(id);
    } else if (type === 'uid') {
      esimResult = get_esim_uid(id);
    } else if (type === 'opid') {
      esimResult = get_esim_opid(id);
    } else {
      res.writeHead(400, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ status: 400, message: 'Invalid type value. Must be tid, uid, or opid.' }));
      return;
    }
  
    if (esimResult.status !== 200) {
      res.writeHead(esimResult.status, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(esimResult));
      return;
    }
  
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(esimResult.data));
  
  }

async function sellEsim(body, res) {
     console.log("sellEsim");
      const { tid, uid } = JSON.parse(body);
      if (!tid || !uid) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ status: 400, message: 'id and type are required' }));
        return;
      }
      //function start here
      let sellResult = sell_esim(tid, uid);

      if (sellResult.status !== 200) {
        res.writeHead(sellResult.status, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(sellResult));
        return;
      }

      const result = await normal_reward(tid,1000);
      console.log('sell_esim normal_reward result:', result);

      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(sellResult.data));
}

async function getdp(body, res) {
      console.log("getdp");
      const { sequ } = JSON.parse(body);
      if (!sequ) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ status: 400, message: 'id and type are required' }));
        return;
      }
      //function start here
      let dpResult = get_dp(sequ);

      if (dpResult.status !== 200) {
        res.writeHead(dpResult.status, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(dpResult));
        return;
      }

      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(dpResult.data));
}

async function actEsim(body, res) {
    console.log("actEsim");
      const { sequ,opid,devid,iccid } = JSON.parse(body);
      if (!sequ || !opid || !devid || !iccid) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ status: 400, message: 'id and type are required' }));
        return;
      }
      //function start here
      let actResult = act_esim(sequ, opid, devid, iccid);

      if (actResult.status !== 200) {
        res.writeHead(actResult.status, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(actResult));
        return;
      }
      const result = await normal_reward(opid, 500);
      console.log('sell_esim normal_reward result:', result);

      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(actResult.data));
}

module.exports = { login, getagent, makeAgent, getEsim, sellEsim, getdp, actEsim };