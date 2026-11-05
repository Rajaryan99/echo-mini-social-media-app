import { useState } from 'react'
import axios from 'axios'
import { Link, useNavigate } from 'react-router-dom'

export default function Signup() {
  const [form, setForm] = useState({
    username: '',
    email: '',
    password: '',
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      await axios.post('/api/users/register', form)
      navigate('/login')
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed')
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
            <span className="font-semibold">Signup Page</span>
          </div>
        </div>

        <div className="flex min-h-[680px] flex-1 items-center justify-center rounded-[16px] border border-slate-200 bg-[#f4f4f3] px-4 py-6 md:px-10">
          <div className="w-full max-w-[520px] rounded-[14px] bg-[#f5f5f4] p-6 shadow-[inset_0_0_0_1px_rgba(15,23,42,0.04)]">
            <div className="mb-6 flex items-center justify-between">
              <div className="text-[19px] font-semibold text-slate-900">Echo</div>
              <Link to="/login" className="text-sm text-slate-600 hover:text-slate-800">
                Log In
              </Link>
            </div>

            <form onSubmit={handleSubmit} className="rounded-[12px] border border-slate-200 bg-[#f2f2f1] p-6">
              <h1 className="text-center text-[28px] font-semibold text-slate-900">
                Create your account
              </h1>
              <p className="mt-3 text-center text-sm text-slate-500">
                Join Echo and start sharing your thoughts with the world!
              </p>

              <div className="mt-7 space-y-4">
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">Username</label>
                  <input
                    type="text"
                    name="username"
                    value={form.username}
                    onChange={handleChange}
                    placeholder="@username"
                    className="w-full rounded-md border border-slate-300 bg-white px-3 py-3 text-sm text-slate-700 outline-none placeholder:text-slate-400 focus:border-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">Email address</label>
                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="name@example.com"
                    className="w-full rounded-md border border-slate-300 bg-white px-3 py-3 text-sm text-slate-700 outline-none placeholder:text-slate-400 focus:border-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">Password</label>
                  <input
                    type="password"
                    name="password"
                    value={form.password}
                    onChange={handleChange}
                    placeholder="••••••••"
                    className="w-full rounded-md border border-slate-300 bg-white px-3 py-3 text-sm text-slate-700 outline-none placeholder:text-slate-400 focus:border-blue-500"
                    minLength={8}
                    required
                  />
                  <p className="mt-2 text-xs text-slate-400">Minimum 8 characters</p>
                </div>

                {error && <p className="text-sm text-red-600">{error}</p>}

                <div className="pt-1 text-center text-xs text-slate-400">
                  By signing up, you agree to our{' '}
                  <button type="button" className="text-blue-600 hover:text-blue-700">Terms of Service</button>{' '}
                  and{' '}
                  <button type="button" className="text-blue-600 hover:text-blue-700">Privacy Policy</button>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="mt-2 w-full rounded-md bg-[#1d73d6] px-4 py-3 text-base font-semibold text-white shadow-sm transition hover:bg-[#1867c2] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {loading ? 'Creating...' : 'Create account'}
                </button>

                <div className="pt-2 text-center text-sm text-slate-500">
                  Already have an account?{' '}
                  <Link to="/login" className="font-medium text-blue-600 hover:text-blue-700">
                    Log In
                  </Link>
                </div>
              </div>
            </form>

           
          </div>
        </div>
      </section>
    </div>
  )
}
