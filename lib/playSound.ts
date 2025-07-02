// utils/playSound.ts
export const playSound = (path: string) => {
    const audio = new Audio(path)
    audio.play().catch((err) => {
      console.warn('Sound play failed:', err)
    })
  }