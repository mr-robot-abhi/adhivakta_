import admin from 'firebase-admin';
import { v4 as uuidv4 } from 'uuid';

const bucket = admin.storage().bucket();

export const uploadFile = async (
  file: Express.Multer.File,
  folder: string
): Promise<{ url: string; fileName: string }> => {
  const fileName = `${folder}/${uuidv4()}_${file.originalname}`;
  const fileUpload = bucket.file(fileName);

  await fileUpload.save(file.buffer, {
    metadata: {
      contentType: file.mimetype,
    },
  });

  await fileUpload.makePublic();
  return { url: `https://storage.googleapis.com/${bucket.name}/${fileName}`, fileName };
};

export const deleteFile = async (fileName: string) => {
  await bucket.file(fileName).delete();
};