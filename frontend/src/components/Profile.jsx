import { useEffect, useState } from 'react'
import axios from 'axios'
import Navbar from './Navbar'

const BACKEND_URL = 'https://echo-mini-social-media-app.onrender.com'
const getMediaUrl = (value) => {
  if (!value) return ''
  return value.startsWith('http') ? value : `${BACKEND_URL}${value}`
}

export default function Profile() {
  const [user, setUser] = useState({
    username: '',
    email: '',
    profilePicture: '',
  })
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    const savedUser = localStorage.getItem('echoUser')

    if (savedUser) {
      const parsedUser = JSON.parse(savedUser)
      setUser({
        username: parsedUser.username || '',
        email: parsedUser.email || '',
        profilePicture: parsedUser.profilePicture || '',
      })
    }
  }, [])

  const handleProfilePicUpload = async (event) => {
    const file = event.target.files?.[0]
    if (!file) return

    const token = localStorage.getItem('echoToken')
    if (!token) {
      setError('Please log in again.')
      return
    }

    const formData = new FormData()
    formData.append('profilePicture', file)

    try {
      setUploading(true)
      setError('')

      const { data } = await axios.patch('/api/users/me/profile', formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      })

      const updatedUser = {
        ...JSON.parse(localStorage.getItem('echoUser') || '{}'),
        profilePicture: data.profilePicture || '',
      }

      localStorage.setItem('echoUser', JSON.stringify(updatedUser))
      setUser((prev) => ({ ...prev, profilePicture: data.profilePicture || prev.profilePicture }))
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to upload profile picture.')
    } finally {
      setUploading(false)
      event.target.value = ''
    }
  }

  return (
    <div className="mx-auto min-h-screen max-w-[1100px] rounded-[18px] border border-indigo-500/80 bg-[#f2f2f2] shadow-[0_0_0_2px_rgba(67,56,202,0.5)]">
      <Navbar />

      <main className="mx-auto max-w-[700px] px-4 py-8">
        <div className="rounded-[16px] border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex flex-col items-center justify-center">
          <div className="mb-4 flex h-24 w-24 items-center justify-center overflow-hidden rounded-full border border-slate-300 bg-slate-100 text-xl font-semibold text-slate-700">
            {user.profilePicture ? (
              <img
                src={getMediaUrl(user.profilePicture)}
                alt="Profile"
                className="h-full w-full object-cover"
              />
            ) : (
              <span>{user.username ? user.username.slice(0, 2).toUpperCase() : 'UP'}</span>
            )}
          </div>

          <label className="cursor-pointer rounded-md border border-slate-300 bg-[#f8fafc] px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100">
            {uploading ? 'Uploading...' : 'Add profile pic'}
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleProfilePicUpload}
              disabled={uploading}
            />
          </label>

          {error && <p className="mt-3 text-sm text-red-600">{error}</p>}
        </div>

          <div className="mx-auto mt-8 w-full max-w-[500px] space-y-4">
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">Username</label>
              <input
                type="text"
                value={user.username}
                readOnly
                className="w-full rounded-md border border-slate-300 bg-slate-50 px-3 py-3 text-sm text-slate-700 outline-none"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">Email</label>
              <input
                type="email"
                value={user.email}
                readOnly
                className="w-full rounded-md border border-slate-300 bg-slate-50 px-3 py-3 text-sm text-slate-700 outline-none"
              />
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
