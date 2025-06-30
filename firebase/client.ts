
import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'

const firebaseConfig = {
    apiKey: "AIzaSyBJolAn6R_wx5LSzwgKROr7obbqL4C-UVY",
    authDomain: "soal-a0481.firebaseapp.com",
    projectId: "soal-a0481",
    storageBucket: "soal-a0481.firebasestorage.app",
    messagingSenderId: "548196603877",
    appId: "1:548196603877:web:9b12fda1137c279eff010c",
    measurementId: "G-FSDVZ7X15E"
}

const app = initializeApp(firebaseConfig)

export const auth = getAuth(app)
export const db = getFirestore(app)