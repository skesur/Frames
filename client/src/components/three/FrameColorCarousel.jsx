import { Suspense, useRef, useState } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Environment, Float, Html, useGLTF } from '@react-three/drei'
import gsap from 'gsap'
import { ChevronLeft, ChevronRight } from 'lucide-react'

const MODEL_SCALE = 1.75
const MODEL_SHRINK_SCALE = 1.28
const MODEL_ROTATION_X = 1.4
const MODEL_POSITION = [0, 0, 0]

const COLORS = [
  {
    id: 'black',
    label: 'Premium Clubmaster Black',
    model: '/assets/models/clubmaster-black.glb',
    swatch: '#111111',
  },
  {
    id: 'brown',
    label: 'Premium Clubmaster Brown',
    model: '/assets/models/clubmaster-brown.glb',
    swatch: '#6b442f',
  },
  {
    id: 'white',
    label: 'Premium Clubmaster White',
    model: '/assets/models/clubmaster-white.glb',
    swatch: '#f2f2ea',
  },
  {
    id: 'green',
    label: 'Premium Clubmaster Green',
    model: '/assets/models/clubmaster-green.glb',
    swatch: '#315c45',
  },
  {
    id: 'pink',
    label: 'Premium Clubmaster Pink',
    model: '/assets/models/clubmaster-pink.glb',
    swatch: '#e7a1b5',
  },
]

function FrameModel({ modelPath, groupRef }) {
  const { scene } = useGLTF(modelPath)

  return (
    <group
      ref={groupRef}
      scale={MODEL_SCALE}
      position={MODEL_POSITION}
      rotation={[0, 0, 0]}
    >
      <group rotation={[MODEL_ROTATION_X, 0, 0]}>
        <primitive object={scene} />
      </group>
    </group>
  )
}

function Scene({ activeIndex, modelRef, isAnimating }) {
  useFrame(({ mouse }) => {
    const model = modelRef.current
    if (!model || isAnimating) return

    const targetY = mouse.x * 0.18
    const targetX = -mouse.y * 0.08
    model.rotation.y += (targetY - model.rotation.y) * 0.08
    model.rotation.x += (targetX - model.rotation.x) * 0.08
  })

  return (
    <>
      <ambientLight intensity={1.5} />
      <directionalLight position={[3, 4, 5]} intensity={2.2} />
      <directionalLight position={[-4, 2, -3]} intensity={0.9} />

      <Float speed={1.3} rotationIntensity={0.12} floatIntensity={0.16}>
        <FrameModel
          modelPath={COLORS[activeIndex].model}
          groupRef={modelRef}
        />
      </Float>

      <Environment preset="studio" />
    </>
  )
}

export default function FrameColorCarousel() {
  const [activeIndex, setActiveIndex] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)
  const modelRef = useRef(null)

  const active = COLORS[activeIndex]

  function resetModelPose(model) {
    model.position.set(...MODEL_POSITION)
    model.rotation.set(0, 0, 0)
    model.scale.set(MODEL_SCALE, MODEL_SCALE, MODEL_SCALE)
  }

  function go(direction, targetIndex) {
    const model = modelRef.current
    if (isAnimating || !model) return

    setIsAnimating(true)

    const nextIndex =
      typeof targetIndex === 'number'
        ? targetIndex
        : direction === 1
          ? (activeIndex + 1) % COLORS.length
          : (activeIndex - 1 + COLORS.length) % COLORS.length

    const jumpX = direction * 1.2

    resetModelPose(model)

    gsap.timeline({
      defaults: { ease: 'power2.inOut' },
      onComplete: () => {
        resetModelPose(model)
        setIsAnimating(false)
      },
    })
      .to(model.position, {
        x: jumpX,
        y: 0.45,
        z: -0.25,
        duration: 0.34,
      })
      .to(model.rotation, {
        x: 0,
        y: direction * Math.PI * 1.4,
        z: direction * -0.25,
        duration: 0.34,
      }, '<')
      .to(model.scale, {
        x: MODEL_SHRINK_SCALE,
        y: MODEL_SHRINK_SCALE,
        z: MODEL_SHRINK_SCALE,
        duration: 0.24,
      }, '<')
      .call(() => {
        setActiveIndex(nextIndex)
        model.position.set(-jumpX, 0.45, -0.25)
        model.rotation.set(0, direction * -Math.PI * 1.1, direction * 0.2)
        model.scale.set(MODEL_SHRINK_SCALE, MODEL_SHRINK_SCALE, MODEL_SHRINK_SCALE)
      })
      .to(model.position, {
        x: MODEL_POSITION[0],
        y: MODEL_POSITION[1],
        z: MODEL_POSITION[2],
        duration: 0.42,
        ease: 'back.out(1.8)',
      })
      .to(model.rotation, {
        x: 0,
        y: 0,
        z: 0,
        duration: 0.42,
        ease: 'back.out(1.5)',
      }, '<')
      .to(model.scale, {
        x: MODEL_SCALE,
        y: MODEL_SCALE,
        z: MODEL_SCALE,
        duration: 0.42,
        ease: 'back.out(1.7)',
      }, '<')
  }

  function jumpTo(index) {
    if (index === activeIndex || isAnimating) return
    const direction = index > activeIndex ? 1 : -1
    go(direction, index)
  }

  return (
    <section
      className="relative w-full overflow-hidden bg-[#050505] border-b border-white/[0.05]"
      style={{ height: 'clamp(320px, 42vw, 560px)' }}
    >
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            `radial-gradient(circle at 50% 46%, ${active.swatch}2b 0%, transparent 34%),
             radial-gradient(circle at 50% 68%, rgba(155,92,246,0.12) 0%, transparent 42%)`,
        }}
      />

      <Canvas camera={{ position: [0, 0.35, 5.2], fov: 38 }}>
        <Suspense
          fallback={
            <Html center>
              <span className="font-dm text-sm text-ghost-muted">
                Loading frame...
              </span>
            </Html>
          }
        >
          <Scene activeIndex={activeIndex} modelRef={modelRef} isAnimating={isAnimating} />
        </Suspense>
      </Canvas>

      <button
        type="button"
        onClick={() => go(-1)}
        disabled={isAnimating}
        className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full glass flex items-center justify-center text-ghost/70 hover:text-ghost disabled:opacity-40 transition-colors"
        aria-label="Previous frame color"
      >
        <ChevronLeft size={22} />
      </button>

      <button
        type="button"
        onClick={() => go(1)}
        disabled={isAnimating}
        className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full glass flex items-center justify-center text-ghost/70 hover:text-ghost disabled:opacity-40 transition-colors"
        aria-label="Next frame color"
      >
        <ChevronRight size={22} />
      </button>

      <div className="absolute left-1/2 bottom-7 z-20 -translate-x-1/2 text-center">
        <h1 className="font-syne font-bold text-ghost text-xl md:text-3xl tracking-tight mb-3">
          {active.label}
        </h1>

        <div className="flex items-center justify-center gap-2">
          {COLORS.map((color, index) => (
            <button
              key={color.id}
              type="button"
              onClick={() => jumpTo(index)}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                index === activeIndex ? 'w-6 bg-violet' : 'w-1.5 bg-white/25 hover:bg-white/45'
              }`}
              aria-label={`Show ${color.label}`}
            />
          ))}
        </div>
      </div>
    </section>
  )
}

COLORS.forEach((color) => {
  useGLTF.preload(color.model)
})

