import {fileURLToPath} from 'url';
import { dirname } from 'path';
import bcrypt from 'bcrypt'

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);



export default __dirname;

export const createHash = (pwd) => bcrypt.hashSync(pwd, bcrypt.genSaltSync(10))

export const validatePassword = (user, pwd) => bcrypt.compareSync(pwd, user.password) 

