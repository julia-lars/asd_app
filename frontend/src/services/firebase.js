import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

// Firebase配置（仅用于 Firestore 数据库）
const firebaseConfig = {
  apiKey: "AIzaSyDDxJxszAfwNV6UEw_tz5Sx69zy4uO_tlU",
  authDomain: "asd-app-4e926.firebaseapp.com",
  projectId: "asd-app-4e926",
  storageBucket: "asd-app-4e926.firebasestorage.app",
  messagingSenderId: "564399830384",
  appId: "1:564399830384:web:dc980059d5c260707c4bb5",
  measurementId: "G-G789VMFMET"
};

// 初始化Firebase
const app = initializeApp(firebaseConfig);

// 仅导出数据库实例（认证已改用自建 JWT）
export const db = getFirestore(app);
export default app;
