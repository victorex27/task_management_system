import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const fileName = fileURLToPath(require('url').pathToFileURL(module.filename));
const dirName = dirname(fileName);

const packageRootDir = dirname(dirName);

export const AUTH_PROTO_FILE_PATH = join(packageRootDir, './src/auth.proto');
export const TASK_PROTO_FILE_PATH = join(packageRootDir, './src/task.proto');
export const USER_PROTO_FILE_PATH = join(packageRootDir, './src/user.proto');

export * as AuthProto from './lib/auth';
export * as TaskProto from './lib/task';
export * as UserProto from './lib/user';
