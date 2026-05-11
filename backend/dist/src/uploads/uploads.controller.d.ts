export declare class UploadsController {
    uploadFile(file: Express.Multer.File): {
        message: string;
        filename: string;
        url: string;
        size: number;
        mimetype: string;
    };
}
