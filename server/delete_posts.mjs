import admin from 'firebase-admin';
import { readFileSync } from 'node:fs';
import path from 'node:path';

// Try to initialize like longTermMemory.js does
const serviceAccountPath = process.env.FIREBASE_SERVICE_ACCOUNT_PATH;
if (serviceAccountPath) {
  const sa = JSON.parse(readFileSync(serviceAccountPath, 'utf-8'));
  admin.initializeApp({ credential: admin.credential.cert(sa) });
} else {
  // Try application default credentials
  admin.initializeApp();
}

const db = admin.firestore();
const snap = await db.collection('posts').get();
const batch = db.batch();
snap.docs.forEach((d) => batch.delete(d.ref));
await batch.commit();
console.log('Deleted ' + snap.docs.length + ' posts');
