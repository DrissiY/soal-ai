"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import BubbleVisualizer from "../components/BubbleVisualizer";

// Firebase client imports
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from "@/firebase/client"; // <- client auth from your last file

// Your server action
import { handleGoogleAuth } from "@/lib/actions/auth.action";

// Shadcn Dialog
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/app/components/ui/dialog";

export default function Home() {
  const [volume, setVolume] = useState(0);
  const targetVolume = useRef(0);
  const [connecting, setConnecting] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const sequence = [0, 3.2, 0, 5.1];
    let index = 0;

    const interval = setInterval(() => {
      targetVolume.current = sequence[index];
      index = (index + 1) % sequence.length;
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    let rafId: number;

    const animate = () => {
      setVolume((prev) => {
        const diff = targetVolume.current - prev;
        const eased = prev + diff * 0.2;
        return parseFloat(eased.toFixed(2));
      });
      rafId = requestAnimationFrame(animate);
    };

    animate();

    return () => cancelAnimationFrame(rafId);
  }, []);

  const handleStartInterview = async () => {
    try {
      setConnecting(true);

      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const idToken = await result.user.getIdToken();

      const response = await handleGoogleAuth(idToken);

      if (response?.success) {
        router.push("/interview");
      } else {
        alert("❌ Authentication failed.");
      }
    } catch (err) {
      console.error("Google Sign-In Error:", err);
    } finally {
      setConnecting(false);
    }
  };

  return (
    <main className="relative h-dvh px-6 sm:px-10 py-6 bg-[#FFFDF4] flex flex-col justify-between overflow-hidden">
      <BubbleVisualizer volume={volume} />

      <div className="relative z-10 flex flex-col items-start text-left justify-center flex-grow">
        <div className="mb-6">
          <Image src="/Soal-logo.png" width={100} height={20} alt="logo" />
        </div>

        <h1 className="text-[64px] font-bold leading-tight bg-gradient-to-r from-purple-700 to-green-400 bg-clip-text text-transparent font-playfair">
          Ready for your next big
          <br />
          opportunity?
        </h1>

        <p className="text-gray-700 max-w-md mb-6 text-base sm:text-lg">
          Simulate real interviews. Get honest feedback. <br />
          Walk in confident, walk out hired.
        </p>

        <button
          onClick={handleStartInterview}
          className="inline-block rounded-full px-6 py-3 text-white font-semibold text-sm sm:text-base bg-gradient-to-r from-purple-800 to-black hover:brightness-110 transition"
        >
          🚀 Start Your Interview
        </button>
      </div>

      <div className="relative z-10 flex justify-center">
        <p className="text-gray-400 text-xs sm:text-sm italic text-center">
          Crafted with AI, designed by interviewers — for serious talent like you.
        </p>
      </div>

      <Dialog open={connecting}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Connecting with Google...</DialogTitle>
            <p className="text-sm text-muted-foreground">Please wait while we log you in.</p>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </main>
  );
}