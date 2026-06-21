import { useState, useEffect } from 'react'
import { motorcycleService } from '../services/api'
import { useToast } from '../components/Toast'
import DataTable from '../components/DataTable'
import Modal from '../components/Modal'
import { HiPlus } from 'react-icons/hi'

export default function Motorcycles() {
  const [motorcycles, setMotorcycles] = useState([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [editingMotorcycle, setEditingMotorcycle] = useState(null)

  // Form fields
  const [brand, setBrand] = useState('')
  const [model, setModel] = useState('')
  const [year, setYear] = useState('')
  const [engineCapacity, setEngineCapacity] = useState('')
  const [price, setPrice] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const { showToast } = useToast()

  const fetchMotorcycles = async () => {
    setLoading(true)
    try {
      const data = await motorcycleService.getAll()
      setMotorcycles(data)
    } catch (error) {
      showToast('Erro ao carregar motos.', 'error')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchMotorcycles()
  }, [])

  const handleOpenAddModal = () => {
    setEditingMotorcycle(null)
    setBrand('')
    setModel('')
    setYear('')
    setEngineCapacity('')
    setPrice('')
    setModalOpen(true)
  }

  const handleOpenEditModal = (motorcycle) => {
    setEditingMotorcycle(motorcycle)
    setBrand(motorcycle.brand)
    setModel(motorcycle.model)
    setYear(motorcycle.year)
    setEngineCapacity(motorcycle.engineCapacity)
    setPrice(motorcycle.price)
    setModalOpen(true)
  }

  const handleSave = async (e) => {
    e.preventDefault()
    if (!brand || !model || !year || !engineCapacity || !price) {
      showToast('Preencha todos os campos obrigatórios.', 'error')
      return
    }

    setSubmitting(true)
    try {
      const payload = {
        brand,
        model,
        year: parseInt(year),
        engineCapacity: parseInt(engineCapacity),
        price: parseFloat(price)
      }

      const id = editingMotorcycle?._id || editingMotorcycle?.id

      if (editingMotorcycle) {
        await motorcycleService.update(id, payload)
        showToast('Moto atualizada com sucesso!', 'success')
      } else {
        await motorcycleService.create(payload)
        showToast('Moto criada com sucesso!', 'success')
      }
      setModalOpen(false)
      fetchMotorcycles()
    } catch (error) {
      const msg = error.response?.data?.message || 'Erro ao salvar moto.'
      showToast(msg, 'error')
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async (motorcycle) => {
    const id = motorcycle._id || motorcycle.id
    if (window.confirm(`Tem certeza que deseja remover a motocicleta ${motorcycle.brand} ${motorcycle.model}?`)) {
      try {
        await motorcycleService.delete(id)
        showToast('Moto removida com sucesso!', 'success')
        fetchMotorcycles()
      } catch (error) {
        showToast('Erro ao remover moto.', 'error')
      }
    }
  }

  const columns = [
    { key: 'brand', label: 'Marca' },
    { key: 'model', label: 'Modelo' },
    { key: 'year', label: 'Ano' },
    {
      key: 'engineCapacity',
      label: 'Cilindrada',
      render: (cc) => `${cc}cc`
    },
    {
      key: 'price',
      label: 'Preço',
      render: (price) =>
        new Intl.NumberFormat('pt-BR', {
          style: 'currency',
          currency: 'BRL'
        }).format(price)
    }
  ]

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white font-semibold">Motos</h1>
          <p className="text-dark-400 text-sm mt-1">Gerenciamento de motocicletas (MongoDB NoSQL)</p>
        </div>
        <button
          onClick={handleOpenAddModal}
          className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-primary-500 hover:bg-primary-600 text-white font-medium shadow-lg shadow-primary-500/20 hover:shadow-primary-500/30 transition-all duration-200"
        >
          <HiPlus className="w-5 h-5" />
          <span>Adicionar Moto</span>
        </button>
      </div>

      <DataTable
        columns={columns}
        data={motorcycles}
        loading={loading}
        onEdit={handleOpenEditModal}
        onDelete={handleDelete}
      />

      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingMotorcycle ? 'Editar Moto' : 'Novo Moto'}
      >
        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-dark-300 uppercase tracking-wider mb-2">Marca</label>
            <input
              type="text"
              value={brand}
              onChange={(e) => setBrand(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-dark-950/50 border border-dark-700/50 text-white placeholder-dark-500 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-all duration-200"
              placeholder="Ex: Honda"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-dark-300 uppercase tracking-wider mb-2">Modelo</label>
            <input
              type="text"
              value={model}
              onChange={(e) => setModel(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-dark-950/50 border border-dark-700/50 text-white placeholder-dark-500 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-all duration-200"
              placeholder="Ex: CB 500F"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-dark-300 uppercase tracking-wider mb-2">Ano</label>
              <input
                type="number"
                value={year}
                onChange={(e) => setYear(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-dark-950/50 border border-dark-700/50 text-white placeholder-dark-500 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-all duration-200"
                placeholder="Ex: 2023"
                min="1900"
                max="2030"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-dark-300 uppercase tracking-wider mb-2">Cilindrada (cc)</label>
              <input
                type="number"
                value={engineCapacity}
                onChange={(e) => setEngineCapacity(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-dark-950/50 border border-dark-700/50 text-white placeholder-dark-500 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-all duration-200"
                placeholder="Ex: 500"
                min="50"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-dark-300 uppercase tracking-wider mb-2">Preço (R$)</label>
            <input
              type="number"
              step="0.01"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-dark-950/50 border border-dark-700/50 text-white placeholder-dark-500 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-all duration-200"
              placeholder="Ex: 42000"
              required
            />
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
