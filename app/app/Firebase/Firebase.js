import { initializeApp } from 'firebase/app';

const firebaseConfig = {
  apiKey: "AIzaSyBIwERr4j9d1Sjwsw40fDmcVTxV4W5yb3w",
  authDomain: "com.slvd.fizzyfuzz",
  projectId: "fizzfuzz-61f87",
  storageBucket: "fizzfuzz-61f87.firebasestorage.app",
  appId: "com.slvd.fizzyfuzz",
};

const app = initializeApp(firebaseConfig);

export default app;
