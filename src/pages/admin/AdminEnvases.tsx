import React, { useEffect, useState } from 'react';
import { apiService } from '../../services/api';
import { Edit, Plus, Trash2, Package, FlaskRound } from 'lucide-react';

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
  const [saving, setSaving] = useState(false);
  const [showForm, setShowForm] = useState(false);

  // Cargar envases
  const fetchEnvases = async () => {
    setLoading(true);
    try {
      const res = await apiService.get('/envases');
      setEnvases(res);
    } catch {
      // setError('Error al cargar envases'); // Eliminado
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
    // setError(null); // Eliminado
    try {
      if (editingId) {
        await apiService.put(`/envases/${editingId}`, { ...form });
      } else {
        await apiService.post('/envases', { ...form });
      }
      setForm({ tipo: 'vidrio', volumen: 0, precio: 0, stock: 0 });
      setEditingId(null);
      fetchEnvases();
      setShowForm(false);
    } catch {
      // setError('Error al guardar el envase'); // Eliminado
    } finally {
      setSaving(false);
    }
  };

  // Abrir formulario para crear
  const handleOpenCreate = () => {
    setForm({ tipo: 'vidrio', volumen: 0, precio: 0, stock: 0 });
    setEditingId(null);
    // setError(null); // Eliminado
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
      await apiService.del(`/envases/${id}`);
      fetchEnvases();
    } catch {
      // setError('Error al eliminar el envase'); // Eliminado
    }
  };

  // Cancelar edición/creación
  const handleCancel = () => {
    setForm({ tipo: 'vidrio', volumen: 0, precio: 0, stock: 0 });
    setEditingId(null);
    // setError(null); // Eliminado
    setShowForm(false);
  };

  return (
    <div className="max-w-6xl mx-auto py-8 px-4">
      {/* Header destacado */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-4">
          <div className="w-3 h-10 bg-gradient-to-b from-blue-400 to-purple-500 rounded-full shadow-lg"></div>
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-gradient-to-br from-blue-500/20 to-purple-600/20 rounded-xl border border-blue-400/30">
              <FlaskRound className="h-8 w-8 text-blue-300" />
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-300 to-purple-300 bg-clip-text text-transparent">
                Gestión de Envases
              </h1>
              <p className="text-gray-400 text-sm">Administra el inventario de envases</p>
            </div>
          </div>
        </div>
        <button
          className="admin-btn admin-btn-secondary flex items-center gap-3 px-6 py-3 text-sm font-medium shadow-lg hover:shadow-xl transition-all duration-300"
          onClick={handleOpenCreate}
        >
          <Plus className="h-5 w-5" /> Crear nuevo envase
        </button>
      </div>

      {/* Tabla de envases mejorada */}
      <div className="bg-gradient-to-br from-slate-900/80 via-purple-900/20 to-slate-800/90 border border-purple-500/30 rounded-2xl shadow-2xl backdrop-blur-sm">
        <div className="p-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-white flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-purple-500/20 to-blue-500/20 rounded-lg border border-purple-400/30">
                <FlaskRound className="h-5 w-5 text-purple-300" />
              </div>
              Lista de Envases
            </h2>
            <div className="text-sm text-gray-400">
              {envases.length} envase{envases.length !== 1 ? 's' : ''} registrado{envases.length !== 1 ? 's' : ''}
            </div>
          </div>
          
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-400"></div>
              <span className="ml-3 text-gray-400">Cargando envases...</span>
            </div>
          ) : envases.length === 0 ? (
            <div className="text-center py-12">
              <div className="p-4 bg-gradient-to-br from-gray-800/50 to-gray-700/50 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Package className="h-8 w-8 text-gray-400" />
              </div>
              <p className="text-gray-400 text-lg">No hay envases registrados</p>
              <p className="text-gray-500 text-sm mt-2">Crea el primer envase para comenzar</p>
            </div>
          ) : (
            <div className="overflow-hidden rounded-xl border border-purple-500/20">
              <table className="w-full">
                <thead>
                  <tr className="bg-gradient-to-r from-purple-900/60 via-purple-800/40 to-purple-900/60">
                    <th className="py-4 px-6 text-left font-semibold text-white border-b border-purple-500/30">
                      <div className="flex items-center gap-2">
                        <Package className="h-4 w-4 text-purple-300" />
                        Tipo
                      </div>
                    </th>
                    <th className="py-4 px-6 text-left font-semibold text-white border-b border-purple-500/30">
                      <div className="flex items-center gap-2">
                        <FlaskRound className="h-4 w-4 text-blue-300" />
                        Volumen (ml)
                      </div>
                    </th>
                    <th className="py-4 px-6 text-left font-semibold text-white border-b border-purple-500/30">
                      <div className="flex items-center gap-2">
                        <span className="text-green-300">$</span>
                        Precio
                      </div>
                    </th>
                    <th className="py-4 px-6 text-left font-semibold text-white border-b border-purple-500/30">
                      <div className="flex items-center gap-2">
                        <span className="text-yellow-300">📦</span>
                        Stock
                      </div>
                    </th>
                    <th className="py-4 px-6 text-left font-semibold text-white border-b border-purple-500/30">
                      <div className="flex items-center gap-2">
                        <span className="text-purple-300">⚙️</span>
                        Acciones
                      </div>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-purple-500/20">
                  {envases.map((envase) => (
                    <tr
                      key={envase._id}
                      className="bg-gradient-to-r from-slate-800/50 via-slate-700/30 to-slate-800/50 hover:from-purple-900/30 hover:via-purple-800/20 hover:to-purple-900/30 transition-all duration-300 group"
                    >
                      <td className="py-5 px-6">
                        <div className="flex items-center gap-3">
                          {envase.tipo === 'vidrio' ? (
                            <div className="p-2 bg-gradient-to-br from-blue-500/20 to-blue-600/20 rounded-lg border border-blue-400/30">
                              <FlaskRound className="h-5 w-5 text-blue-300" />
                            </div>
                          ) : (
                            <div className="p-2 bg-gradient-to-br from-yellow-500/20 to-orange-600/20 rounded-lg border border-yellow-400/30">
                              <Package className="h-5 w-5 text-yellow-300" />
                            </div>
                          )}
                          <span className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold border-2 transition-all duration-300 ${
                            envase.tipo === 'vidrio'
                              ? 'bg-gradient-to-r from-blue-600/20 to-blue-700/20 text-blue-200 border-blue-400/40 group-hover:border-blue-300/60'
                              : 'bg-gradient-to-r from-yellow-600/20 to-orange-700/20 text-yellow-200 border-yellow-400/40 group-hover:border-yellow-300/60'
                          }`}>
                            {envase.tipo === 'vidrio' ? 'Vidrio' : 'Plástico'}
                          </span>
                        </div>
                      </td>
                      <td className="py-5 px-6">
                        <span className="text-white font-medium text-lg">{envase.volumen} ml</span>
                      </td>
                      <td className="py-5 px-6">
                        <span className="text-green-300 font-bold text-lg">${formatPrecioES(envase.precio)}</span>
                      </td>
                      <td className="py-5 px-6">
                        <div className="flex items-center gap-2">
                          <span className="text-yellow-200 font-bold text-lg">{envase.stock}</span>
                          <span className="text-xs text-gray-400">unidades</span>
                        </div>
                      </td>
                      <td className="py-5 px-6">
                        <div className="flex items-center gap-3">
                          <button
                            className="p-3 rounded-xl bg-gradient-to-br from-blue-600/20 to-blue-700/20 hover:from-blue-500/30 hover:to-blue-600/30 text-blue-300 hover:text-white border border-blue-500/30 hover:border-blue-400/50 transition-all duration-300 shadow-lg hover:shadow-xl"
                            onClick={() => handleEdit(envase)}
                            title="Editar envase"
                          >
                            <Edit className="h-5 w-5" />
                          </button>
                          <button
                            className="p-3 rounded-xl bg-gradient-to-br from-red-600/20 to-red-700/20 hover:from-red-500/30 hover:to-red-600/30 text-red-300 hover:text-white border border-red-500/30 hover:border-red-400/50 transition-all duration-300 shadow-lg hover:shadow-xl"
                            onClick={() => envase._id && handleDelete(envase._id)}
                            title="Eliminar envase"
                          >
                            <Trash2 className="h-5 w-5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Formulario de envase */}
      {showForm && (
        <div className="mt-8 bg-gradient-to-br from-slate-900/80 via-purple-900/20 to-slate-800/90 border border-purple-500/30 rounded-2xl shadow-2xl backdrop-blur-sm">
          <div className="p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-gradient-to-br from-purple-500/20 to-blue-500/20 rounded-xl border border-purple-400/30">
                <FlaskRound className="h-6 w-6 text-purple-300" />
              </div>
              <h2 className="text-xl font-semibold text-white">
                {editingId ? 'Editar Envase' : 'Nuevo Envase'}
              </h2>
            </div>
            
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label htmlFor="tipo" className="block text-sm font-medium text-gray-300">
                  Tipo de Envase
                </label>
                <select
                  id="tipo"
                  name="tipo"
                  value={form.tipo}
                  onChange={handleChange}
                  className="w-full p-4 rounded-xl bg-gradient-to-br from-gray-800/50 to-gray-700/50 border border-gray-600/50 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-400 transition-all duration-300"
                >
                  {tiposEnvase.map((tipo) => (
                    <option key={tipo.value} value={tipo.value}>
                      {tipo.label}
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="space-y-2">
                <label htmlFor="volumen" className="block text-sm font-medium text-gray-300">
                  Volumen (ml)
                </label>
                <input
                  type="number"
                  id="volumen"
                  name="volumen"
                  value={form.volumen}
                  onChange={handleChange}
                  className="w-full p-4 rounded-xl bg-gradient-to-br from-gray-800/50 to-gray-700/50 border border-gray-600/50 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-400 transition-all duration-300"
                  placeholder="Ej: 100"
                />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="precio" className="block text-sm font-medium text-gray-300">
                  Precio
                </label>
                <input
                  type="text"
                  id="precio"
                  name="precio"
                  value={formatPrecioES(form.precio)}
                  onChange={handleChange}
                  className="w-full p-4 rounded-xl bg-gradient-to-br from-gray-800/50 to-gray-700/50 border border-gray-600/50 text-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-400 transition-all duration-300"
                  placeholder="Ej: 20.000"
                />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="stock" className="block text-sm font-medium text-gray-300">
                  Stock
                </label>
                <input
                  type="number"
                  id="stock"
                  name="stock"
                  value={form.stock}
                  onChange={handleChange}
                  className="w-full p-4 rounded-xl bg-gradient-to-br from-gray-800/50 to-gray-700/50 border border-gray-600/50 text-white focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-yellow-400 transition-all duration-300"
                  placeholder="Ej: 10"
                />
              </div>
              
              <div className="md:col-span-2 flex justify-end gap-4 pt-4">
                <button
                  type="button"
                  className="admin-btn admin-btn-secondary px-8 py-3 text-sm font-medium shadow-lg hover:shadow-xl transition-all duration-300"
                  onClick={handleCancel}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="admin-btn admin-btn-primary px-8 py-3 text-sm font-medium shadow-lg hover:shadow-xl transition-all duration-300"
                  disabled={saving}
                >
                  {saving ? 'Guardando...' : editingId ? 'Guardar Cambios' : 'Crear Envase'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}