import cluster from 'node:cluster';

interface Database {
  [key: string]: unknown;
}

const database: Database = {};

export const sharedMemory = {
  get: (key: string) => database[key],
  set: (key: string, value: unknown): void => {
    database[key] = value;
  },
  delete: (key: string): void => {
    delete database[key];
  },
};

if (cluster.isPrimary) {
  cluster.on('message', (worker, message) => {
    const { action, key, value } = message;

    switch (action) {
      case 'get':
        worker.send({ key, value: sharedMemory.get(key) });
        break;
      case 'set':
        sharedMemory.set(key, value);
        break;
      case 'delete':
        sharedMemory.delete(key);
        break;
    }
  });
}
