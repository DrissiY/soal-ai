'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import BubbleVisualizer from '../components/BubbleVisualizer';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { auth } from '@/firebase/client';
import { handleGoogleAuth, getCurrentUser } from '@/lib/actions/auth.action';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/app/components/ui/dialog';
import { motion } from 'framer-motion';

export default function Home() {
  const [volume, setVolume] = useState(0);
  const targetVolume = useRef(0);
  const [connecting, setConnecting] = useState(false);
  const [user, setUser] = useState<any>(null);
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

  useEffect(() => {
    async function fetchUser() {
      const currentUser = await getCurrentUser();
      if (currentUser?.id) setUser(currentUser);
    }
    fetchUser();
  }, []);

  const handleStartInterview = async () => {
    try {
      setConnecting(true);
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const idToken = await result.user.getIdToken();
      const response = await handleGoogleAuth(idToken);
      if (response?.success) {
        router.push('/interview');
      } else {
        alert('❌ Authentication failed.');
      }
    } catch (err) {
      console.error('Google Sign-In Error:', err);
    } finally {
      setConnecting(false);
    }
  };

  return (
    <main className="relative h-dvh px-6 sm:px-10 bg-[#FFFDF4] flex flex-col justify-between overflow-hidden">
      {/* Top Content */}
      <div className="flex flex-col md:flex-row flex-1 items-center justify-between ">
        {/* Left Column */}
        <div className="relative z-10 flex flex-col items-start text-left justify-center flex-1 max-w-full">
          <div>
            {user ? (
              <h2 className="text-lg font-semibold text-gray-900">
                Hey <span className="text-purple-700">{user.name}</span> 👋
              </h2>
            ) : (
              <Image src="/Soal-logo.png" width={100} height={20} alt="logo" />
            )}
          </div>

          <h1 className="text-[40px] sm:text-[52px] md:text-[64px] font-bold leading-tight bg-gradient-to-r from-purple-700 to-green-400 bg-clip-text text-transparent font-playfair mt-2">
            Ready for your next big opportunity?
          </h1>

          <p className="text-gray-700 max-w-md mb-6 text-base sm:text-lg mt-2">
            Simulate real interviews. Get honest feedback. <br />
            Walk in confident, walk out hired.
          </p>

          <button
  onClick={user ? () => router.push('/interview') : handleStartInterview}
  className="inline-block rounded-full px-6 py-3 text-white font-semibold text-sm sm:text-base
    bg-gradient-to-r from-black via-purple-700 to-purple-500 
    bg-[length:200%_200%] bg-[position:0%_0%]
    hover:from-black hover:via-green-500 hover:to-green-400
    hover:bg-[position:100%_100%]
    transition-all duration-700 ease-in-out"
>
  {user ? 'Generate Interview' : '🚀 Start Interview'}
</button>
        </div>

        {/* Right BubbleVisualizer with Motion */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, ease: 'easeOut' }}
          className="relative w-full md:w-[50%] h-[50%] "
        >
          <BubbleVisualizer volume={volume} />
        </motion.div>
      </div>

      {/* Footer */}
      <div className="relative z-10 flex justify-center mt-6">
        <p className="text-gray-400 text-xs sm:text-sm italic text-center">
          Crafted with AI, designed by interviewers — for serious talent like you.
        </p>
      </div>

      {/* Dialog */}
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