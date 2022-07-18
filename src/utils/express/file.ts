import * as Busboy from 'busboy';
import { Request } from 'express';
import { StatusCodes } from 'http-status-codes';
import * as internal from 'stream';
import { ServerError } from '../../express/error';

export const handleFileUpload = (req: Request, fileHandler: (file: internal.Readable) => Promise<any>) => {
    return new Promise((resolve, reject) => {
        const busboy = Busboy({ headers: req.headers });
        let fileUpload: Promise<any>;

        busboy.on('file', (field, file) => {
            if (field === 'file' && !fileUpload) {
                fileUpload = fileHandler(file).catch(reject);
            } else {
                file.resume();
            }
        });

        busboy.on('error', (err: any) => {
            reject(new ServerError(StatusCodes.INTERNAL_SERVER_ERROR, `Error uploading file, ${err.message}`, err));
        });

        busboy.on('finish', () => {
            if (!fileUpload) reject(new ServerError(StatusCodes.BAD_REQUEST, 'No file provided'));
            else fileUpload.then(resolve);
        });

        req.pipe(busboy);
    });
};
