import { Navigate, Route, Routes } from 'react-router-dom'
import Feed from './components/Feed'
import Login from './components/Login'
import MyPost from './components/MyPost'
import Profile from './components/Profile'
import Signup from './components/Signup'

function App() {
  return (
    <div className="min-h-screen bg-[#0b0f14] px-4 py-6 md:px-8">
      <Routes>
        <Route path="/" element={<Navigate to="/feed" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/feed" element={<Feed />} />
        <Route path="/myposts" element={<MyPost />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
    </div>
  )
}

export default App
