import { getTimestamp, getRandom } from "./cryptoUtils"
import fs from 'fs';
import path from 'path';

// Assuming FILE_ROOT is defined in your environment variables
const FILE_ROOT = process.env.FILE_ROOT;

export const storeFile = (file : Express.Multer.File, ext : string): Promise<string> => {
    try {
        file.filename =  getTimestamp().toString() + getRandom() + "." + ext;
        return new Promise((resolve, reject) => {
            const filePath = path.join(FILE_ROOT, './uploads', file.filename);
            fs.writeFile(filePath, file.buffer, (err) => {
                if (err) {
                    reject(err);
                    return;
                }
                resolve(filePath);
            });
        });
    }
    catch(err){
        throw err
    }
};