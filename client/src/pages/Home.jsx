import { Canvas, useFrame } from '@react-three/fiber'
import { Environment, Html, useGLTF, OrbitControls } from '@react-three/drei'
import { Suspense, useRef, useState, useEffect, useMemo } from 'react'
import { Link } from 'react-router-dom'
import gsap from 'gsap'
import { useUIStore } from '@/store/uiStore'

// Helper function to map scroll values
const interpolate = (val, start, end, outStart, outEnd) => {
  if (val <= start) return outStart
  if (val >= end) return outEnd
  const pct = (val - start) / (end - start)
  return outStart + pct * (outEnd - outStart)
}

function HomeController3D({ scrollProgress, introAnimationDone, onModelSettled }) {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768)

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768)
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const modelBlack = useGLTF('/assets/models/clubmaster-black.glb')
  const modelWhite = useGLTF('/assets/models/clubmaster-white.glb')
  const modelGreen = useGLTF('/assets/models/clubmaster-green.glb')

  const prepareClone = (scene) => {
    const clone = scene.clone()
    clone.traverse((child) => {
      if (child.isMesh) {
        child.material = child.material.clone()
        child.material.transparent = true
      }
    })
    return clone
  }

  const cloneBlack = useMemo(() => prepareClone(modelBlack.scene), [modelBlack])
  const cloneWhite = useMemo(() => prepareClone(modelWhite.scene), [modelWhite])
  const cloneGreen = useMemo(() => prepareClone(modelGreen.scene), [modelGreen])

  const refBlack = useRef(null)
  const refWhite = useRef(null)
  const refGreen = useRef(null)

  const [introDone, setIntroDone] = useState(false)

  // Step 1: Black model flies in from top-right corner after navbar animation
  useEffect(() => {
    if (!introAnimationDone || !refBlack.current) return

    const model = refBlack.current

    // Start position: top-right corner off-screen
    const startX = isMobile ? 3.0 : 5.5
    const startY = isMobile ? 2.0 : 3.5
    const startZ = -3.0

    // Hero landing position: top-center on mobile, left-center on desktop
    const heroX = isMobile ? 0.0 : -1.1
    const heroY = isMobile ? 0.28 : -0.1
    const heroZ = 0.8
    const heroScale = isMobile ? 0.52 : 1.35

    model.position.set(startX, startY, startZ)
    model.rotation.set(0.6, -Math.PI / 1.5, 0.4)
    model.scale.set(0.01, 0.01, 0.01)

    const tl = gsap.timeline({
      onComplete: () => {
        setIntroDone(true)
        if (onModelSettled) onModelSettled()
      }
    })

    tl.to(model.position, { x: heroX, y: heroY, z: heroZ, duration: 1.8, ease: 'power3.out' })
    tl.to(model.rotation, { x: 0.1, y: Math.PI * 2 + 0.3, z: 0, duration: 1.8, ease: 'power3.out' }, '<')
    tl.to(model.scale, { x: heroScale, y: heroScale, z: heroScale, duration: 1.8, ease: 'power3.out' }, '<')
  }, [introAnimationDone])

  const applyOpacity = (clone, opacity) => {
    clone.traverse((child) => {
      if (child.isMesh) {
        child.material.opacity = Math.max(0, Math.min(1, opacity))
        child.visible = opacity > 0.01
      }
    })
  }

  useFrame(({ clock, mouse, camera }) => {
    const elapsed = clock.getElapsedTime()
    const p = scrollProgress

    const tiltX = -mouse.y * 0.25
    const tiltY = mouse.x * 0.35

    // Layout node positions
    const heroX   = isMobile ? 0.0   : -1.1    // Step 1: Black hero
    const heroY   = isMobile ? 0.28  : -0.1
    const blX     = isMobile ? -0.6  : -1.2    // Step 2+: Black bottom-left
    const blY     = isMobile ? -0.4  : -0.5
    const brX     = isMobile ? 0.6   :  1.2    // Step 3: Green bottom-right
    const brY     = isMobile ? -0.4  : -0.5
    const tcX     = 0.0                         // Step 4: White top-center
    const tcY     = isMobile ? 0.5   :  0.55

    const landingScale = isMobile ? 0.52 : 1.35
    const trilogyScale = isMobile ? 0.22 : 0.55

    const orbitActive = p > 0.76 && p < 0.84

    // Camera reset when orbit disabled
    if (!orbitActive) {
      camera.position.x += (0 - camera.position.x) * 0.06
      camera.position.y += (0 - camera.position.y) * 0.06
      camera.position.z += (5.0 - camera.position.z) * 0.06
    }

    // ── BLACK MODEL ──
    // Step 1 (p=0): large hero on left-center, mouse responsive
    // Step 2 (p 0→0.4): shrinks and slides directly to bottom-left
    // Step 3+ (p 0.4→0.85): settled at bottom-left, gentle float
    // Exit (p 0.85→1.0): flies off to the left
    if (refBlack.current) {
      const model = refBlack.current

      if (introAnimationDone && introDone) {
        let tx = heroX, ty = heroY, tz = 0.8, ts = landingScale
        let rotX = 0.1 + tiltX
        let rotY = Math.PI * 2 + 0.3 + tiltY

        if (p <= 0.45) {
          // Step 2: Shrink and slide directly to bottom-left
          const t = interpolate(p, 0.0, 0.45, 0, 1)
          tx = interpolate(t, 0, 1, heroX, blX)
          ty = interpolate(t, 0, 1, heroY, blY)
          ts = interpolate(t, 0, 1, landingScale, trilogyScale)
          rotX = 0.1 + tiltX * (1 - t * 0.5)
          rotY = Math.PI * 2 + 0.3 + interpolate(t, 0, 1, 0, 0.8) + tiltY * (1 - t * 0.5)
        } else if (p <= 0.85) {
          // Step 3+: Settled at bottom-left with float
          tx = blX
          ty = blY + Math.sin(elapsed * 1.4) * 0.04
          ts = trilogyScale
          rotX = 0.1 + (orbitActive ? tiltX : 0)
          rotY = Math.PI * 3.1 + (orbitActive ? tiltY : 0)
        } else {
          // Exit: fly off left — finishes by p=0.97
          const t = interpolate(p, 0.85, 0.97, 0, 1)
          tx = interpolate(t, 0, 1, blX, -5.5)
          ty = interpolate(t, 0, 1, blY, -2.5)
          ts = interpolate(t, 0, 1, trilogyScale, 0.0)
          rotX = 0.1
          rotY = Math.PI * 3.1
        }

        model.position.x += (tx - model.position.x) * 0.08
        model.position.y += (ty - model.position.y) * 0.08
        model.position.z += (tz - model.position.z) * 0.08
        model.scale.setScalar(ts)
        model.rotation.x += (rotX - model.rotation.x) * 0.08
        model.rotation.y += (rotY - model.rotation.y) * 0.08
      }

      // Always apply opacity — hidden while preloader/navbar animation is active
      applyOpacity(cloneBlack, introAnimationDone ? 1.0 : 0.0)
    }

    // ── GREEN MODEL ──
    // Step 3 (p 0.35→0.6): flies in from top-right corner → bottom-right
    // Step 4 (p 0.6→0.85): settled at bottom-right with float
    // Exit (p 0.85→1.0): flies off right
    if (refGreen.current) {
      const model = refGreen.current

      let gx = brX + 4.0   // off-screen bottom-right
      let gy = brY - 4.0   // off-screen below
      let gz = 0.8
      let gs = trilogyScale
      let go = 0.0
      let gRotY = Math.PI * 2.7

      if (p > 0.4 && p <= 0.6) {
        // Fly in from bottom-right corner up to settled position
        const t = interpolate(p, 0.4, 0.6, 0, 1)
        gx = interpolate(t, 0, 1, brX + 4.0, brX)
        gy = interpolate(t, 0, 1, brY - 4.0, brY)
        go = interpolate(t, 0, 1, 0, 1)
        gRotY = Math.PI * 2.7
      } else if (p > 0.6 && p <= 0.85) {
        // Settled at bottom-right with float
        gx = brX
        gy = brY + Math.sin(elapsed * 1.4 + 2.4) * 0.04
        go = 1.0
        gRotY = Math.PI * 2.7 + (orbitActive ? tiltY : 0)
      } else if (p > 0.85) {
        // Exit: fly off to bottom-right corner — finishes by p=0.97
        const t = interpolate(p, 0.85, 0.97, 0, 1)
        gx = interpolate(t, 0, 1, brX, brX + 4.0)
        gy = interpolate(t, 0, 1, brY, brY - 4.0)
        gs = interpolate(t, 0, 1, trilogyScale, 0.0)
        go = 1.0 - t
        gRotY = Math.PI * 2.7
      }

      model.position.x += (gx - model.position.x) * 0.08
      model.position.y += (gy - model.position.y) * 0.08
      model.position.z += (gz - model.position.z) * 0.08
      model.scale.setScalar(gs)
      model.rotation.x += (0.1 - model.rotation.x) * 0.08
      model.rotation.y += (gRotY - model.rotation.y) * 0.08
      applyOpacity(cloneGreen, go)
    }

    // ── WHITE MODEL ──
    // Step 4 (p 0.55→0.75): drops in from above → top-center
    // Settled (p 0.75→0.85): gentle float at top-center
    // Exit (p 0.85→1.0): flies up out of frame
    if (refWhite.current) {
      const model = refWhite.current

      let wx = tcX
      let wy = tcY + 4.0   // off-screen above
      let wz = 0.8
      let ws = trilogyScale
      let wo = 0.0
      let wRotY = Math.PI * 2.3

      if (p > 0.55 && p <= 0.75) {
        // Drop in from above to top-center
        const t = interpolate(p, 0.55, 0.75, 0, 1)
        wx = tcX
        wy = interpolate(t, 0, 1, tcY + 3.5, tcY)
        wo = interpolate(t, 0, 1, 0, 1)
        wRotY = Math.PI * 2.3
      } else if (p > 0.75 && p <= 0.85) {
        // Settled at top-center with float
        wx = tcX
        wy = tcY + Math.sin(elapsed * 1.4 + 1.2) * 0.04
        wo = 1.0
        wRotY = Math.PI * 2.3 + (orbitActive ? tiltY : 0)
      } else if (p > 0.85) {
        // Exit: fly upward — finishes by p=0.97
        const t = interpolate(p, 0.85, 0.97, 0, 1)
        wx = tcX
        wy = interpolate(t, 0, 1, tcY, tcY + 4.5)
        ws = interpolate(t, 0, 1, trilogyScale, 0.0)
        wo = 1.0 - t
        wRotY = Math.PI * 2.3
      }

      model.position.x += (wx - model.position.x) * 0.08
      model.position.y += (wy - model.position.y) * 0.08
      model.position.z += (wz - model.position.z) * 0.08
      model.scale.setScalar(ws)
      model.rotation.x += (0.1 - model.rotation.x) * 0.08
      model.rotation.y += (wRotY - model.rotation.y) * 0.08
      applyOpacity(cloneWhite, wo)
    }
  })

  return (
    <>
      <group ref={refBlack}>
        <group rotation={[1.4, 0, 0]}>
          <primitive object={cloneBlack} />
        </group>
      </group>

      <group ref={refGreen}>
        <group rotation={[1.4, 0, 0]}>
          <primitive object={cloneGreen} />
        </group>
      </group>

      <group ref={refWhite}>
        <group rotation={[1.4, 0, 0]}>
          <primitive object={cloneWhite} />
        </group>
      </group>
    </>
  )
}

export function HomeContent() {
  const introAnimationDone = useUIStore((s) => s.introAnimationDone)
  const [modelSettled, setModelSettled] = useState(false)
  const [scrollProgress, setScrollProgress] = useState(0)
  const containerRef = useRef(null)
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768)

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768)
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  useEffect(() => {
    if (!modelSettled) return
    gsap.fromTo('.hero-text-item',
      { opacity: 0, x: -30 },
      { opacity: 1, x: 0, duration: 0.5, stagger: 0.25, ease: 'power2.out' }
    )
  }, [modelSettled])

  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return
      // Progress relative to THIS section's height only — not the full page
      const containerH = containerRef.current.offsetHeight - window.innerHeight
      const scrolledIntoSection = window.scrollY
      const progress = Math.max(0, Math.min(1, scrolledIntoSection / containerH))
      setScrollProgress(progress)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Hero text fades out as scroll begins
  const getHeroStyles = () => {
    const opacity = interpolate(scrollProgress, 0.0, 0.2, 1, 0)
    const yOffset = interpolate(scrollProgress, 0.0, 0.2, 0, -40)
    return {
      opacity,
      transform: `translateY(${yOffset}px)`,
      display: opacity <= 0 ? 'none' : 'flex'
    }
  }

  // Step 4: center text appears when all 3 models are settled
  const getCenterTextStyles = () => {
    let opacity = 0
    if (scrollProgress >= 0.75 && scrollProgress <= 0.9) {
      if (scrollProgress < 0.79) {
        opacity = interpolate(scrollProgress, 0.75, 0.79, 0, 1)
      } else {
        opacity = interpolate(scrollProgress, 0.85, 0.9, 1, 0)
      }
    }
    return {
      opacity,
      display: opacity <= 0 ? 'none' : 'block',
      pointerEvents: 'none'
    }
  }

  // Canvas overlay hides once everything has exited — extremely short blank before ColorsSection
  const canvasHidden = scrollProgress > 0.975

  const isOrbitEnabled = scrollProgress > 0.76 && scrollProgress < 0.84

  return (
    <div ref={containerRef} className="relative min-h-[210vh] bg-void">

      {/* Ambient glow — scoped to 3D section, fades out before ColorsSection */}
      <div
        className="fixed inset-0 w-full h-full overflow-hidden pointer-events-none z-[5]"
        style={{
          opacity: scrollProgress > 0.9 ? 0 : 1,
          transition: 'opacity 0.5s ease',
        }}
      >
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[420px] h-[420px] rounded-full bg-violet/6 blur-[130px] pointer-events-none" />
        <div className="absolute bottom-1/4 left-1/3 w-[220px] h-[220px] rounded-full bg-ember/4 blur-[90px] pointer-events-none" />
      </div>

      {/* Fixed fullscreen container — hidden + non-interactive once all models exit */}
      <div
        className="fixed inset-0 w-full h-full overflow-hidden pointer-events-none z-10"
        style={{
          opacity: canvasHidden ? 0 : 1,
          transition: 'opacity 0.4s ease',
          pointerEvents: canvasHidden ? 'none' : undefined,
          visibility: canvasHidden ? 'hidden' : 'visible',
        }}
      >

        {/* 3D Canvas */}
        <div className="absolute inset-0 w-full h-full pointer-events-none">
          <Canvas camera={{ position: [0, 0, 5.0], fov: 38 }} style={{ pointerEvents: (isOrbitEnabled && !isMobile) ? 'auto' : 'none' }}>
            <ambientLight intensity={1.5} />
            <directionalLight position={[3, 4, 5]} intensity={2.2} />
            <directionalLight position={[-4, 2, -3]} intensity={0.9} />

            <OrbitControls
              enabled={isOrbitEnabled && !isMobile}
              enableZoom={false}
              enablePan={false}
              maxPolarAngle={Math.PI / 1.5}
              minPolarAngle={Math.PI / 3}
            />

            <Suspense fallback={
              <Html center>
                <span className="font-dm text-sm text-ghost-muted">Loading...</span>
              </Html>
            }>
              <HomeController3D
                scrollProgress={scrollProgress}
                introAnimationDone={introAnimationDone}
                onModelSettled={() => setModelSettled(true)}
              />
              <Environment preset="studio" />
            </Suspense>
          </Canvas>
        </div>

        {/* Step 1: Hero text — aligned to bottom on mobile, right side on desktop */}
        <div
          style={getHeroStyles()}
          className="absolute inset-0 flex flex-col md:flex-row items-center justify-end md:justify-end pb-20 md:pb-0 px-6 md:px-16 pointer-events-none transition-all duration-100 ease-out z-20"
        >
          <div className="w-full md:w-[45%] flex flex-col justify-center items-center md:items-start text-center md:text-left py-2 md:py-0 px-4 md:px-0 pointer-events-auto mt-12 md:mt-0">
            <span className="hero-text-item opacity-0 font-mono text-[10px] md:text-xs uppercase tracking-[0.25em] text-violet mb-2 md:mb-3">
              // premium cyberpunk eyewear
            </span>

            <h1 className="hero-text-item opacity-0 font-serif text-2xl md:text-[3.85rem] leading-tight md:leading-[1.12] tracking-tight mb-2 md:mb-6 text-[#eae5db]">
              Define <span className="text-gradient font-syne font-extrabold py-0.5 px-1 inline-block">Your</span> <br />
              Vision with <span className="text-gradient font-syne font-extrabold py-0.5 px-1 inline-block">frames</span>
            </h1>

            <p className="hero-text-item opacity-0 font-dm text-ghost-muted text-xs md:text-[1.05rem] mb-4 md:mb-9 max-w-[280px] md:max-w-[480px] leading-relaxed mx-auto md:mx-0">
              Experience eyewear crafted with precision, designed for elegance, and built to transform how you see the world.
            </p>

            <div className="hero-text-item opacity-0 flex flex-wrap gap-3 items-center justify-center md:justify-start pointer-events-auto">
              <Link
                to="/shop"
                className="group relative inline-flex items-center justify-center px-5 py-2.5 md:px-7 md:py-3.5 rounded-full font-dm font-semibold text-xs md:text-sm text-void bg-gradient-to-r from-ember to-violet hover:shadow-[0_0_20px_rgba(255,107,53,0.4)] transition-all duration-300"
              >
                <span className="relative z-10 flex items-center gap-1.5 text-void">
                  Explore Collection <span className="transform group-hover:translate-x-1 transition-transform duration-300">→</span>
                </span>
              </Link>
              <Link
                to="/about"
                className="inline-flex items-center justify-center px-5 py-2.5 md:px-7 md:py-3.5 rounded-full font-dm font-semibold text-xs md:text-sm text-ghost border border-white/20 hover:border-white/40 hover:bg-white/[0.03] transition-all duration-300"
              >
                Our Story
              </Link>
            </div>
          </div>
        </div>

        {/* Step 4: center text when all 3 models are settled on screen */}
        <div
          style={getCenterTextStyles()}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center z-20 px-4"
        >
          <span className="font-mono text-[9px] md:text-xs uppercase tracking-[0.25em] text-ember mb-2 block">
            // Different collections
          </span>
          <h2 className="font-syne font-extrabold text-lg md:text-4xl text-ghost leading-tight mb-2">
            DIFFERENT MOODS DIFFERENT STYLES
          </h2>
          <p className="font-dm text-ghost-muted text-xs md:text-sm leading-relaxed max-w-[240px] md:max-w-[300px] mx-auto">
            Midnight Black · Satin White · Aurora Jade
          </p>
        </div>

      </div>
    </div>
  )
}

// ── COLORS SECTION ─────────────────────────────────────────────────────────────

const COLOR_CONFIGS = [
  { id: 'black', label: 'BLACK', src: 'black', tint: null,                rowBg: '#0d0d0d', leftText: '#e8e8e8', accent: '#aaaaaa' },
  { id: 'white', label: 'WHITE', src: 'white', tint: null,                rowBg: '#eeebe5', leftText: '#1a1a1a', accent: '#777777' },
  { id: 'brown', label: 'BROWN', src: 'white', tint: [0.52, 0.29, 0.14],  rowBg: '#110a05', leftText: '#c8956c', accent: '#c8956c' },
  { id: 'green', label: 'GREEN', src: 'green', tint: null,                rowBg: '#05100a', leftText: '#4ade80', accent: '#4ade80' },
  { id: 'pink',  label: 'PINK',  src: 'white', tint: [0.95, 0.36, 0.65],  rowBg: '#120509', leftText: '#f472b6', accent: '#f472b6' },
]

function ColorSectionModel({ activeColorId }) {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768)

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768)
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const scale = isMobile ? 1.45 : 1.35

  const blackGltf = useGLTF('/assets/models/clubmaster-black.glb')
  const whiteGltf = useGLTF('/assets/models/clubmaster-white.glb')
  const greenGltf = useGLTF('/assets/models/clubmaster-green.glb')

  const clones = useMemo(() => {
    const make = (gltf, tint) => {
      const clone = gltf.scene.clone()
      clone.traverse(child => {
        if (child.isMesh) {
          child.material = child.material.clone()
          child.material.transparent = false
          if (tint) child.material.color.setRGB(...tint)
        }
      })
      return clone
    }
    return {
      black: make(blackGltf, null),
      white: make(whiteGltf, null),
      brown: make(whiteGltf, [0.52, 0.29, 0.14]),
      green: make(greenGltf, null),
      pink:  make(whiteGltf, [0.95, 0.36, 0.65]),
    }
  }, [blackGltf, whiteGltf, greenGltf])

  const groupRef = useRef(null)
  const [displayedId, setDisplayedId] = useState('black')
  const spinRef = useRef({ spinning: false, angle: 0, targetId: 'black', swapped: false })

  useEffect(() => {
    const sp = spinRef.current
    if (activeColorId !== sp.targetId) {
      sp.targetId = activeColorId
      sp.spinning = true
      sp.angle = 0
      sp.swapped = false
    }
  }, [activeColorId])

  useFrame(({ clock, mouse }) => {
    const sp = spinRef.current
    const group = groupRef.current
    if (!group) return
    const elapsed = clock.getElapsedTime()

    if (sp.spinning) {
      sp.angle += 0.14
      // At 180°: model is edge-on — swap the clone silently
      if (sp.angle >= Math.PI && !sp.swapped) {
        sp.swapped = true
        setDisplayedId(sp.targetId)
      }
      // Full 360° spin complete
      if (sp.angle >= Math.PI * 2) {
        sp.spinning = false
        sp.angle = 0
      }
      group.rotation.y = Math.PI * 0.25 + sp.angle
    } else {
      // Idle: mouse tilt + gentle float
      const targetRotY = Math.PI * 0.25 + mouse.x * 0.3
      const targetRotX = 0.08 + (-mouse.y * 0.18)
      group.rotation.y += (targetRotY - group.rotation.y) * 0.06
      group.rotation.x += (targetRotX - group.rotation.x) * 0.06
      group.position.y = Math.sin(elapsed * 1.2) * 0.06
    }
  })

  return (
    <group ref={groupRef} scale={scale-0.5}>
      <group rotation={[1.4, 0, 0]}>
        <primitive object={clones[displayedId]} />
      </group>
    </group>
  )
}

function ColorsSection() {
  const [activeColor, setActiveColor] = useState('black')
  const activeIdx = COLOR_CONFIGS.findIndex(c => c.id === activeColor)
  const activeConfig = COLOR_CONFIGS[activeIdx]

  const [isMobile, setIsMobile] = useState(window.innerWidth < 768)

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768)
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])
  return (
    <section className="relative overflow-hidden bg-[#080808] border-t border-white/5">
      {/* Section header */}
      <div className="px-6 md:px-16 pt-12 pb-6 border-b border-white/5">
        <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-violet block mb-2">
          // colorways
        </span>
        <h2 className="font-syne font-extrabold text-xl md:text-4xl text-ghost">
          CHOOSE YOUR SHADE
        </h2>
      </div>

      <div className="relative flex flex-col w-full py-0">
        {/* Rows container establishing a relative z-0 stacking context */}
        <div className="relative z-0 flex flex-col border-y border-white/[0.08] w-full overflow-hidden bg-[#0d0d0d]/40 backdrop-blur-md">
          
          {/* Floating 3D Canvas Layer (layered at z-10 inside the stacking context) */}
          <div
            className="absolute left-0 w-full md:w-[40%] pointer-events-none z-10"
            style={{
              height: '130px', // matches row height
              transform: `translateY(${activeIdx * 130}px)`,
              transition: 'transform 0.45s cubic-bezier(0.25, 1, 0.5, 1)',
            }}
          >
            <Canvas camera={{ position: [0, 0, isMobile ? 2.3 : 1.8], fov: 40 }} style={{ pointerEvents: 'none' }}>
              <ambientLight intensity={1.8} />
              <directionalLight position={[3, 4, 5]} intensity={2.5} />
              <directionalLight position={[-4, 2, -3]} intensity={1.0} />
              <Suspense fallback={null}>
                <ColorSectionModel activeColorId={activeColor} />
                <Environment preset="studio" />
              </Suspense>
            </Canvas>
          </div>

          {COLOR_CONFIGS.map((color, idx) => {
            const isActive = activeColor === color.id
            return (
              <div
                key={color.id}
                className="h-[130px] flex items-center relative overflow-hidden cursor-pointer"
                style={{
                  borderBottom: idx < 4 ? '1px solid rgba(255,255,255,0.06)' : 'none',
                }}
                onMouseEnter={() => setActiveColor(color.id)}
              >
                {/* Opaque active color row background layer (layered at z-0) */}
                <div
                  className="absolute inset-0 z-0 transition-colors duration-500"
                  style={{
                    backgroundColor: isActive ? color.rowBg : 'transparent'
                  }}
                />

                {/* Accent glow line on the left side (layered at z-20) */}
                <div
                  className="absolute left-0 top-0 bottom-0 w-[4px] z-20"
                  style={{
                    backgroundColor: color.accent,
                    opacity: isActive ? 1 : 0,
                    transition: 'opacity 0.4s ease',
                  }}
                />

                {/* Left side empty spacer for floating 3D model (hidden on mobile for background layout, z-20) */}
                {!isMobile && <div className="w-[40%] h-full flex-shrink-0 relative z-20" />}

                {/* Row Content (foreground overlay layered at z-20 relative) */}
                <div className="flex-1 flex items-center px-6 md:px-12 z-20 relative">
                  {/* Color title */}
                  <span
                    className="font-syne font-extrabold tracking-tight leading-none text-xl md:text-5xl"
                    style={{
                      color: isActive ? color.accent : 'rgba(255,255,255,0.15)',
                      transition: 'color 0.4s ease',
                      textShadow: isActive && isMobile ? '0 2px 10px rgba(0,0,0,0.95), 0 0 2px rgba(0,0,0,0.9)' : 'none'
                    }}
                  >
                    {color.label}
                  </span>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

function CTASection() {
  return (
    <section className="relative overflow-hidden py-32 border-t border-white/5 bg-[#050505] text-center">
      {/* Background ambient glows */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full bg-violet/5 blur-[160px] pointer-events-none" />
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[450px] h-[450px] rounded-full bg-ember/5 blur-[140px] pointer-events-none" />

      <div className="frame-container flex flex-col items-center justify-center relative z-10 max-w-[680px] px-6">
        <span className="font-mono text-[10px] md:text-xs uppercase tracking-[0.3em] text-violet mb-4 block">
          // chrome collective
        </span>
        <h2 className="font-syne font-extrabold text-2xl md:text-6xl leading-tight tracking-tight text-ghost mb-6">
          ELEVATE YOUR VISION
        </h2>
        <p className="font-dm text-ghost-muted text-xs md:text-base leading-relaxed mb-8 md:mb-10 max-w-[300px] md:max-w-[500px]">
          Join the next dimension of luxury eyewear. Experience a silhouette engineered with premium titanium-alloy frames, polarized cyber-optics, and uncompromising futuristic aesthetics.
        </p>

        <Link
          to="/contact"
          className="group relative inline-flex items-center justify-center px-8 py-4 rounded-full font-dm font-semibold text-sm text-void bg-ember overflow-hidden transition-all duration-300 hover:shadow-[0_0_25px_rgba(255,107,53,0.45)]"
        >
          {/* Hover sliding color sweep */}
          <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-ember to-violet opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <span className="relative z-10 flex items-center gap-2">
            Contact Us
            <svg className="w-4 h-4 transform group-hover:translate-x-1 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </span>
        </Link>
      </div>
    </section>
  )
}

export default function Home() {
  return (
    <>
      <HomeContent />
      <ColorsSection />
      <CTASection />
    </>
  )
}

useGLTF.preload('/assets/models/clubmaster-black.glb')
useGLTF.preload('/assets/models/clubmaster-white.glb')
useGLTF.preload('/assets/models/clubmaster-green.glb')