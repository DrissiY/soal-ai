'use client'

import { useEffect, useRef } from 'react'

type BubbleVisualizerProps = {
  volume: number // value between 0 and 1
  spawnFrom?: { x: number; y: number }
  speaker?: 'ai' | 'user' // determines color
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
      secondaryColor: string
      rotation: number
      rotationSpeed: number
      pulsePhase: number
      type: 'normal' | 'ring' | 'dot' | 'spark'
    }[] = []

    const getColors = () => {
      if (speaker === 'user') {
        return {
          primary: '34, 197, 94', // emerald-500
          secondary: '16, 185, 129', // emerald-400
        }
      } else {
        return {
          primary: '147, 51, 234', // purple-600
          secondary: '168, 85, 247', // purple-500
        }
      }
    }

    class Bubble {
      constructor(
        public x: number,
        public y: number,
        public r: number,
        public vx: number,
        public vy: number,
        public alpha: number,
        public color: string,
        public secondaryColor: string,
        public rotation: number = 0,
        public rotationSpeed: number = 0.02,
        public pulsePhase: number = 0,
        public type: 'normal' | 'ring' | 'dot' | 'spark' = 'normal'
      ) {}

      update() {
        this.x += this.vx
        this.y += this.vy
        this.alpha -= this.type === 'spark' ? 0.015 : 0.008
        this.rotation += this.rotationSpeed
        this.pulsePhase += 0.1
        
        // Add slight gravity and air resistance
        this.vy += 0.002
        this.vx *= 0.998
        this.vy *= 0.998
      }

      draw(ctx: CanvasRenderingContext2D) {
        ctx.save()
        ctx.translate(this.x, this.y)
        ctx.rotate(this.rotation)
        
        const pulse = Math.sin(this.pulsePhase) * 0.2 + 1
        const currentR = this.r * pulse

        switch (this.type) {
          case 'normal':
            this.drawNormalBubble(ctx, currentR)
            break
          case 'ring':
            this.drawRingBubble(ctx, currentR)
            break
          case 'dot':
            this.drawDotBubble(ctx, currentR)
            break
          case 'spark':
            this.drawSparkBubble(ctx, currentR)
            break
        }
        
        ctx.restore()
      }

      drawNormalBubble(ctx: CanvasRenderingContext2D, r: number) {
        // Outer glow
        const outerGradient = ctx.createRadialGradient(0, 0, 0, 0, 0, r * 1.5)
        outerGradient.addColorStop(0, `rgba(${this.color}, ${this.alpha * 0.3})`)
        outerGradient.addColorStop(0.5, `rgba(${this.color}, ${this.alpha * 0.1})`)
        outerGradient.addColorStop(1, 'rgba(255, 255, 255, 0)')
        
        ctx.beginPath()
        ctx.arc(0, 0, r * 1.5, 0, Math.PI * 2)
        ctx.fillStyle = outerGradient
        ctx.fill()

        // Main bubble with texture
        const mainGradient = ctx.createRadialGradient(-r * 0.3, -r * 0.3, 0, 0, 0, r)
        mainGradient.addColorStop(0, `rgba(255, 255, 255, ${this.alpha * 0.8})`)
        mainGradient.addColorStop(0.2, `rgba(${this.secondaryColor}, ${this.alpha * 0.6})`)
        mainGradient.addColorStop(0.7, `rgba(${this.color}, ${this.alpha * 0.4})`)
        mainGradient.addColorStop(1, `rgba(${this.color}, ${this.alpha * 0.1})`)

        ctx.beginPath()
        ctx.arc(0, 0, r, 0, Math.PI * 2)
        ctx.fillStyle = mainGradient
        ctx.fill()

        // Inner highlight
        const highlightGradient = ctx.createRadialGradient(-r * 0.4, -r * 0.4, 0, -r * 0.4, -r * 0.4, r * 0.6)
        highlightGradient.addColorStop(0, `rgba(255, 255, 255, ${this.alpha * 0.5})`)
        highlightGradient.addColorStop(1, 'rgba(255, 255, 255, 0)')

        ctx.beginPath()
        ctx.arc(-r * 0.4, -r * 0.4, r * 0.6, 0, Math.PI * 2)
        ctx.fillStyle = highlightGradient
        ctx.fill()

        // Subtle border
        ctx.beginPath()
        ctx.arc(0, 0, r, 0, Math.PI * 2)
        ctx.strokeStyle = `rgba(${this.color}, ${this.alpha * 0.3})`
        ctx.lineWidth = 1
        ctx.stroke()
      }

      drawRingBubble(ctx: CanvasRenderingContext2D, r: number) {
        const thickness = r * 0.2
        
        // Outer ring
        ctx.beginPath()
        ctx.arc(0, 0, r, 0, Math.PI * 2)
        ctx.arc(0, 0, r - thickness, 0, Math.PI * 2, true)
        ctx.fillStyle = `rgba(${this.color}, ${this.alpha * 0.6})`
        ctx.fill()

        // Inner glow
        const innerGradient = ctx.createRadialGradient(0, 0, r - thickness, 0, 0, r)
        innerGradient.addColorStop(0, 'rgba(255, 255, 255, 0)')
        innerGradient.addColorStop(1, `rgba(${this.secondaryColor}, ${this.alpha * 0.4})`)
        
        ctx.beginPath()
        ctx.arc(0, 0, r, 0, Math.PI * 2)
        ctx.fillStyle = innerGradient
        ctx.fill()
      }

      drawDotBubble(ctx: CanvasRenderingContext2D, r: number) {
        // Central dot
        ctx.beginPath()
        ctx.arc(0, 0, r * 0.3, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(${this.color}, ${this.alpha})`
        ctx.fill()

        // Surrounding dots
        for (let i = 0; i < 6; i++) {
          const angle = (i / 6) * Math.PI * 2
          const x = Math.cos(angle) * r * 0.7
          const y = Math.sin(angle) * r * 0.7
          
          ctx.beginPath()
          ctx.arc(x, y, r * 0.15, 0, Math.PI * 2)
          ctx.fillStyle = `rgba(${this.secondaryColor}, ${this.alpha * 0.7})`
          ctx.fill()
        }
      }

      drawSparkBubble(ctx: CanvasRenderingContext2D, r: number) {
        // Central bright point
        const sparkGradient = ctx.createRadialGradient(0, 0, 0, 0, 0, r)
        sparkGradient.addColorStop(0, `rgba(255, 255, 255, ${this.alpha})`)
        sparkGradient.addColorStop(0.3, `rgba(${this.color}, ${this.alpha * 0.8})`)
        sparkGradient.addColorStop(1, 'rgba(255, 255, 255, 0)')

        ctx.beginPath()
        ctx.arc(0, 0, r, 0, Math.PI * 2)
        ctx.fillStyle = sparkGradient
        ctx.fill()

        // Cross sparkle effect
        ctx.strokeStyle = `rgba(255, 255, 255, ${this.alpha * 0.8})`
        ctx.lineWidth = 2
        ctx.beginPath()
        ctx.moveTo(-r * 1.2, 0)
        ctx.lineTo(r * 1.2, 0)
        ctx.moveTo(0, -r * 1.2)
        ctx.lineTo(0, r * 1.2)
        ctx.stroke()
      }
    }

    const spawnBubbles = (vol: number = 0.5) => {
      const v = Math.max(vol, 0.4)
      const count = Math.floor(v * 8 + 2)
      const colors = getColors()
      
      for (let i = 0; i < count; i++) {
        const angle = Math.random() * 2 * Math.PI
        const speed = Math.random() * 1.2 + 0.3
        const r = Math.random() * 20 + v * 30

        const origin = spawnFrom || {
          x: canvas.width / 2,
          y: canvas.height / 1.6,
        }

        const vx = Math.cos(angle) * speed * 0.6
        const vy = Math.sin(angle) * speed * 0.6 - 0.5

        // Determine bubble type based on volume and randomness
        let type: 'normal' | 'ring' | 'dot' | 'spark' = 'normal'
        const rand = Math.random()
        
        if (v > 0.8 && rand < 0.1) type = 'spark'
        else if (v > 0.6 && rand < 0.2) type = 'ring'
        else if (rand < 0.15) type = 'dot'

        bubbles.push(new Bubble(
          origin.x + (Math.random() - 0.5) * 20, 
          origin.y + (Math.random() - 0.5) * 20, 
          r, 
          vx, 
          vy, 
          0.9, 
          colors.primary,
          colors.secondary,
          Math.random() * Math.PI * 2,
          (Math.random() - 0.5) * 0.04,
          Math.random() * Math.PI * 2,
          type
        ))
      }
    }

    const animate = () => {
      // Create a subtle background pattern
      ctx.fillStyle = 'rgba(248, 250, 252, 0.02)'
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      bubbles.forEach((b, index) => {
        b.update()
        b.draw(ctx)
        if (b.alpha <= 0 || b.y > canvas.height + 50) {
          bubbles.splice(index, 1)
        }
      })

      requestAnimationFrame(animate)
    }

    animate()

    const interval = setInterval(() => {
      spawnBubbles(volume)
    }, 100)

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