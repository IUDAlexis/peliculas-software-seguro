import { useState, useEffect } from 'react';
import { obtenerProductoras, eliminarProductora } from '../../../services/productoraServices';
import ProductoraForm from './ProductoraForm';
import './Productora.css';

export default function ProductoraList() {
  const [productoras, setProductoras] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [productoraSeleccionada, setProductoraSeleccionada] = useState(null);
  const [mostrarInactivos, setMostrarInactivos] = useState(false);

  useEffect(() => {
    cargarProductoras();
  }, []);

  const cargarProductoras = async () => {
    try {
      setLoading(true);
      const data = await obtenerProductoras();
      setProductoras(data);
    } catch (err) {
      setError('Error al cargar las productoras');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleEliminar = async (id) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar esta productora?')) {
      try {
        await eliminarProductora(id);
        await cargarProductoras();
      } catch (err) {
        setError('Error al eliminar la productora');
        console.error('Error:', err);
      }
    }
  };

  const handleEditar = (productora) => {
    setProductoraSeleccionada(productora);
    setShowModal(true);
  };

  const handleNuevo = () => {
    setProductoraSeleccionada(null);
    setShowModal(true);
  };

  const handleModalClose = () => {
    setShowModal(false);
    setProductoraSeleccionada(null);
    cargarProductoras();
  };

  const formatearFecha = (fecha) => {
    return new Date(fecha).toLocaleDateString('es-ES');
  };

  const productorasFiltradas = mostrarInactivos 
    ? productoras 
    : productoras.filter(p => p.estado !== 'Inactivo');

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '200px' }}>
        <div className="text-center">
          <div className="spinner-border text-secondary mb-3" role="status">
            <span className="visually-hidden">Cargando...</span>
          </div>
          <div className="fs-5 text-muted">Cargando productoras...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="alert alert-danger text-center" role="alert">
        <strong>Error:</strong> {error}
      </div>
    );
  }

  return (
    <div className="card shadow-sm">
      <div className="card-body">
        {/* Header */}
        <div className="row g-3 align-items-center mb-4">
          <div className="col-12 col-md-8">
            <h1 className="h2 fw-bold text-dark mb-2">Productoras</h1>
            <div className="d-flex gap-2 align-items-center flex-wrap">
              <button
                onClick={() => setMostrarInactivos(!mostrarInactivos)}
                className="btn btn-outline-secondary btn-sm"
              >
                {mostrarInactivos ? 'Ocultar inactivos' : 'Mostrar inactivos'}
              </button>
              <span className="text-muted small">
                <span className="d-none d-sm-inline">Total: </span>
                {productorasFiltradas.length} productora{productorasFiltradas.length !== 1 ? 's' : ''}
              </span>
            </div>
          </div>
          <div className="col-12 col-md-4 d-flex justify-content-start">
            <button
              onClick={handleNuevo}
              className="btn btn-primary d-flex align-items-left gap-2  w-md-auto"
            >
              <span>➕</span>
              <span className="d-none d-sm-inline">Crear productora</span>
              <span className="d-sm-none">Nuevo</span>
            </button>
          </div>
        </div>

        {/* Desktop Table */}
        <div className="d-none d-lg-block">
          <div className="table-responsive">
            <table className="table table-hover">
              <thead className="table-light">
                <tr>
                  <th>Nombre</th>
                  <th>Slogan</th>
                  <th>Estado</th>
                  <th>Creación</th>
                  <th>Actualización</th>
                  <th>Descripción</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {productorasFiltradas.map((p) => (
                  <tr key={p._id}>
                    <td>{p.nombre}</td>
                    <td className="text-muted">{p.slogan || '-'}</td>
                    <td>
                      <span className={`badge ${(p.estado || 'Activo') === 'Activo' ? 'text-bg-success' : 'text-bg-danger'}`}>
                        {p.estado || 'Activo'}
                      </span>
                    </td>
                    <td className="text-muted">{formatearFecha(p.fecha_creacion)}</td>
                    <td className="text-muted">{formatearFecha(p.fecha_actualizacion)}</td>
                    <td style={{ maxWidth: '200px' }}>
                      <span className="text-muted text-truncate d-inline-block" style={{ maxWidth: '180px' }}>
                        {p.descripcion}
                      </span>
                    </td>
                    <td>
                      <div className="btn-group" role="group">
                        <button
                          onClick={() => handleEditar(p)}
                          className="btn btn-outline-primary btn-sm"
                          title="Editar"
                        >
                          ✏️
                        </button>
                        {(p.estado || 'Activo') === 'Activo' && (
                          <button
                            onClick={() => handleEliminar(p._id)}
                            className="btn btn-outline-danger btn-sm"
                            title="Eliminar"
                          >
                            🗑️
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Mobile Cards */}
        <div className="d-lg-none">
          {productorasFiltradas.map((p) => (
            <div key={p._id} className="card mb-3 border-start border-3" style={{ borderLeftColor: (p.estado || 'Activo') === 'Activo' ? '#9b59b6' : '#dc3545' }}>
              <div className="card-body p-3">
                <div className="d-flex justify-content-between align-items-start mb-2">
                  <h6 className="fw-bold mb-0">{p.nombre}</h6>
                  <span className={`badge ${(p.estado || 'Activo') === 'Activo' ? 'text-bg-success' : 'text-bg-danger'}`}>
                    {p.estado || 'Activo'}
                  </span>
                </div>
                {p.slogan && <p className="text-primary small mb-2"><em>{p.slogan}</em></p>}
                <p className="text-muted small mb-2">{p.descripcion}</p>
                <div className="row text-muted small mb-3">
                  <div className="col-6"><strong>Creado:</strong> {formatearFecha(p.fecha_creacion)}</div>
                  <div className="col-6"><strong>Actualizado:</strong> {formatearFecha(p.fecha_actualizacion)}</div>
                </div>
                <div className="d-flex gap-2">
                  <button onClick={() => handleEditar(p)} className="btn btn-outline-primary btn-sm flex-grow-1">✏️ Editar</button>
                  {(p.estado || 'Activo') === 'Activo' && (
                    <button onClick={() => handleEliminar(p._id)} className="btn btn-outline-danger btn-sm flex-grow-1">🗑️ Eliminar</button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty state */}
        {productorasFiltradas.length === 0 && (
          <div className="text-center py-5">
            <div className="text-muted fs-5">
              {mostrarInactivos 
                ? 'No hay productoras registradas' 
                : 'No hay productoras activas'}
            </div>
          </div>
        )}

        {/* Modal */}
        {showModal && (
          <ProductoraForm
            productora={productoraSeleccionada}
            onClose={handleModalClose}
          />
        )}
      </div>
    </div>
  );
}
