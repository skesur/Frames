import { lazy, Suspense } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Layout   from '@/components/layout/Layout'
import Home     from '@/pages/Home'

// Lazy-load non-critical routes for bundle splitting
const Shop     = lazy(() => import('@/pages/Shop'))
const Product  = lazy(() => import('@/pages/Product'))
const Cart     = lazy(() => import('@/pages/Cart'))
const Login    = lazy(() => import('@/pages/Login'))
const Profile  = lazy(() => import('@/pages/Profile'))
const About    = lazy(() => import('@/pages/About'))
const Contact  = lazy(() => import('@/pages/Contact'))
const Terms    = lazy(() => import('@/pages/Terms'))
const Admin    = lazy(() => import('@/pages/admin/Admin'))

export default function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={
        <div className="h-screen w-screen bg-[#080808] flex flex-col items-center justify-center text-ghost/40 font-mono text-[10px] uppercase tracking-[0.3em]">
          <div className="w-12 h-12 rounded-full border border-violet/20 border-t-violet animate-spin mb-4" />
          // loading
        </div>
      }>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/"        element={<Home />}    />
            <Route path="/shop"    element={<Shop />}    />
            <Route path="/product/:identifier" element={<Product />} />
            <Route path="/cart"    element={<Cart />}    />
            <Route path="/profile" element={<Profile />} />
            <Route path="/about"   element={<About />}   />
            <Route path="/contact" element={<Contact />} />
            <Route path="/terms"   element={<Terms />}   />
          </Route>
          <Route path="/login" element={<Login />} />
          <Route path="/admin" element={<Admin />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  )
}
