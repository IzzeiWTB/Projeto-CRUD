import { useState, useEffect } from 'react'
import { clothingBrandService } from '../services/api'
import { useToast } from '../components/Toast'
import DataTable from '../components/DataTable'
import Modal from '../components/Modal'
import { HiPlus, HiExternalLink } from 'react-icons/hi'

export default function ClothingBrands() {
  const [brands, setBrands] = useState([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [editingBrand, setEditingBrand] = useState(null)

  // Form fields
  const [name, setName] = useState('')
  const [country, setCountry] = useState('')
  const [foundedYear, setFoundedYear] = useState('')
  const [segment, setSegment] = useState('Casual')
  const [website, setWebsite] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const { showToast } = useToast()

  const fetchBrands = async () => {
    setLoading(true)
    try {
      const data = await clothingBrandService.getAll()
      setBrands(data)
    } catch (error) {
      showToast('Erro ao carregar marcas de roupa.', 'error')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchBrands()
  }, [])

  const handleOpenAddModal = () => {
    setEditingBrand(null)
    setName('')
    setCountry('')
    setFoundedYear('')
    setSegment('Casual')
    setWebsite('')
    setModalOpen(true)
  }

  const handleOpenEditModal = (brand) => {
    setEditingBrand(brand)
    setName(brand.name)
    setCountry(brand.country)
    setFoundedYear(brand.foundedYear)
    setSegment(brand.segment)
    setWebsite(brand.website || '')
    setModalOpen(true)
  }

  const handleSave = async (e) => {
    e.preventDefault()
    if (!name || !country || !foundedYear || !segment) {
      showToast('Preencha todos os campos obrigatórios.', 'error')
      return
    }

    setSubmitting(true)
    try {
      const payload = {
        name,
        country,
        foundedYear: parseInt(foundedYear),
        segment,
        website: website || undefined
      }

      const id = editingBrand?._id || editingBrand?.id

      if (editingBrand) {
        await clothingBrandService.update(id, payload)
        showToast('Marca de roupa atualizada com sucesso!', 'success')
      } else {
        await clothingBrandService.create(payload)
        showToast('Marca de roupa criada com sucesso!', 'success')
      }
      setModalOpen(false)
      fetchBrands()
    } catch (error) {
      const msg = error.response?.data?.message || 'Erro ao salvar marca de roupa.'
      showToast(msg, 'error')
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async (brand) => {
    const id = brand._id || brand.id
    if (window.confirm(`Tem certeza que deseja remover a marca ${brand.name}?`)) {
      try {
        await clothingBrandService.delete(id)
        showToast('Marca removida com sucesso!', 'success')
        fetchBrands()
      } catch (error) {
        showToast('Erro ao remover marca.', 'error')
      }
    }
  }

  const columns = [
    { key: 'name', label: 'Nome' },
    { key: 'country', label: 'País de Origem' },
    { key: 'foundedYear', label: 'Fundação' },
    {
      key: 'segment',
      label: 'Segmento',
      render: (segment) => (
        <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-primary-500/10 text-primary-400 border border-primary-500/20">
          {segment}
        </span>
      )
    },
    {
      key: 'website',
      label: 'Website',
      render: (url) =>
        url ? (
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-primary-400 hover:text-primary-300 font-medium hover:underline transition-colors"
          >
            <span>Visitar</span>
            <HiExternalLink className="w-3.5 h-3.5" />
          </a>
        ) : (
          <span className="text-dark-500">-</span>
        )
    }
  ]

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white font-semibold">Marcas de Roupa</h1>
          <p className="text-dark-400 text-sm mt-1">Gerenciamento de grifes e confecções (MongoDB NoSQL)</p>
        </div>
        <button
          onClick={handleOpenAddModal}
          className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-primary-500 hover:bg-primary-600 text-white font-medium shadow-lg shadow-primary-500/20 hover:shadow-primary-500/30 transition-all duration-200"
        >
          <HiPlus className="w-5 h-5" />
          <span>Adicionar Marca</span>
        </button>
      </div>

      <DataTable
        columns={columns}
        data={brands}
        loading={loading}
        onEdit={handleOpenEditModal}
        onDelete={handleDelete}
      />

      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingBrand ? 'Editar Marca' : 'Nova Marca'}
      >
        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-dark-300 uppercase tracking-wider mb-2">Nome</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-dark-950/50 border border-dark-700/50 text-white placeholder-dark-500 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-all duration-200"
              placeholder="Ex: Gucci"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-dark-300 uppercase tracking-wider mb-2">País de Origem</label>
            <input
              type="text"
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-dark-950/50 border border-dark-700/50 text-white placeholder-dark-500 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-all duration-200"
              placeholder="Ex: Itália"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-dark-300 uppercase tracking-wider mb-2">Ano de Fundação</label>
              <input
                type="number"
                value={foundedYear}
                onChange={(e) => setFoundedYear(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-dark-950/50 border border-dark-700/50 text-white placeholder-dark-500 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-all duration-200"
                placeholder="Ex: 1921"
                min="1800"
                max="2030"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-dark-300 uppercase tracking-wider mb-2">Segmento</label>
              <select
                value={segment}
                onChange={(e) => setSegment(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-dark-950/50 border border-dark-700/50 text-white placeholder-dark-500 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-all duration-200"
              >
                <option value="Luxo">Luxo</option>
                <option value="Casual">Casual</option>
                <option value="Esportivo">Esportivo</option>
                <option value="Streetwear">Streetwear</option>
                <option value="Fast Fashion">Fast Fashion</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-dark-300 uppercase tracking-wider mb-2">Website (URL completa)</label>
            <input
              type="url"
              value={website}
              onChange={(e) => setWebsite(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-dark-950/50 border border-dark-700/50 text-white placeholder-dark-500 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-all duration-200"
              placeholder="Ex: https://www.gucci.com"
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
