import React, { useEffect, useState } from 'react';
import { apiService } from '../../services/api';
import { X, Edit, Plus, Trash2, Check, Package, FlaskRound } from 'lucide-react';

interface Envase {
  _id?: string;
  tipo: 'vidrio' | 'plastico';
  volumen: number;
  precio: number;
  stock: number;
}

const tiposEnvase = [
  { value: 'vidrio', label: 'Vidrio' },
  { value: 'plastico', label: 'Plástico' },
];

// Función para formatear número a miles con punto
function formatPrecioES(value: string | number) {
  if (value === '' || value === null || value === undefined) return ''
  const [entero, decimal] = String(value).replace(/\./g, ',').split(',')
  const enteroFormateado = entero.replace(/\B(?=(\d{3})+(?!\d))/g, '.')
  return decimal !== undefined ? `${enteroFormateado},${decimal}` : enteroFormateado
}

export default function AdminEnvases() {
  const [envases, setEnvases] = useState<Envase[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState<Envase>({ tipo: 'vidrio', volumen: 0, precio: 0, stock: 0 });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [showForm, setShowForm] = useState(false);

  // Cargar envases
  const fetchEnvases = async () => {
    setLoading(true);
    try {
      const res = await apiService.get('/envases');
      setEnvases(res);
    } catch (e) {
      setError('Error al cargar envases');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEnvases();
  }, []);

  // Manejar cambios en el formulario
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    // Permitir borrar completamente el campo
    if (name === 'volumen' || name === 'precio' || name === 'stock') {
      setForm((prev) => ({
        ...prev,
        [name]: value === '' ? '' : Number(value.replace(/\./g, '').replace(',', '.')),
      }));
    } else {
      setForm((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  // Crear o actualizar envase
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      if (editingId) {
        await apiService.put(`/envases/${editingId}`, form);
      } else {
        await apiService.post('/envases', form);
      }
      setForm({ tipo: 'vidrio', volumen: 0, precio: 0, stock: 0 });
      setEditingId(null);
      fetchEnvases();
      setShowForm(false);
    } catch (e) {
      setError('Error al guardar el envase');
    } finally {
      setSaving(false);
    }
  };

  // Abrir formulario para crear
  const handleOpenCreate = () => {
    setForm({ tipo: 'vidrio', volumen: 0, precio: 0, stock: 0 });
    setEditingId(null);
    setError(null);
    setShowForm(true);
  };

  // Editar
  const handleEdit = (envase: Envase) => {
    setForm(envase);
    setEditingId(envase._id || null);
    setShowForm(true);
  };

  // Eliminar
  const handleDelete = async (id: string) => {
    if (!window.confirm('¿Eliminar este envase?')) return;
    try {
      await apiService.delete(`/envases/${id}`);
      fetchEnvases();
    } catch {
      setError('Error al eliminar el envase');
    }
  };

  // Cancelar edición/creación
  const handleCancel = () => {
    setForm({ tipo: 'vidrio', volumen: 0, precio: 0, stock: 0 });
    setEditingId(null);
    setError(null);
    setShowForm(false);
  };

  return (
    <div className="max-w-5xl mx-auto py-8">
      {/* Header destacado */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-3">
          <div className="w-2 h-8 bg-blue-500 rounded-full"></div>
          <FlaskRound className="h-7 w-7 text-blue-400" />
          <h1 className="text-2xl font-bold text-white">Gestión de Envases</h1>
        </div>
        <button
          className="admin-btn admin-btn-secondary flex items-center gap-2 px-3 py-2 text-sm"
          onClick={handleOpenCreate}
        >
          <Plus className="h-4 w-4" /> Crear nuevo envase
        </button>
      </div>

      {/* Tabla de envases en card */}
      <div className="bg-gradient-to-br from-purple-900/20 via-purple-800/10 to-purple-700/5 border border-purple-600/30 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 p-6">
        <h2 className="text-lg font-semibold mb-4 text-white flex items-center gap-2">
          <FlaskRound className="h-5 w-5 text-purple-300" /> Lista de Envases
        </h2>
        {loading ? (
          <p className="text-gray-400">Cargando...</p>
        ) : envases.length === 0 ? (
          <p className="text-gray-400">No hay envases registrados.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-gray-200 border-separate border-spacing-y-2 border-spacing-x-0">
              <thead>
                <tr>
                  <th className="py-3 px-4 text-left font-semibold bg-purple-900/40 rounded-tl-xl border border-purple-700">Tipo</th>
                  <th className="py-3 px-4 text-left font-semibold bg-purple-900/40 border-t border-b border-purple-700">Volumen (ml)</th>
                  <th className="py-3 px-4 text-left font-semibold bg-purple-900/40 border-t border-b border-purple-700">Precio</th>
                  <th className="py-3 px-4 text-left font-semibold bg-purple-900/40 border-t border-b border-purple-700">Stock</th>
                  <th className="py-3 px-4 text-left font-semibold bg-purple-900/40 rounded-tr-xl border border-purple-700">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {envases.map((envase) => (
                  <tr
                    key={envase._id}
                    className="transition-all duration-150 bg-slate-800/80 hover:bg-purple-900/30 border-2 border-purple-700 rounded-2xl shadow group"
                  >
                    <td className="py-3 px-4 rounded-l-xl font-medium border-l-2 border-purple-700 flex items-center gap-2">
                      {envase.tipo === 'vidrio' ? (
                        <FlaskRound className="h-4 w-4 text-blue-300" />
                      ) : (
                        <Package className="h-4 w-4 text-yellow-300" />
                      )}
                      <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${envase.tipo === 'vidrio' ? 'bg-blue-900 text-blue-200 border border-blue-700' : 'bg-yellow-900 text-yellow-200 border border-yellow-700'}`}>{envase.tipo === 'vidrio' ? 'Vidrio' : 'Plástico'}</span>
                    </td>
                    <td className="py-3 px-4 border-l-2 border-purple-700">{envase.volumen} ml</td>
                    <td className="py-3 px-4 font-semibold text-green-300 border-l-2 border-purple-700">${envase.precio.toLocaleString()}</td>
                    <td className="py-3 px-4 font-semibold text-yellow-200 border-l-2 border-purple-700">{envase.stock}</td>
                    <td className="py-3 px-4 rounded-r-xl flex gap-2 items-center border-l-2 border-purple-700">
                      <button
                        className="p-2 rounded-lg bg-blue-900/40 hover:bg-blue-700/60 text-blue-300 hover:text-white transition-all duration-150"
                        onClick={() => handleEdit(envase)}
                        title="Editar"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        className="p-2 rounded-lg bg-red-900/40 hover:bg-red-700/60 text-red-300 hover:text-white transition-all duration-150"
                        onClick={() => envase._id && handleDelete(envase._id)}
                        title="Eliminar"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal/Card flotante para crear/editar envase */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-gradient-to-br from-blue-900/60 via-blue-800/40 to-blue-700/30 border-2 border-blue-600/40 rounded-3xl shadow-2xl p-8 w-full max-w-md relative animate-fadeIn flex flex-col items-center">
            <button
              className="absolute top-3 right-3 text-gray-400 hover:text-white"
              onClick={handleCancel}
              title="Cerrar"
            >
              <X className="h-6 w-6" />
            </button>
            <div className="flex items-center gap-3 mb-4">
              <FlaskRound className="h-8 w-8 text-blue-400" />
              <h2 className="text-xl font-bold text-white">
                {editingId ? 'Editar Envase' : 'Nuevo Envase'}
              </h2>
            </div>
            <form onSubmit={handleSubmit} className="space-y-6 w-full">
              <div className="grid grid-cols-1 gap-4">
                <div className="flex flex-col gap-1">
                  <label className="text-sm text-gray-300 mb-1 flex items-center gap-2">
                    <FlaskRound className="h-4 w-4 text-blue-300" /> Tipo
                  </label>
                  <select
                    name="tipo"
                    value={form.tipo}
                    onChange={handleChange}
                    className="admin-input text-lg rounded-xl"
                    required
                  >
                    {tiposEnvase.map((t) => (
                      <option key={t.value} value={t.value}>{t.label}</option>
                    ))}
                  </select>
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-sm text-gray-300 mb-1 flex items-center gap-2">
                    <Plus className="h-4 w-4 text-blue-300" /> Volumen (ml)
                  </label>
                  <input
                    type="text"
                    name="volumen"
                    value={form.volumen === '' ? '' : form.volumen}
                    onChange={handleChange}
                    className="admin-input text-lg rounded-xl"
                    min={1}
                    placeholder="0"
                    autoComplete="off"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-sm text-gray-300 mb-1 flex items-center gap-2">
                    <Edit className="h-4 w-4 text-blue-300" /> Precio
                  </label>
                  <input
                    type="text"
                    name="precio"
                    value={form.precio === '' ? '' : formatPrecioES(form.precio)}
                    onChange={handleChange}
                    className="admin-input text-lg font-semibold rounded-xl"
                    min={0}
                    placeholder="0"
                    autoComplete="off"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-sm text-gray-300 mb-1 flex items-center gap-2">
                    <Check className="h-4 w-4 text-blue-300" /> Stock
                  </label>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      className="p-2 rounded-lg bg-slate-700 hover:bg-blue-700 text-blue-200 hover:text-white transition-all duration-150"
                      onClick={() => setForm((prev) => ({ ...prev, stock: Math.max(0, Number(prev.stock) - 1) }))}
                      tabIndex={-1}
                    >
                      -
                    </button>
                    <input
                      type="text"
                      name="stock"
                      value={form.stock === '' ? '' : form.stock}
                      onChange={handleChange}
                      className="admin-input text-lg rounded-xl w-24 text-center"
                      min={0}
                      placeholder="0"
                      autoComplete="off"
                    />
                    <button
                      type="button"
                      className="p-2 rounded-lg bg-slate-700 hover:bg-blue-700 text-blue-200 hover:text-white transition-all duration-150"
                      onClick={() => setForm((prev) => ({ ...prev, stock: Number(prev.stock) + 1 }))}
                      tabIndex={-1}
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>
              <div className="flex gap-2 mt-4 justify-end">
                <button
                  type="submit"
                  className="px-8 py-3 rounded-xl text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-medium text-base min-w-[140px] flex items-center gap-2 shadow-lg"
                  disabled={saving}
                >
                  {editingId ? <Edit className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
                  Confirmar
                </button>
                <button type="button" className="admin-btn admin-btn-secondary" onClick={handleCancel}>
                  Cancelar
                </button>
              </div>
              {error && <p className="text-red-400 mt-2">{error}</p>}
            </form>
          </div>
        </div>
      )}
    </div>
  );
} 