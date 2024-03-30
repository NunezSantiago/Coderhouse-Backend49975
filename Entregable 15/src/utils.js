import {fileURLToPath} from 'url';
import { dirname } from 'path';
import bcrypt from 'bcrypt'
import multer from 'multer';
import fs from "fs"

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const fileStorage = multer.diskStorage({
    destination: function(req, file, cb){
        let uid = req.params.uid
        const path = __dirname+"/user_files/documents/"+uid
        if(!fs.existsSync(path)){
            fs.mkdirSync(path)
        }
        cb(null, path)
    },
    filename: function(req, file, cb){
        cb(null, `${file.fieldname}_${Date.now()}_${file.originalname.split(" ").join("")}`)
    }
})

export default __dirname;

export const createHash = (pwd) => bcrypt.hashSync(pwd, bcrypt.genSaltSync(10))

export const validatePassword = (user, pwd) => bcrypt.compareSync(pwd, user.password) 

export const upload = multer({storage: fileStorage})

