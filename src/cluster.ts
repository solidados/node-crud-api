import * as process from 'node:process';
import { config } from 'dotenv';
import { cpus } from 'node:os';
import cluster from 'node:cluster';
import { createServer } from 'node:http';
import { requestHandler } from './index';

config();

const PORT: number = Number(process.env.PORT) || 4000;
const numCPUs: number = cpus().length - 1;

if (cluster.isPrimary) {
  console.log(`Master ${process.pid} is running...`);

  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }

  cluster.on('exit', (worker, code, signal) => {
    console.log(`Worker ${worker.process.pid} was terminated`);
  });
} else {
  const workerPort: number = PORT + cluster.worker!.id;

  const server = createServer(requestHandler);

  server.listen(workerPort, (): void =>
    console.log(`Worker ${process.pid} is listening on PORT: ${workerPort}`),
  );
}
