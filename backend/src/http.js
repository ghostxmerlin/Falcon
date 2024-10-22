const http = require('http');
const { http_test } = require('./http_test');
const { login, makeAgent, getEsim, sellEsim, getdp, actEsim, getagent } = require('./biz_logic');

const server = http.createServer(async (req, res) => {
  // Set CORS headers for all responses
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle OPTIONS preflight request
  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }
  let body = '';

  req.on('data', chunk => {
    body += chunk.toString();
  });

  // req.on('end', async () => {
  //try {

  if (req.method === 'POST' && req.url === '/login') {
    req.on('end', async () => {
      try {
        login(body, res);
      } catch (error) {
        console.error('Error processing login request:', error.message);
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ status: 500, message: 'Internal server error' }));
      }
    });
  }
  else if (req.method === 'POST' && req.url === '/getagent') {
    req.on('end', async () => {
      try {
        getagent(body, res);
      } catch (error) {
        console.error('Error processing login request:', error.message);
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ status: 500, message: 'Internal server error' }));
      }
    });
  }
  else if (req.method === 'POST' && req.url === '/make_agent') {
    req.on('end', async () => {
      try {
        makeAgent(body, res);
      } catch (error) {
        console.error('Error processing login request:', error.message);
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ status: 500, message: 'Internal server error' }));
      }
    });
  }
  else if (req.method === 'POST' && req.url === '/getesim') {
    req.on('end', async () => {
      try {
        getEsim(body, res);
      } catch (error) {
        console.error('Error processing login request:', error.message);
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ status: 500, message: 'Internal server error' }));
      }
    });
  }
  else if (req.method === 'POST' && req.url === '/sellesim') {
    req.on('end', async () => {
      try {
        sellEsim(body, res);//sell esim and normal reward 
      } catch (error) {
        console.error('Error processing login request:', error.message);
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ status: 500, message: 'Internal server error' }));
      }
    });  
  }
  else if (req.method === 'POST' && req.url === '/getdp') {
    req.on('end', async () => {
      try {
        getdp(body, res);//sell esim and normal reward
      } catch (error) {
        console.error('Error processing login request:', error.message);
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ status: 500, message: 'Internal server error' }));
      }
    });   
  }
  else if (req.method === 'POST' && req.url === '/actesim') {
    req.on('end', async () => {
      try {
        actEsim(body, res);//download and normal reward
      } catch (error) {
        console.error('Error processing login request:', error.message);
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ status: 500, message: 'Internal server error' }));
      }
    });   
  }
  else {
    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ status: 404, message: 'Not Found' }));
  }
});


server.listen(3000, () => {
  console.log('Server listening on port 3000');
});

//});

//http_test();

module.exports = server;
