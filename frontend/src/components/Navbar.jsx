import { NavLink, useNavigate } from 'react-router-dom'

export default function Navbar() {
  const navigate = useNavigate()
  const isLoggedIn = Boolean(localStorage.getItem('echoToken'))

  const navItems = isLoggedIn
    ? [
        { label: 'Feed', path: '/feed' },
        { label: 'My Posts', path: '/myposts' },
        { label: 'Profile', path: '/profile' },
      ]
    : [
        { label: 'Feed', path: '/feed' },
        { label: 'Signup', path: '/signup' },
      ]

  const handleLogout = () => {
    localStorage.removeItem('echoToken')
    localStorage.removeItem('echoUser')
    navigate('/login')
  }

  return (
    <header className="flex items-center justify-between border-b border-slate-300 bg-[#f3f3f2] px-6 py-3 text-sm text-slate-700">
      <div className="text-[18px] font-semibold text-slate-900">Echo</div>

      <nav className="flex items-center gap-6 text-sm">
        {navItems.map((item) => (
          <NavLink
            key={item.label}
            to={item.path}
            className={({ isActive }) =>
              `transition ${isActive ? 'font-bold text-slate-900' : 'text-slate-600 hover:text-slate-800'}`
            }
          >
            {item.label}
          </NavLink>
        ))}

        {isLoggedIn && (
          <button
            type="button"
            onClick={handleLogout}
            className="text-slate-600 transition hover:text-slate-800"
          >
            Logout
          </button>
        )}
      </nav>
    </header>
  )
}
