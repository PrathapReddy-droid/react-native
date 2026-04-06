import { initializeApp } from 'firebase/app';

const firebaseConfig = {
  apiKey: "AIzaSyBjatuq2mH3Wt2ar5jtl4TQAdED2B4-77Y",
  authDomain: "com.user.fizzyfuzz",
  projectId: "fizzyfuzz-98596",
  storageBucket: "fizzyfuzz-98596.firebasestorage.app",
  appId: "com.user.fizzyfuzz",
};

const app = initializeApp(firebaseConfig);

export default app;
