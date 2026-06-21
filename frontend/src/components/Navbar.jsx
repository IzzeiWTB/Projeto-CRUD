import { useState } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import {
  HiHome,
  HiTruck,
  HiCog,
  HiShoppingBag,
  HiUsers,
  HiLogout,
  HiMenu,
  HiX,
  HiChevronLeft
} from 'react-icons/hi'

const navItems = [
  { to: '/', icon: HiHome, label: 'Dashboard' },
  { to: '/cars', icon: HiTruck, label: 'Carros' },
  { to: '/motorcycles', icon: HiCog, label: 'Motos' },
  { to: '/clothing-brands', icon: HiShoppingBag, label: 'Marcas de Roupa' }
]

const adminItems = [
  { to: '/users', icon: HiUsers, label: 'Usuários' }
]

export default function Navbar() {
  const { user, logout, isAdmin } = useAuth()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [collapsed, setCollapsed] = useState(false)
  const location = useLocation()

  const allItems = isAdmin ? [...navItems, ...adminItems] : navItems

  const sidebarContent = (
    <div className="flex flex-col h-full">
      {/* Logo / Title */}
      <div className="flex items-center justify-between px-5 py-6 border-b border-dark-700/50">
        <div className={`flex items-center gap-3 ${collapsed ? 'justify-center w-full' : ''}`}>
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center shadow-lg shadow-primary-500/25 flex-shrink-0">
            <span className="text-white font-bold text-sm">SG</span>
          </div>
          {!collapsed && (
            <div className="overflow-hidden">
              <h1 className="text-sm font-bold text-white whitespace-nowrap">Sistema de Gestão</h1>
              <p className="text-[10px] text-dark-400 whitespace-nowrap">Full Stack App</p>
            </div>
          )}
        </div>
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="hidden lg:flex items-center justify-center w-7 h-7 rounded-lg text-dark-400 hover:text-white hover:bg-dark-700/50 transition-all"
        >
          <HiChevronLeft className={`w-4 h-4 transition-transform duration-300 ${collapsed ? 'rotate-180' : ''}`} />
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        <p className={`text-[10px] font-semibold text-dark-500 uppercase tracking-wider mb-3 ${collapsed ? 'text-center' : 'px-3'}`}>
          {collapsed ? '•••' : 'Menu'}
        </p>
        {allItems.map((item) => {
          const Icon = item.icon
          const isActive = item.to === '/' ? location.pathname === '/' : location.pathname.startsWith(item.to)
          return (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={() => setMobileOpen(false)}
              className={`group flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                isActive
                  ? 'bg-primary-500/15 text-primary-400 shadow-lg shadow-primary-500/5'
                  : 'text-dark-400 hover:text-white hover:bg-dark-700/40'
              } ${collapsed ? 'justify-center' : ''}`}
              title={collapsed ? item.label : ''}
            >
              <Icon className={`w-5 h-5 flex-shrink-0 transition-transform duration-200 group-hover:scale-110 ${
                isActive ? 'text-primary-400' : ''
              }`} />
              {!collapsed && <span>{item.label}</span>}
              {isActive && !collapsed && (
                <div className="ml-auto w-1.5 h-1.5 rounded-full bg-primary-400 shadow-lg shadow-primary-400/50" />
              )}
            </NavLink>
          )
        })}
      </nav>

      {/* User info / Logout */}
      <div className="p-3 border-t border-dark-700/50">
        <div className={`flex items-center gap-3 px-3 py-3 rounded-xl bg-dark-800/60 ${collapsed ? 'justify-center' : ''}`}>
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center flex-shrink-0">
            <span className="text-white text-xs font-bold">
              {user?.name?.charAt(0)?.toUpperCase() || user?.email?.charAt(0)?.toUpperCase() || 'U'}
            </span>
          </div>
          {!collapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-white truncate">{user?.name || 'Usuário'}</p>
              <p className="text-[10px] text-dark-400 truncate">{user?.email || ''}</p>
            </div>
          )}
          <button
            onClick={logout}
            title="Sair"
            className="w-8 h-8 rounded-lg flex items-center justify-center text-dark-400 hover:text-red-400 hover:bg-red-500/10 transition-all flex-shrink-0"
          >
            <HiLogout className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  )

  return (
    <>
      {/* Mobile header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 h-14 bg-dark-900/95 backdrop-blur-xl border-b border-dark-700/50 flex items-center justify-between px-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center">
            <span className="text-white font-bold text-xs">SG</span>
          </div>
          <h1 className="text-sm font-bold text-white">Sistema de Gestão</h1>
        </div>
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="w-9 h-9 rounded-lg flex items-center justify-center text-dark-300 hover:text-white hover:bg-dark-700/50 transition-all"
        >
          {mobileOpen ? <HiX className="w-5 h-5" /> : <HiMenu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="lg:hidden fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Mobile sidebar */}
      <div className={`lg:hidden fixed top-0 left-0 z-50 h-full w-72 bg-dark-900/95 backdrop-blur-xl border-r border-dark-700/50 transform transition-transform duration-300 ease-out ${
        mobileOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        {sidebarContent}
      </div>

      {/* Desktop sidebar */}
      <aside className={`hidden lg:flex flex-col fixed top-0 left-0 h-screen bg-dark-900/95 backdrop-blur-xl border-r border-dark-700/50 z-40 transition-all duration-300 ${
        collapsed ? 'w-[72px]' : 'w-64'
      }`}>
        {sidebarContent}
      </aside>
    </>
  )
}
