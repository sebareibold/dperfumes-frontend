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
    } catch (e) {
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
    } catch (e) {
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
                      <span className={envase.tipo === 'vidrio'
                        ? 'inline-block px-3 py-1 rounded-full text-xs font-semibold bg-blue-900 text-blue-200 border border-blue-700'
                        : 'inline-block px-3 py-1 rounded-full text-xs font-semibold bg-yellow-900 text-yellow-200 border border-yellow-700'}>
                        {envase.tipo === 'vidrio' ? 'Vidrio' : 'Plástico'}
                      </span>
                    </td>
                    <td className="py-3 px-4 border-l-2 border-purple-700">{envase.volumen} ml</td>
                    <td className="py-3 px-4 font-semibold text-green-300 border-l-2 border-purple-700">${formatPrecioES(envase.precio)}</td>
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

      {/* Formulario de envase */}
      {showForm && (
        <div className="mt-8 bg-gradient-to-br from-purple-900/20 via-purple-800/10 to-purple-700/5 border border-purple-600/30 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 p-6">
          <h2 className="text-lg font-semibold mb-4 text-white flex items-center gap-2">
            <FlaskRound className="h-5 w-5 text-purple-300" /> {editingId ? 'Editar Envase' : 'Nuevo Envase'}
          </h2>
          <form onSubmit={handleSubmit} className="grid gap-4">
            <div>
              <label htmlFor="tipo" className="block text-sm font-medium text-gray-300 mb-1">Tipo de Envase</label>
              <select
                id="tipo"
                name="tipo"
                value={form.tipo}
                onChange={handleChange}
                className="w-full p-2 rounded-md bg-gray-700 border border-gray-600 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {tiposEnvase.map((tipo) => (
                  <option key={tipo.value} value={tipo.value}>
                    {tipo.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="volumen" className="block text-sm font-medium text-gray-300 mb-1">Volumen (ml)</label>
              <input
                type="number"
                id="volumen"
                name="volumen"
                value={form.volumen}
                onChange={handleChange}
                className="w-full p-2 rounded-md bg-gray-700 border border-gray-600 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label htmlFor="precio" className="block text-sm font-medium text-gray-300 mb-1">Precio</label>
              <input
                type="text"
                id="precio"
                name="precio"
                value={formatPrecioES(form.precio)}
                onChange={handleChange}
                className="w-full p-2 rounded-md bg-gray-700 border border-gray-600 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label htmlFor="stock" className="block text-sm font-medium text-gray-300 mb-1">Stock</label>
              <input
                type="number"
                id="stock"
                name="stock"
                value={form.stock}
                onChange={handleChange}
                className="w-full p-2 rounded-md bg-gray-700 border border-gray-600 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="flex justify-end gap-2">
              <button
                type="button"
                className="admin-btn admin-btn-secondary px-4 py-2 text-sm"
                onClick={handleCancel}
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="admin-btn admin-btn-primary px-4 py-2 text-sm"
                disabled={saving}
              >
                {saving ? 'Guardando...' : editingId ? 'Guardar Cambios' : 'Crear Envase'}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}