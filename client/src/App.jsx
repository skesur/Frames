import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Layout        from '@/components/layout/Layout'
import Home          from '@/pages/Home'
import Shop          from '@/pages/Shop'
import ProductDetail from '@/pages/ProductDetail'
import Cart          from '@/pages/Cart'
import Checkout      from '@/pages/Checkout'
import Login         from '@/pages/Login'
import Profile       from '@/pages/Profile'
import About         from '@/pages/About'
import Contact       from '@/pages/Contact'
import Terms         from '@/pages/Terms'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/"            element={<Home />}          />
          <Route path="/shop"        element={<Shop />}          />
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route path="/cart"        element={<Cart />}          />
          <Route path="/checkout"    element={<Checkout />}      />
          <Route path="/profile"     element={<Profile />}       />
          <Route path="/about"       element={<About />}         />
          <Route path="/contact"     element={<Contact />}       />
          <Route path="/terms"       element={<Terms />}         />
        </Route>
        <Route path="/login" element={<Login />} />
      </Routes>
    </BrowserRouter>
  )
}