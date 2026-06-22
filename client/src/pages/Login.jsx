import { useState }       from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Eye, EyeOff }    from 'lucide-react'
import api, { getApiErrorMessage } from '@/lib/axios'
import { useAuthStore }   from '@/store/authStore'
import { useCartStore }   from '@/store/cartStore'
import { cn }             from '@/lib/utils'

/* ── Field label helper ── */
function Label({ children, required }) {
  return (
    <label className="block font-dm text-xs text-ghost/60 mb-2">
      {children}
      {required && <span className="text-ember ml-1">*</span>}
    </label>
  )
}

/* ── Password input with show/hide toggle ── */
function PasswordInput({ value, onChange, placeholder, name }) {
  const [show, setShow] = useState(false)
  return (
    <div className="relative">
      <input
        type={show ? 'text' : 'password'}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="field pr-10"
      />
      <button
        type="button"
        onClick={() => setShow((p) => !p)}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-ghost-muted hover:text-ghost transition-colors"
      >
        {show ? <EyeOff size={15} /> : <Eye size={15} />}
      </button>
    </div>
  )
}

export default function Login() {
  const navigate  = useNavigate()
  const setAuth   = useAuthStore((s) => s.setAuth)
  const loadCartFromServer = useCartStore((s) => s.loadCartFromServer)

  const [mode,    setMode]    = useState('login')  // 'login' | 'signup'
  const [loading, setLoading] = useState(false)
  const [error,   setError]   = useState('')

  const [login_f, setLogin_f] = useState({ email: '', password: '' })
  const [signup_f, setSignup_f] = useState({
    name: '', email: '', password: '', confirmPassword: '',
    phone: '', address: '', pincode: '', country: '',
  })

  const setL = (k, v) => setLogin_f((p)  => ({ ...p, [k]: v }))
  const setS = (k, v) => setSignup_f((p) => ({ ...p, [k]: v }))

  async function handleLogin(e) {
    e.preventDefault()
    setError('')
    try {
      setLoading(true)
      const res = await api.post('/auth/login', {
        email:    login_f.email,
        password: login_f.password,
      })
      setAuth(res.data.user, res.data.token)
      await loadCartFromServer()
      navigate('/profile')
    } catch (err) {
      setError(getApiErrorMessage(err))
    } finally {
      setLoading(false)
    }
  }

  async function handleSignup(e) {
    e.preventDefault()
    setError('')

    if (signup_f.password !== signup_f.confirmPassword) {
      return setError('Passwords do not match.')
    }
    if (signup_f.password.length < 8) {
      return setError('Password must be at least 8 characters.')
    }

    try {
      setLoading(true)
      const res = await api.post('/auth/register', {
        name:    signup_f.name,
        email:   signup_f.email,
        password: signup_f.password,
        phone:   signup_f.phone,
        address: signup_f.address,
        pincode: signup_f.pincode,
        country: signup_f.country,
      })
      setAuth(res.data.user, res.data.token)
      await loadCartFromServer()
      navigate('/')
    } catch (err) {
      setError(getApiErrorMessage(err))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-void flex items-center justify-center px-4 py-12 relative overflow-hidden">

      {/* Background glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse at 50% 30%, rgba(155,92,246,0.1) 0%, transparent 60%)',
        }}
      />

      <div className="w-full max-w-md relative z-10">

        {/* Logo */}
        <div className="text-center mb-8">
          <Link to="/">
            <img
              src="./assets/image/favicon.svg"
              alt="Frames"
              className="h-10 w-auto mx-auto mb-3"
            />
          </Link>
        </div>

        {/* Mode toggle tabs */}
        <div className="flex rounded-xl overflow-hidden border border-white/[0.07] mb-6">
          {['login', 'signup'].map((m) => (
            <button
              key={m}
              onClick={() => { setMode(m); setError('') }}
              className={cn(
                'flex-1 py-3 font-dm text-sm font-medium transition-all duration-200',
                mode === m
                  ? 'bg-violet text-void'
                  : 'bg-white/[0.02] text-ghost-muted hover:text-ghost'
              )}
            >
              {m === 'login' ? 'Login' : 'Sign Up'}
            </button>
          ))}
        </div>

        {/* Card */}
        <div className="rounded-2xl border border-white/[0.07] bg-white/[0.02] p-7">

          {/* ── LOGIN FORM ── */}
          {mode === 'login' && (
            <>
              <h2 className="font-syne font-bold text-2xl text-ghost mb-1">
                Welcome Back
              </h2>
              <p className="font-dm text-sm text-ghost-muted mb-7">
                Sign in to your account
              </p>

              <form onSubmit={handleLogin} className="space-y-5">
                <div>
                  <Label required>Email</Label>
                  <input
                    type="email"
                    value={login_f.email}
                    onChange={(e) => setL('email', e.target.value)}
                    placeholder="Enter your email"
                    required
                    className="field"
                  />
                </div>
                <div>
                  <Label required>Password</Label>
                  <PasswordInput
                    name="loginPassword"
                    value={login_f.password}
                    onChange={(e) => setL('password', e.target.value)}
                    placeholder="Enter your password"
                  />
                </div>

                {error && (
                  <p className="font-dm text-sm text-red-400 bg-red-400/10 border border-red-400/20 rounded-lg px-4 py-3">
                    {error}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-ember hover:bg-ember-dark disabled:opacity-50 text-void font-dm font-semibold py-3.5 rounded-xl transition-all duration-200 hover:shadow-[0_0_24px_rgba(255,107,53,0.3)]"
                >
                  {loading ? 'Signing in...' : 'Login'}
                </button>
              </form>

              <p className="font-dm text-sm text-ghost-muted text-center mt-5">
                No account yet?{' '}
                <button
                  onClick={() => { setMode('signup'); setError('') }}
                  className="text-violet hover:text-violet-light transition-colors"
                >
                  Sign Up
                </button>
              </p>
            </>
          )}

          {/* ── SIGNUP FORM ── */}
          {mode === 'signup' && (
            <>
              <h2 className="font-syne font-bold text-2xl text-ghost mb-1">
                Create Account
              </h2>
              <p className="font-dm text-sm text-ghost-muted mb-7">
                Join Frames today
              </p>

              <form onSubmit={handleSignup} className="space-y-5">

                {/* Name */}
                <div>
                  <Label required>Full Name</Label>
                  <input
                    type="text"
                    value={signup_f.name}
                    onChange={(e) => setS('name', e.target.value)}
                    placeholder="Enter your name"
                    required
                    className="field"
                  />
                </div>

                {/* Email */}
                <div>
                  <Label required>Email</Label>
                  <input
                    type="email"
                    value={signup_f.email}
                    onChange={(e) => setS('email', e.target.value)}
                    placeholder="Enter your email"
                    required
                    className="field"
                  />
                </div>

                {/* Password row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Label required>Password</Label>
                    <PasswordInput
                      name="signupPassword"
                      value={signup_f.password}
                      onChange={(e) => setS('password', e.target.value)}
                      placeholder="Min 8 characters"
                    />
                  </div>
                  <div>
                    <Label required>Confirm Password</Label>
                    <PasswordInput
                      name="confirmPassword"
                      value={signup_f.confirmPassword}
                      onChange={(e) => setS('confirmPassword', e.target.value)}
                      placeholder="Repeat password"
                    />
                  </div>
                </div>

                {/* Phone */}
                <div>
                  <Label required>Phone Number</Label>
                  <input
                    type="tel"
                    value={signup_f.phone}
                    onChange={(e) => setS('phone', e.target.value)}
                    placeholder="10-digit number"
                    maxLength={10}
                    required
                    className="field"
                  />
                </div>

                {/* Address */}
                <div>
                  <Label required>Address</Label>
                  <textarea
                    value={signup_f.address}
                    onChange={(e) => setS('address', e.target.value)}
                    placeholder="Enter your address"
                    rows={2}
                    required
                    className="field resize-none"
                  />
                </div>

                {/* Pincode + Country */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Label required>Pincode</Label>
                    <input
                      type="text"
                      value={signup_f.pincode}
                      onChange={(e) => setS('pincode', e.target.value)}
                      placeholder="6-digit pincode"
                      maxLength={6}
                      required
                      className="field"
                    />
                  </div>
                  <div>
                    <Label required>Country</Label>
                    <input
                      type="text"
                      value={signup_f.country}
                      onChange={(e) => setS('country', e.target.value)}
                      placeholder="Your country"
                      required
                      className="field"
                    />
                  </div>
                </div>

                {error && (
                  <p className="font-dm text-sm text-red-400 bg-red-400/10 border border-red-400/20 rounded-lg px-4 py-3">
                    {error}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-ember hover:bg-ember-dark disabled:opacity-50 text-void font-dm font-semibold py-3.5 rounded-xl transition-all duration-200 hover:shadow-[0_0_24px_rgba(255,107,53,0.3)]"
                >
                  {loading ? 'Creating account...' : 'Sign Up'}
                </button>
              </form>

              <p className="font-dm text-sm text-ghost-muted text-center mt-5">
                Already have an account?{' '}
                <button
                  onClick={() => { setMode('login'); setError('') }}
                  className="text-violet hover:text-violet-light transition-colors"
                >
                  Login
                </button>
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
