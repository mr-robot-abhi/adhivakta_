import admin from 'firebase-admin';
import logger from '../utils/logger';
import path from 'path';
import fs from 'fs';

// Path to service account file
const serviceAccountPath = path.join(__dirname, 'firebase-service-account.json');

if (!admin.apps.length) {
  try {
    // Verify file exists
    if (!fs.existsSync(serviceAccountPath)) {
      throw new Error('Firebase service account file not found');
    }

    const serviceAccount = require(serviceAccountPath);

    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      storageBucket: serviceAccount.project_id + '.appspot.com'
    });

    logger.info('Firebase Admin initialized successfully');
  } catch (error: any) {
    logger.error(`Firebase initialization failed: ${error.message}`);
    process.exit(1);
  }
}

export default admin;