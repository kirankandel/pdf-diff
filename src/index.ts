import * as fs from 'fs';
import * as https from 'https';

const getBuffer = async (
  input: string | Buffer,
  inputType: string
): Promise<Buffer> => {
  switch (inputType) {
    case 'file':
      return fs.readFileSync(input as string);
    case 'base64':
      return Buffer.from(input as string, 'base64');
    case 'buffer':
      return input as Buffer;
    case 'url':
      return new Promise((resolve, reject) => {
        https
          .get(input as string, res => {
            const data: Uint8Array[] = [];
            res.on('data', chunk => {
              data.push(chunk);
            });
            res.on('end', () => {
              resolve(Buffer.concat(data));
            });
          })
          .on('error', err => {
            reject(err);
          });
      });
    default:
      throw new Error('Invalid input type');
  }
};
