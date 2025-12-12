import { useState, useEffect } from 'react';
import { obtenerDirectores, eliminarDirector } from '../../../services/directorServices';
import DirectorForm from './DirectorForm';
import './Director.css';

export default function DirectorList() {
  const [directores, setDirectores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [directorSeleccionado, setDirectorSeleccionado] = useState(null);
  const [mostrarInactivos, setMostrarInactivos] = useState(false);

  useEffect(() => {
    cargarDirectores();
  }, []);

  const cargarDirectores = async () => {
    try {
      setLoading(true);
      const data = await obtenerDirectores();
      setDirectores(data);
    } catch (err) {
      setError('Error al cargar los directores');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleEliminar = async (id) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar este director?')) {
      try {
        await eliminarDirector(id);
        await cargarDirectores();
      } catch (err) {
        setError('Error al eliminar el director');
        console.error('Error:', err);
      }
    }
  };

  const handleEditar = (director) => {
    setDirectorSeleccionado(director);
    setShowModal(true);
  };

  const handleNuevo = () => {
    setDirectorSeleccionado(null);
    setShowModal(true);
  };

  const handleModalClose = () => {
    setShowModal(false);
    setDirectorSeleccionado(null);
    cargarDirectores();
  };

  const formatearFecha = (fecha) => {
    return fecha ? new Date(fecha).toLocaleDateString('es-ES') : '—';
  };

  const directoresFiltrados = mostrarInactivos
    ? directores
    : directores.filter((d) => d.estado !== 'Inactivo');

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '200px' }}>
        <div className="text-center">
          <div className="spinner-border text-secondary mb-3" role="status">
            <span className="visually-hidden">Cargando...</span>
          </div>
          <div className="fs-5 text-muted">Cargando directores...</div>
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
            <h1 className="h2 fw-bold text-dark mb-2">Directores</h1>
            <div className="d-flex gap-2 align-items-center flex-wrap">
              <button
                onClick={() => setMostrarInactivos(!mostrarInactivos)}
                className="btn btn-outline-secondary btn-sm"
              >
                {mostrarInactivos ? 'Ocultar inactivos' : 'Mostrar inactivos'}
              </button>
              <span className="text-muted small">
                <span className="d-none d-sm-inline">Total: </span>
                {directoresFiltrados.length} director
                {directoresFiltrados.length !== 1 ? 'es' : ''}
              </span>
            </div>
          </div>
          <div className="col-12 col-md-4 d-flex justify-content-start ">
            <button
              onClick={handleNuevo}
              className="btn btn-primary d-flex align-items-left gap-2  w-md-auto"
            >
              <span>➕</span>
              <span >Crear director</span>
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
                  <th>Estado</th>
                  <th>Fecha de creación</th>
                  <th>Fecha de actualización</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {directoresFiltrados.map((director) => (
                  <tr key={director._id}>
                    <td>{director.nombres}</td>
                    <td>
                      <span
                        className={`badge rounded-pill ${
                          (director.estado || 'Activo') === 'Activo'
                            ? 'text-bg-success'
                            : 'text-bg-danger'
                        }`}
                      >
                        {director.estado || 'Activo'}
                      </span>
                    </td>
                    <td className="text-muted">{formatearFecha(director.fecha_creacion)}</td>
                    <td className="text-muted">{formatearFecha(director.fecha_actualizacion)}</td>
                    <td>
                      <div className="btn-group" role="group">
                        <button
                          onClick={() => handleEditar(director)}
                          className="btn btn-outline-primary btn-sm"
                          title="Editar"
                        >
                          ✏️
                        </button>
                        {(director.estado || 'Activo') === 'Activo' && (
                          <button
                            onClick={() => handleEliminar(director._id)}
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
          {directoresFiltrados.map((director) => (
            <div
              key={director._id}
              className="card mb-3 border-start border-3"
              style={{
                borderLeftColor:
                  (director.estado || 'Activo') === 'Activo' ? '#198754' : '#dc3545',
              }}
            >
              <div className="card-body p-3">
                <div className="d-flex justify-content-between align-items-start mb-2">
                  <h6 className="card-title fw-bold mb-0 text-dark">{director.nombres}</h6>
                  <span
                    className={`badge rounded-pill ${
                      (director.estado || 'Activo') === 'Activo'
                        ? 'text-bg-success'
                        : 'text-bg-danger'
                    }`}
                  >
                    {director.estado || 'Activo'}
                  </span>
                </div>
                <div className="row text-muted small mb-3">
                  <div className="col-6">
                    <div><strong>Creado:</strong></div>
                    <div>{formatearFecha(director.fecha_creacion)}</div>
                  </div>
                  <div className="col-6">
                    <div><strong>Actualizado:</strong></div>
                    <div>{formatearFecha(director.fecha_actualizacion)}</div>
                  </div>
                </div>
                <div className="d-flex gap-2">
                  <button
                    onClick={() => handleEditar(director)}
                    className="btn btn-outline-primary btn-sm flex-grow-1"
                  >
                    ✏️ Editar
                  </button>
                  {(director.estado || 'Activo') === 'Activo' && (
                    <button
                      onClick={() => handleEliminar(director._id)}
                      className="btn btn-outline-danger btn-sm flex-grow-1"
                    >
                      🗑️ Eliminar
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty state */}
        {directoresFiltrados.length === 0 && (
          <div className="text-center py-5">
            <div className="text-muted fs-5">
              {mostrarInactivos
                ? 'No hay directores registrados'
                : 'No hay directores activos'}
            </div>
          </div>
        )}

        {/* Modal */}
        {showModal && (
          <DirectorForm
            director={directorSeleccionado}
            onClose={handleModalClose}
          />
        )}
      </div>
    </div>
  );
}
