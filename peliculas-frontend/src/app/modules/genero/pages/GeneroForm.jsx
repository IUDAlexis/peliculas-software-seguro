import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { crearGenero, actualizarGenero } from '../../../services/generoServices';

export default function GeneroForm({ genero, onClose }) {
  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
    estado: 'Activo'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (genero) {
      setFormData({
        nombre: genero.nombre || '',
        descripcion: genero.descripcion || '',
        estado: genero.estado || 'Activo'
      });
    }
  }, [genero]);

  const validarFormulario = () => {
    const nuevosErrores = {};

    if (!formData.nombre.trim()) {
      nuevosErrores.nombre = 'El nombre es obligatorio';
    } else if (formData.nombre.length < 2) {
      nuevosErrores.nombre = 'El nombre debe tener al menos 2 caracteres';
    } else if (formData.nombre.length > 50) {
      nuevosErrores.nombre = 'El nombre no puede exceder 50 caracteres';
    }

    if (!formData.descripcion.trim()) {
      nuevosErrores.descripcion = 'La descripción es obligatoria';
    } else if (formData.descripcion.length < 10) {
      nuevosErrores.descripcion = 'La descripción debe tener al menos 10 caracteres';
    } else if (formData.descripcion.length > 500) {
      nuevosErrores.descripcion = 'La descripción no puede exceder 500 caracteres';
    }

    setErrors(nuevosErrores);
    return Object.keys(nuevosErrores).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validarFormulario()) {
      return;
    }

    setLoading(true);
    setError(null);

    try {
      if (genero) {
        await actualizarGenero(genero._id, formData);
      } else {
        await crearGenero(formData);
      }
      onClose();
    } catch (err) {
      setError(genero ? 'Error al actualizar el género' : 'Error al crear el género');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Limpiar error del campo cuando el usuario empiece a escribir
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const modalContent = (
    <div className="modal d-block" tabIndex="-1" onClick={handleBackdropClick}>
      <div className="modal-dialog modal-dialog-centered modal-lg">
        <div className="modal-content">
          {/* Modal Header */}
          <div className="modal-header">
            <h5 className="modal-title d-flex align-items-center gap-2">
              {genero ? '✏️ Editar Género' : '➕ Crear Nuevo Género'}
            </h5>
            <button
              type="button"
              className="btn-close"
              onClick={onClose}
              disabled={loading}
            ></button>
          </div>

          {/* Modal Body */}
          <div className="modal-body">
            {error && (
              <div className="alert alert-danger" role="alert">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              {/* Nombre */}
              <div className="mb-3">
                <label htmlFor="nombre" className="form-label fw-medium">
                  Nombre del Género <span className="text-danger">*</span>
                </label>
                <input
                  type="text"
                  className={`form-control ${errors.nombre ? 'is-invalid' : ''}`}
                  id="nombre"
                  name="nombre"
                  value={formData.nombre}
                  onChange={handleChange}
                  placeholder="Ej: Acción, Drama, Comedia..."
                  disabled={loading}
                />
                {errors.nombre && (
                  <div className="invalid-feedback">{errors.nombre}</div>
                )}
              </div>

              {/* Descripción */}
              <div className="mb-3">
                <label htmlFor="descripcion" className="form-label fw-medium">
                  Descripción <span className="text-danger">*</span>
                </label>
                <textarea
                  className={`form-control ${errors.descripcion ? 'is-invalid' : ''}`}
                  id="descripcion"
                  name="descripcion"
                  rows="3"
                  value={formData.descripcion}
                  onChange={handleChange}
                  placeholder="Describe las características de este género cinematográfico..."
                  disabled={loading}
                />
                <div className="d-flex justify-content-between align-items-center mt-1">
                  {errors.descripcion && (
                    <div className="invalid-feedback d-block">{errors.descripcion}</div>
                  )}
                  <small className="text-muted ms-auto">
                    {formData.descripcion.length}/500
                  </small>
                </div>
              </div>

              {/* Estado */}
              <div className="mb-3">
                <label htmlFor="estado" className="form-label fw-medium">
                  Estado
                </label>
                <select
                  className="form-select"
                  id="estado"
                  name="estado"
                  value={formData.estado}
                  onChange={handleChange}
                  disabled={loading}
                >
                  <option value="Activo">Activo</option>
                  <option value="Inactivo">Inactivo</option>
                </select>
              </div>
            </form>
          </div>

          {/* Modal Footer */}
          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-danger"
              onClick={onClose}
              disabled={loading}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="btn btn-primary generos-btn"
              disabled={loading}
              onClick={handleSubmit}
            >
              {loading ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" role="status">
                    <span className="visually-hidden">Cargando...</span>
                  </span>
                  {genero ? 'Actualizando...' : 'Creando...'}
                </>
              ) : (
                genero ? 'Actualizar' : 'Crear'
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
}
