const http = require('http');

const data = JSON.stringify({ code: 'let soma a b = a + b\nsoma 10 20\n' });

const options = {
  hostname: 'localhost',
  port: 3000,
  path: '/api/run',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': data.length
  }
};

const req = http.request(options, res => {
  let body = '';
  res.on('data', d => body += d);
  res.on('end', () => console.log('RESPONSE:', body));
});

req.on('error', error => {
  console.error(error);
});

req.write(data);
req.end();
