"use server";

import { cookies } from "next/headers";
import { initializeFirestore } from "@/firebase/admin"; // <-- your helper
;

const SESSION_DURATION = 60 * 60 * 24 * 7; // 1 week

// 1. Create and set session cookie
export async function setSessionCookie(idToken: string) {
  const { auth } = initializeFirestore();
  const cookieStore = await cookies();

  const sessionCookie = await auth.createSessionCookie(idToken, {
    expiresIn: SESSION_DURATION * 1000,
  });

  cookieStore.set("session", sessionCookie, {
    maxAge: SESSION_DURATION,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    sameSite: "lax",
  });
}

// 2. Handle Google Auth (login or signup)
export async function handleGoogleAuth(idToken: string) {
  const { auth, db } = initializeFirestore();

  try {
    const decodedToken = await auth.verifyIdToken(idToken);
    const { uid, email, name, picture } = decodedToken;

    const userRef = db.collection("users").doc(uid);
    const userDoc = await userRef.get();

    if (!userDoc.exists) {
      await userRef.set({
        email,
        name: name || "",
        profileURL: picture || "",
        createdAt: new Date().toISOString(),
      });
    }

    await setSessionCookie(idToken);

    return {
      success: true,
      message: "Signed in with Google.",
    };
  } catch (error) {
    console.error("Google Auth Error:", error);
    return {
      success: false,
      message: "Authentication failed.",
    };
  }
}

// 3. Sign out
export async function signOut() {
  const cookieStore = cookies();
  cookieStore.delete("session");
}

// 4. Get current user from session
export async function getCurrentUser(): Promise<User | null> {
  const { auth, db } = initializeFirestore();
  const sessionCookie = cookies().get("session")?.value;

  if (!sessionCookie) return null;

  try {
    const decodedClaims = await auth.verifySessionCookie(sessionCookie, true);
    const userDoc = await db.collection("users").doc(decodedClaims.uid).get();

    if (!userDoc.exists) return null;

    return {
      ...userDoc.data(),
      id: userDoc.id,
    } as User;
  } catch (error) {
    console.error("Session Error:", error);
    return null;
  }
}

// 5. Auth check
export async function isAuthenticated() {
  const user = await getCurrentUser();
  return !!user;
}

