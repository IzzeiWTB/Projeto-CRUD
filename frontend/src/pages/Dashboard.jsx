import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { carService, motorcycleService, clothingBrandService, userService } from '../services/api'
import { HiTruck, HiCog, HiShoppingBag, HiUsers } from 'react-icons/hi'

export default function Dashboard() {
  const { user, isAdmin } = useAuth()
  const [stats, setStats] = useState({
    cars: 0,
    motorcycles: 0,
    brands: 0,
    users: 0
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchStats() {
      try {
        const [carsData, motorcyclesData, brandsData] = await Promise.all([
          carService.getAll(),
          motorcycleService.getAll(),
          clothingBrandService.getAll()
        ])

        let usersCount = 0
        if (isAdmin) {
          const usersData = await userService.getAll()
          usersCount = usersData.length
        }

        setStats({
          cars: carsData.length,
          motorcycles: motorcyclesData.length,
          brands: brandsData.length,
          users: usersCount
        })
      } catch (error) {
        console.error('Error fetching dashboard stats:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchStats()
  }, [isAdmin])

  const statCards = [
    {
      label: 'Carros Cadastrados',
      value: stats.cars,
      icon: HiTruck,
      gradient: 'from-blue-500 to-indigo-500',
      shadow: 'shadow-blue-500/10'
    },
    {
      label: 'Motos Cadastradas',
      value: stats.motorcycles,
      icon: HiCog,
      gradient: 'from-amber-500 to-orange-500',
      shadow: 'shadow-amber-500/10'
    },
    {
      label: 'Marcas de Roupa',
      value: stats.brands,
      icon: HiShoppingBag,
      gradient: 'from-emerald-500 to-teal-500',
      shadow: 'shadow-emerald-500/10'
    },
    ...(isAdmin ? [{
      label: 'Usuários Cadastrados',
      value: stats.users,
      icon: HiUsers,
      gradient: 'from-violet-500 to-fuchsia-500',
      shadow: 'shadow-violet-500/10'
    }] : [])
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Dashboard</h1>
        <p className="text-dark-400 text-sm mt-1">
          Olá, <span className="text-white font-medium">{user?.name || 'Usuário'}</span>. Bem-vindo ao seu painel.
        </p>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {Array.from({ length: isAdmin ? 4 : 3 }).map((_, i) => (
            <div key={i} className="bg-dark-800/40 border border-dark-700/50 rounded-2xl p-6 h-32 animate-pulse flex flex-col justify-between" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {statCards.map((card, i) => {
            const Icon = card.icon
            return (
              <div
                key={i}
                className={`bg-dark-850/60 backdrop-blur-md border border-dark-700/40 rounded-2xl p-6 flex items-center justify-between shadow-xl ${card.shadow} hover:-translate-y-1 transition-all duration-200 group`}
              >
                <div>
                  <p className="text-xs font-semibold text-dark-400 uppercase tracking-wider">
                    {card.label}
                  </p>
                  <p className="text-3xl font-bold text-white mt-2 group-hover:scale-105 transition-transform duration-200 origin-left">
                    {card.value}
                  </p>
                </div>
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${card.gradient} flex items-center justify-center text-white shadow-lg shadow-black/10`}>
                  <Icon className="w-6 h-6" />
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Info card / shortcut list */}
      <div className="bg-gradient-to-br from-dark-900/80 to-dark-850/80 border border-dark-700/50 rounded-2xl p-6 mt-8">
        <h3 className="text-lg font-bold text-white mb-2">Visão Geral da API</h3>
        <p className="text-dark-400 text-sm leading-relaxed max-w-2xl">
          Esta plataforma gerencia dados integrados em múltiplos ambientes de persistência. A autenticação é provida de forma stateless com tokens JWT.
          Os carros, motos e marcas de roupas residem no banco NoSQL (MongoDB), enquanto os perfis de usuários estão armazenados de forma estruturada e transacional no PostgreSQL.
        </p>
      </div>
    </div>
  )
}
