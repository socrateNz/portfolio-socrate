"use client"

import { useEffect, useRef } from "react"

type Particle = { x: number; y: number; r: number; vy: number; vx: number; life: number; maxLife: number; purple: boolean }

/**
 * Particles rising from the bottom of the hero, denser near the centre so they
 * follow the purple glow. Pure canvas, paused when off-screen, disabled with
 * prefers-reduced-motion.
 */
export function HeroParticles() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas?.getContext("2d")
    if (!canvas || !ctx) return
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return

    let width = 0
    let height = 0
    let raf = 0
    let visible = true
    const particles: Particle[] = []

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      width = canvas.clientWidth
      height = canvas.clientHeight
      canvas.width = width * dpr
      canvas.height = height * dpr
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }

    const count = () => Math.round(Math.min(90, (width * height) / 18000))

    const spawn = (initial = false): Particle => {
      // Bias x toward the centre (average of two randoms -> triangular distribution)
      const x = ((Math.random() + Math.random()) / 2) * width
      const maxLife = 400 + Math.random() * 500
      return {
        x,
        y: initial ? Math.random() * height : height + 10,
        r: 0.6 + Math.random() * 1.8,
        vy: 0.25 + Math.random() * 0.6,
        vx: (Math.random() - 0.5) * 0.2,
        life: initial ? Math.random() * maxLife : 0,
        maxLife,
        purple: Math.random() < 0.6,
      }
    }

    const tick = () => {
      ctx.clearRect(0, 0, width, height)
      while (particles.length < count()) particles.push(spawn(particles.length === 0 || particles.length < count() / 2))

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i]
        p.life++
        p.y -= p.vy
        p.x += p.vx + Math.sin((p.life + i * 40) / 60) * 0.15

        // Fade in, fade out with age, and fade as it climbs toward the top
        const age = p.life / p.maxLife
        const ageAlpha = age < 0.1 ? age / 0.1 : 1 - Math.max(0, (age - 0.6) / 0.4)
        const heightAlpha = Math.max(0, Math.min(1, p.y / height + 0.2))
        const alpha = Math.max(0, ageAlpha * heightAlpha)

        if (p.life >= p.maxLife || p.y < -10) {
          particles[i] = spawn()
          continue
        }

        ctx.beginPath()
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
        ctx.fillStyle = p.purple ? `rgba(160, 110, 230, ${alpha})` : `rgba(255, 255, 255, ${alpha * 0.7})`
        ctx.shadowBlur = p.purple ? 8 : 4
        ctx.shadowColor = p.purple ? "rgba(112, 58, 179, 0.9)" : "rgba(255, 255, 255, 0.6)"
        ctx.fill()
      }
      if (particles.length > count()) particles.length = count()

      if (visible) raf = requestAnimationFrame(tick)
    }

    resize()
    raf = requestAnimationFrame(tick)

    const ro = new ResizeObserver(resize)
    ro.observe(canvas)
    const io = new IntersectionObserver(([entry]) => {
      const wasVisible = visible
      visible = entry.isIntersecting
      if (visible && !wasVisible) raf = requestAnimationFrame(tick)
    })
    io.observe(canvas)

    return () => {
      cancelAnimationFrame(raf)
      ro.disconnect()
      io.disconnect()
    }
  }, [])

  return <canvas ref={canvasRef} className="hero-particles" aria-hidden="true" />
}
