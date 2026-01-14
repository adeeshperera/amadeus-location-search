const express = require('express');
const app = express();

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  next();
});

app.get('/api/locations/search', async (req, res) => {
  const keyword = req.query.keyword;
  const nextjsUrl = process.env.NEXTJS_URL || 'http://localhost:3000';
  
  const response = await fetch(
    `${nextjsUrl}/api/locations/search?keyword=${keyword}`
  );
  const data = await response.json();
  
  res.json(data);
});

app.listen(4000, () => console.log('Node proxy on port 4000'));
