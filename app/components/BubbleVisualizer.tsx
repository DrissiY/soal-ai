'use client'

import { useEffect, useRef } from 'react'

type BubbleVisualizerProps = {
  volume: number // value between 0 and 1
  spawnFrom?: { x: number; y: number }
  speaker?: 'ai' | 'user'
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
      color: string
    }[] = []

    const getColor = () =>
      speaker === 'user' ? '0, 200, 100' : '168, 85, 247'

    class Bubble {
      constructor(
        public x: number,
        public y: number,
        public r: number,
        public vx: number,
        public vy: number,
        public alpha: number,
        public color: string
      ) {}

      update() {
        this.x += this.vx
        this.y += this.vy
        this.alpha -= 0.002 // even slower fade
      }

      draw(ctx: CanvasRenderingContext2D) {
        ctx.shadowColor = `rgba(${this.color}, ${this.alpha})`
        ctx.shadowBlur = this.alpha > 0.6 ? 0 : 10

        const gradient = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.r)
        gradient.addColorStop(0, `rgba(${this.color}, ${this.alpha})`)
        gradient.addColorStop(1, `rgba(255, 255, 255, 0)`)

        ctx.beginPath()
        ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2)
        ctx.fillStyle = gradient
        ctx.fill()
      }
    }

    const spawnBubble = (vol: number = 0.5) => {
      // Small chance to skip this tick
      if (Math.random() > 0.6) return

      const v = Math.max(vol, 0.2)
      const angle = Math.random() * 2 * Math.PI
      const speed = Math.random() * 0.1 + 0.02
      const r = Math.random() * 8 + v * 10

      const origin = spawnFrom || {
        x: canvas.width / 2,
        y: canvas.height / 1.6,
      }

      const vx = Math.cos(angle) * speed
      const vy = Math.sin(angle) * speed - 0.05

      bubbles.push(new Bubble(origin.x, origin.y, r, vx, vy, 1, getColor()))
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      bubbles = bubbles.filter((b) => {
        b.update()
        b.draw(ctx)
        return b.alpha > 0
      })

      requestAnimationFrame(animate)
    }

    animate()

    const interval = setInterval(() => {
      spawnBubble(volume)
    }, 300) // slower interval (1 bubble per ~0.3s)

    return () => {
      clearInterval(interval)
      window.removeEventListener('resize', resizeCanvas)
    }
  }, [volume, spawnFrom, speaker])

  return (
    <canvas
      ref={canvasRef}
      className="w-full h-full pointer-events-none absolute top-0 left-0"
    />
  )
}