/** Shape of file from multer FileInterceptor (single file) */
export interface UploadedFileDto {
  fieldname?: string;
  originalname?: string;
  encoding?: string;
  mimetype: string;
  buffer: Buffer;
  size: number;
}
