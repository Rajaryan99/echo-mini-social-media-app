import { useState } from 'react'
import axios from 'axios'
import { Link, useNavigate } from 'react-router-dom'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const { data } = await axios.post('/api/users/login', { email, password })

      localStorage.setItem('echoToken', data.token)
      localStorage.setItem('echoUser', JSON.stringify(data.user))
      navigate('/profile')
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="mx-auto flex w-full max-w-[1500px] flex-col gap-6 lg:flex-row">
      <section className="flex w-full flex-1 flex-col rounded-[18px] border border-slate-300/70 bg-[#f3f3f2] p-4 shadow-[0_0_0_1px_rgba(255,255,255,0.02)] lg:min-h-[760px]">
        <div className="mb-4 flex items-center justify-between px-2 pt-1 text-sm font-medium text-slate-700">
          <div className="flex items-center gap-2">
            <span className="inline-flex h-4 w-4 items-center justify-center rounded-sm border border-slate-600 text-[10px] text-slate-700">
              ◫
            </span>
            <span className="font-semibold">Log In Page</span>
          </div>
        </div>

        <div className="flex min-h-[680px] flex-1 items-center justify-center rounded-[16px] border border-slate-200 bg-[#f4f4f3] px-4 py-6 md:px-10">
          <div className="w-full max-w-[520px] rounded-[14px] bg-[#f5f5f4] p-6 shadow-[inset_0_0_0_1px_rgba(15,23,42,0.04)]">
            <div className="mb-6 flex items-center justify-between">
              <div className="text-[19px] font-semibold text-slate-900">Echo</div>
              <div className="flex items-center gap-3 text-sm text-slate-600">
                <span>New to Echo?</span>
                <Link to="/signup" className="font-medium text-slate-800 underline decoration-slate-400 underline-offset-4">
                  Sign up
                </Link>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="rounded-[12px] border border-slate-200 bg-[#f2f2f1] p-6">
              <h1 className="text-center text-[28px] font-semibold text-slate-900">
                Sign in to Echo
              </h1>
              <p className="mt-3 text-center text-sm text-slate-500">
                Enter your email and password to access your account
              </p>

              <div className="mt-8 space-y-5">
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Email address
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@example.com"
                    className="w-full rounded-md border border-slate-300 bg-white px-3 py-3 text-sm text-slate-700 outline-none placeholder:text-slate-400 focus:border-blue-500"
                    required
                  />
                </div>

                <div>
                  <div className="mb-2 flex items-center justify-between">
                    <label className="text-sm font-medium text-slate-700">Password</label>
                    <button type="button" className="text-sm text-slate-500 hover:text-slate-700">
                      Forgot password?
                    </button>
                  </div>
                  <div className="relative">
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full rounded-md border border-slate-300 bg-white px-3 py-3 pr-10 text-sm text-slate-700 outline-none placeholder:text-slate-400 focus:border-blue-500"
                      required
                    />
                    <span className="absolute inset-y-0 right-3 flex items-center text-slate-500">
                      ◌
                    </span>
                  </div>
                </div>

                {error && <p className="text-sm text-red-600">{error}</p>}

                <button
                  type="submit"
                  disabled={loading}
                  className="mt-2 w-full rounded-md bg-[#1d73d6] px-4 py-3 text-base font-semibold text-white shadow-sm transition hover:bg-[#1867c2] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {loading ? 'Signing in...' : 'Sign In'}
                </button>

                <div className="pt-2 text-center text-sm text-slate-500">
                  Don&apos;t have an account?{' '}
                  <Link to="/signup" className="font-medium text-blue-600 hover:text-blue-700">
                    Sign up
                  </Link>
                </div>

                <div className="pt-1 text-center text-xs text-slate-400">
                  End-to-end encrypted micro-course
                </div>
              </div>
            </form>
          </div>
        </div>
      </section>
    </div>
  )
}
