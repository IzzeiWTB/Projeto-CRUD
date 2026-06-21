import { useState, useEffect } from 'react'
import { userService } from '../services/api'
import { useToast } from '../components/Toast'
import DataTable from '../components/DataTable'
import Modal from '../components/Modal'
import { HiPlus } from 'react-icons/hi'

export default function Users() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [editingUser, setEditingUser] = useState(null)
  
  // Form fields
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState('user')
  const [submitting, setSubmitting] = useState(false)

  const { showToast } = useToast()

  const fetchUsers = async () => {
    setLoading(true)
    try {
      const data = await userService.getAll()
      setUsers(data)
    } catch (error) {
      showToast('Erro ao carregar usuários.', 'error')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchUsers()
  }, [])

  const handleOpenAddModal = () => {
    setEditingUser(null)
    setName('')
    setEmail('')
    setPassword('')
    setRole('user')
    setModalOpen(true)
  }

  const handleOpenEditModal = (user) => {
    setEditingUser(user)
    setName(user.name)
    setEmail(user.email)
    setPassword('') // Don't prefill password
    setRole(user.role)
    setModalOpen(true)
  }

  const handleSave = async (e) => {
    e.preventDefault()
    if (!name || !email || (!editingUser && !password)) {
      showToast('Preencha os campos obrigatórios.', 'error')
      return
    }

    setSubmitting(true)
    try {
      const payload = { name, email, role }
      if (password) payload.password = password

      if (editingUser) {
        await userService.update(editingUser.id, payload)
        showToast('Usuário atualizado com sucesso!', 'success')
      } else {
        await userService.create(payload)
        showToast('Usuário criado com sucesso!', 'success')
      }
      setModalOpen(false)
      fetchUsers()
    } catch (error) {
      const msg = error.response?.data?.message || 'Erro ao salvar usuário.'
      showToast(msg, 'error')
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async (user) => {
    if (window.confirm(`Tem certeza que deseja remover o usuário ${user.name}?`)) {
      try {
        await userService.delete(user.id)
        showToast('Usuário removido com sucesso!', 'success')
        fetchUsers()
      } catch (error) {
        showToast('Erro ao remover usuário.', 'error')
      }
    }
  }

  const columns = [
    { key: 'name', label: 'Nome' },
    { key: 'email', label: 'E-mail' },
    {
      key: 'role',
      label: 'Nível de Acesso',
      render: (role) => (
        <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${
          role === 'admin' ? 'bg-violet-500/10 text-violet-400 border border-violet-500/20' : 'bg-dark-700 text-dark-300'
        }`}>
          {role === 'admin' ? 'Administrador' : 'Usuário'}
        </span>
      )
    },
    {
      key: 'createdAt',
      label: 'Criado em',
      render: (date) => new Date(date).toLocaleDateString('pt-BR')
    }
  ]

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white font-semibold">Usuários</h1>
          <p className="text-dark-400 text-sm mt-1">Gerenciamento de contas e permissões (PostgreSQL)</p>
        </div>
        <button
          onClick={handleOpenAddModal}
          className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-primary-500 hover:bg-primary-600 text-white font-medium shadow-lg shadow-primary-500/20 hover:shadow-primary-500/30 transition-all duration-200"
        >
          <HiPlus className="w-5 h-5" />
          <span>Adicionar Usuário</span>
        </button>
      </div>

      <DataTable
        columns={columns}
        data={users}
        loading={loading}
        onEdit={handleOpenEditModal}
        onDelete={handleDelete}
      />

      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingUser ? 'Editar Usuário' : 'Novo Usuário'}
      >
        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-dark-300 uppercase tracking-wider mb-2">Nome</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-dark-950/50 border border-dark-700/50 text-white placeholder-dark-500 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-all duration-200"
              placeholder="Ex: João Silva"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-dark-300 uppercase tracking-wider mb-2">E-mail</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-dark-950/50 border border-dark-700/50 text-white placeholder-dark-500 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-all duration-200"
              placeholder="Ex: joao@exemplo.com"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-dark-300 uppercase tracking-wider mb-2">
              Senha {editingUser && <span className="text-dark-500 text-[10px] lowercase">(deixe em branco para manter a atual)</span>}
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-dark-950/50 border border-dark-700/50 text-white placeholder-dark-500 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-all duration-200"
              placeholder={editingUser ? '••••••' : 'Senha com min. 6 caracteres'}
              required={!editingUser}
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-dark-300 uppercase tracking-wider mb-2">Nível de Acesso</label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-dark-950/50 border border-dark-700/50 text-white placeholder-dark-500 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-all duration-200"
            >
              <option value="user">Usuário Comum</option>
              <option value="admin">Administrador</option>
            </select>
          </div>

          <div className="flex gap-3 justify-end pt-4 border-t border-dark-700/50">
            <button
              type="button"
              onClick={() => setModalOpen(false)}
              className="px-4 py-2.5 rounded-xl border border-dark-700 text-dark-300 font-medium hover:bg-dark-800 transition-all duration-200"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-4 py-2.5 rounded-xl bg-primary-500 hover:bg-primary-600 text-white font-medium shadow-lg shadow-primary-500/20 hover:shadow-primary-500/30 transition-all duration-200 disabled:opacity-50"
            >
              {submitting ? 'Salvando...' : 'Salvar'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
