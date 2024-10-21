// import cluster from 'node:cluster';
import { v4 } from 'uuid';
import { IUser } from '../models/userModel';
import { sharedMemory } from '../sharedMemory';
// import { Message } from '../types';
// import { sharedMemory } from '../sharedMemory';

const USERS_KEY: string = 'users';

/*const sendMessageToPrimary = <T>(
  action: string,
  key: string,
  value?: T,
): Promise<T | undefined> => {
  return new Promise((resolve) => {
    if (cluster.isWorker && process.send) {
      const message: Message<T> = { action, key, value };
      process.send(message);

      process.once('message', (response: Message<T> | unknown) => {
        if (
          typeof response === 'object' &&
          response !== null &&
          'value' in response
        ) {
          resolve((response as Message<T>).value);
        } else {
          resolve(undefined);
        }
      });
    } else {
      resolve(undefined);
    }
  });
};*/

const getUsers = async (): Promise<IUser[]> => {
  const data = (await sharedMemory.get(USERS_KEY)) as IUser[] | undefined;
  return Array.isArray(data) ? (data as IUser[]) : [];
};

const setUsers = async (users: IUser[]): Promise<void> => {
  sharedMemory.set(USERS_KEY, users);
};

export const getAllUsers = async (): Promise<IUser[]> => getUsers();

export const getUserById = async (id: string): Promise<IUser | undefined> => {
  const users = await getUsers();
  return users.find((user: IUser): boolean => user.id === id);
};

export const createUser = async (data: Omit<IUser, 'id'>): Promise<IUser> => {
  const newUser: IUser = { id: v4(), ...data };
  const users = await getUsers();
  users.push(newUser);
  await setUsers(users);
  return newUser;
};

export const updateUser = async (
  id: string,
  data: Partial<Omit<IUser, 'id'>>,
): Promise<IUser | null> => {
  const users = await getUsers();
  const userIndex: number = users.findIndex(
    (user: IUser): boolean => user.id === id,
  );

  if (userIndex === -1) return null;

  users[userIndex] = { ...users[userIndex], ...data };
  await setUsers(users);

  return users[userIndex];
};

export const deleteUser = async (id: string): Promise<boolean> => {
  const users = await getUsers();
  const index: number = users.findIndex(
    (user: IUser): boolean => user.id === id,
  );

  if (index === -1) return false;

  users.splice(index, 1);
  await setUsers(users);
  sharedMemory.delete('delete');

  return true;
};
