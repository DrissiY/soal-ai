'use client'

import { useEffect, useRef } from 'react'

type BubbleVisualizerProps = {
  volume: number // value between 0 and 1
  spawnFrom?: { x: number; y: number }
  speaker?: 'ai' | 'user' // new prop
}

export default function BubbleVisualizer({
  volume,
  spawnFrom,
  speaker = 'ai',
}: BubbleVisualizerProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const resizeCanvas = () => {
      canvas.width = canvas.offsetWidth
      canvas.height = canvas.offsetHeight
    }

    resizeCanvas()
    window.addEventListener('resize', resizeCanvas)

    let bubbles: {
      x: number
      y: number
      r: number
      vx: number
      vy: number
      alpha: number
    }[] = []

    const baseColor = speaker === 'user' ? '0, 200, 100' : '168, 85, 247'

    class Bubble {
      constructor(
        public x: number,
        public y: number,
        public r: number,
        public vx: number,
        public vy: number,
        public alpha: number
      ) {}

      update() {
        this.x += this.vx
        this.y += this.vy
        this.alpha -= 0.005
      }

      draw(ctx: CanvasRenderingContext2D) {
        if (this.alpha > 0.7) ctx.shadowBlur = 0
        else if (this.alpha > 0.3) ctx.shadowBlur = 5
        else ctx.shadowBlur = 10

        ctx.shadowColor = `rgba(${baseColor}, ${this.alpha})`

        const gradient = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.r)
        gradient.addColorStop(0, `rgba(${baseColor}, ${this.alpha})`)
        gradient.addColorStop(1, `rgba(255, 255, 255, 0)`)

        ctx.beginPath()
        ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2)
        ctx.fillStyle = gradient
        ctx.fill()
      }
    }

    const spawnBubbles = (volume: number = 0.5) => {
      const count = Math.floor(volume * 10 + 3)
      for (let i = 0; i < count; i++) {
        const angle = Math.random() * 2 * Math.PI
        const speed = Math.random() * 0.8 + 0.5
        const r = Math.random() * 15 + volume * 25

        const origin = spawnFrom || {
          x: canvas.width / 2,
          y: canvas.height / 1.6,
        }

        const vx = Math.cos(angle) * speed * 0.5
        const vy = Math.sin(angle) * speed * 0.5 - 0.4

        bubbles.push(new Bubble(origin.x, origin.y, r, vx, vy, 1))
      }
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      bubbles.forEach((b, index) => {
        b.update()
        b.draw(ctx)
        if (b.alpha <= 0) bubbles.splice(index, 1)
      })

      requestAnimationFrame(animate)
    }

    animate()

    const interval = setInterval(() => {
      spawnBubbles(volume)
    }, 120)

    return () => {
      clearInterval(interval)
      window.removeEventListener('resize', resizeCanvas)
    }
  }, [volume, spawnFrom, speaker])

  return (
    <canvas
      ref={canvasRef}
      className="w-full h-full pointer-events-none"
    />
  )
}