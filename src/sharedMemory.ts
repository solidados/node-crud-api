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
