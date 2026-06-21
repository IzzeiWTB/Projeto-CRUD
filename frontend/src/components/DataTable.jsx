import { HiPencil, HiTrash } from 'react-icons/hi'

function SkeletonRow({ cols }) {
  return (
    <tr className="border-b border-dark-700/30">
      {Array.from({ length: cols }).map((_, i) => (
        <td key={i} className="px-5 py-4">
          <div className="h-4 bg-dark-700/50 rounded-lg animate-pulse" style={{ width: `${60 + Math.random() * 30}%` }} />
        </td>
      ))}
      <td className="px-5 py-4">
        <div className="flex gap-2">
          <div className="w-8 h-8 bg-dark-700/50 rounded-lg animate-pulse" />
          <div className="w-8 h-8 bg-dark-700/50 rounded-lg animate-pulse" />
        </div>
      </td>
    </tr>
  )
}

export default function DataTable({ columns, data, onEdit, onDelete, loading }) {
  if (loading) {
    return (
      <div className="bg-dark-800/60 backdrop-blur-sm rounded-2xl border border-dark-700/50 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-dark-700/50">
                {columns.map((col) => (
                  <th key={col.key} className="px-5 py-3.5 text-left text-xs font-semibold text-dark-400 uppercase tracking-wider">
                    {col.label}
                  </th>
                ))}
                <th className="px-5 py-3.5 text-left text-xs font-semibold text-dark-400 uppercase tracking-wider">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody>
              {Array.from({ length: 5 }).map((_, i) => (
                <SkeletonRow key={i} cols={columns.length} />
              ))}
            </tbody>
          </table>
        </div>
      </div>
    )
  }

  if (!data || data.length === 0) {
    return (
      <div className="bg-dark-800/60 backdrop-blur-sm rounded-2xl border border-dark-700/50 p-12 text-center">
        <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-dark-700/50 flex items-center justify-center">
          <svg className="w-8 h-8 text-dark-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
          </svg>
        </div>
        <p className="text-dark-400 font-medium">Nenhum registro encontrado</p>
        <p className="text-dark-500 text-sm mt-1">Clique em &quot;Adicionar&quot; para criar um novo registro.</p>
      </div>
    )
  }

  return (
    <div className="bg-dark-800/60 backdrop-blur-sm rounded-2xl border border-dark-700/50 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-dark-700/50">
              {columns.map((col) => (
                <th key={col.key} className="px-5 py-3.5 text-left text-xs font-semibold text-dark-400 uppercase tracking-wider">
                  {col.label}
                </th>
              ))}
              <th className="px-5 py-3.5 text-left text-xs font-semibold text-dark-400 uppercase tracking-wider">
                Ações
              </th>
            </tr>
          </thead>
          <tbody>
            {data.map((item, index) => (
              <tr
                key={item._id || item.id || index}
                className="border-b border-dark-700/30 hover:bg-dark-700/30 transition-colors duration-150 group"
              >
                {columns.map((col) => (
                  <td key={col.key} className="px-5 py-3.5 text-sm text-dark-200 whitespace-nowrap">
                    {col.render ? col.render(item[col.key], item) : item[col.key] ?? '-'}
                  </td>
                ))}
                <td className="px-5 py-3.5">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onEdit(item)}
                      className="w-8 h-8 rounded-lg flex items-center justify-center text-dark-400 hover:text-primary-400 hover:bg-primary-500/10 transition-all opacity-70 group-hover:opacity-100"
                      title="Editar"
                    >
                      <HiPencil className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onDelete(item)}
                      className="w-8 h-8 rounded-lg flex items-center justify-center text-dark-400 hover:text-red-400 hover:bg-red-500/10 transition-all opacity-70 group-hover:opacity-100"
                      title="Excluir"
                    >
                      <HiTrash className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
