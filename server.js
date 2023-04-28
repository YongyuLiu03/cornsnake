import next from 'next';
import express from 'express';
import { createServer } from 'http';
import api from './api.mjs';

const port = process.env.PORT ?? 3000;
const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const server = express();

  server.use('/api', api);

  server.all('*', (req, res) => {
    return handle(req, res);
  });

  createServer(server).listen(port, (err) => {
    if (err) throw err;
    console.log(`> Ready on http://localhost:${port}`);
  });
});
