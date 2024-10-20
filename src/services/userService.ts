import { IUser } from '../models/userModel';
import { v4 } from 'uuid';
import { sharedMemory } from '../sharedMemory';

const USERS_KEY: string = 'users';

const getUsers = (): IUser[] => {
  const data = sharedMemory.get(USERS_KEY);
  return Array.isArray(data) ? (data as IUser[]) : [];
};

const setUsers = (users: IUser[]) => sharedMemory.set(USERS_KEY, users);

export const getAllUsers = async (): Promise<IUser[]> => getUsers();

export const getUserById = async (id: string): Promise<IUser | undefined> => {
  return getUsers().find((user: IUser): boolean => user.id === id);
};

export const createUser = async (data: Omit<IUser, 'id'>): Promise<IUser> => {
  const newUser: IUser = { id: v4(), ...data };
  const users = getUsers();
  users.push(newUser);
  setUsers(users);
  return newUser;
};

export const updateUser = async (
  id: string,
  data: Partial<Omit<IUser, 'id'>>,
): Promise<IUser | null> => {
  const users = getUsers();
  const userIndex: number = users.findIndex(
    (user: IUser): boolean => user.id === id,
  );
  if (userIndex === -1) {
    return null;
  }

  users[userIndex] = { ...users[userIndex], ...data };
  setUsers(users);

  return users[userIndex];
};

export const deleteUser = async (id: string): Promise<boolean> => {
  const users = getUsers();
  const index: number = users.findIndex(
    (user: IUser): boolean => user.id === id,
  );
  if (index === -1) {
    return false;
  }

  users.splice(index, 1);
  setUsers(users);

  return true;
};
