import * as process from 'node:process';
import { config } from 'dotenv';
import { createServer, IncomingMessage, ServerResponse } from 'http';
import {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
} from './controllers/userController';
import {
  notFoundHandler,
  serverErrorHandler,
} from './middleware/routeHandlers';

config();
const PORT: string | 3001 = process.env.PORT || 3001;

const requestHandler = async (
  req: IncomingMessage,
  res: ServerResponse,
): Promise<void> => {
  try {
    const { method } = req;
    const url = new URL(req.url || '', `http://${req.headers.host}`);
    const pathname = url.pathname.replace(/\/$/, '');

    if (pathname === `/api/users` && method === 'GET') {
      return await getAllUsers(req, res);
    }
    if (pathname === `/api/users` && method === 'POST') {
      return await createUser(req, res);
    }
    const userIdMatch = pathname?.match(/^\/api\/users\/([a-f0-9-]+)$/);
    if (userIdMatch) {
      const userId: string = userIdMatch[1];
      if (method === 'GET') {
        return await getUserById(req, res, userId);
      }
      if (method === 'PUT') {
        return await updateUser(req, res, userId);
      }
      if (method === 'DELETE') {
        return await deleteUser(req, res, userId);
      }
    }

    notFoundHandler(res);
  } catch {
    serverErrorHandler(res);
  }
};

const server = createServer(requestHandler);

server.listen(PORT, () => console.log(`Server is running on PORT: ${PORT}`));
