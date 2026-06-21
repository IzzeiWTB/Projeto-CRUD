import { useState, useEffect } from 'react'
import { carService } from '../services/api'
import { useToast } from '../components/Toast'
import DataTable from '../components/DataTable'
import Modal from '../components/Modal'
import { HiPlus } from 'react-icons/hi'

export default function Cars() {
  const [cars, setCars] = useState([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [editingCar, setEditingCar] = useState(null)

  // Form fields
  const [brand, setBrand] = useState('')
  const [model, setModel] = useState('')
  const [year, setYear] = useState('')
  const [color, setColor] = useState('')
  const [price, setPrice] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const { showToast } = useToast()

  const fetchCars = async () => {
    setLoading(true)
    try {
      const data = await carService.getAll()
      setCars(data)
    } catch (error) {
      showToast('Erro ao carregar carros.', 'error')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCars()
  }, [])

  const handleOpenAddModal = () => {
    setEditingCar(null)
    setBrand('')
    setModel('')
    setYear('')
    setColor('')
    setPrice('')
    setModalOpen(true)
  }

  const handleOpenEditModal = (car) => {
    setEditingCar(car)
    setBrand(car.brand)
    setModel(car.model)
    setYear(car.year)
    setColor(car.color)
    setPrice(car.price)
    setModalOpen(true)
  }

  const handleSave = async (e) => {
    e.preventDefault()
    if (!brand || !model || !year || !color || !price) {
      showToast('Preencha todos os campos obrigatórios.', 'error')
      return
    }

    setSubmitting(true)
    try {
      const payload = {
        brand,
        model,
        year: parseInt(year),
        color,
        price: parseFloat(price)
      }

      const id = editingCar?._id || editingCar?.id

      if (editingCar) {
        await carService.update(id, payload)
        showToast('Carro atualizado com sucesso!', 'success')
      } else {
        await carService.create(payload)
        showToast('Carro criado com sucesso!', 'success')
      }
      setModalOpen(false)
      fetchCars()
    } catch (error) {
      const msg = error.response?.data?.message || 'Erro ao salvar carro.'
      showToast(msg, 'error')
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async (car) => {
    const id = car._id || car.id
    if (window.confirm(`Tem certeza que deseja remover o veículo ${car.brand} ${car.model}?`)) {
      try {
        await carService.delete(id)
        showToast('Carro removido com sucesso!', 'success')
        fetchCars()
      } catch (error) {
        showToast('Erro ao remover carro.', 'error')
      }
    }
  }

  const columns = [
    { key: 'brand', label: 'Marca' },
    { key: 'model', label: 'Modelo' },
    { key: 'year', label: 'Ano' },
    { key: 'color', label: 'Cor' },
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
          <h1 className="text-2xl font-bold text-white font-semibold">Carros</h1>
          <p className="text-dark-400 text-sm mt-1">Gerenciamento de veículos de passeio (MongoDB NoSQL)</p>
        </div>
        <button
          onClick={handleOpenAddModal}
          className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-primary-500 hover:bg-primary-600 text-white font-medium shadow-lg shadow-primary-500/20 hover:shadow-primary-500/30 transition-all duration-200"
        >
          <HiPlus className="w-5 h-5" />
          <span>Adicionar Carro</span>
        </button>
      </div>

      <DataTable
        columns={columns}
        data={cars}
        loading={loading}
        onEdit={handleOpenEditModal}
        onDelete={handleDelete}
      />

      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingCar ? 'Editar Carro' : 'Novo Carro'}
      >
        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-dark-300 uppercase tracking-wider mb-2">Marca</label>
            <input
              type="text"
              value={brand}
              onChange={(e) => setBrand(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-dark-950/50 border border-dark-700/50 text-white placeholder-dark-500 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-all duration-200"
              placeholder="Ex: Toyota"
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
              placeholder="Ex: Corolla"
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
                placeholder="Ex: 2024"
                min="1900"
                max="2030"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-dark-300 uppercase tracking-wider mb-2">Cor</label>
              <input
                type="text"
                value={color}
                onChange={(e) => setColor(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-dark-950/50 border border-dark-700/50 text-white placeholder-dark-500 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-all duration-200"
                placeholder="Ex: Preto"
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
              placeholder="Ex: 145000"
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
