import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { crearProductora, actualizarProductora } from '../../../services/productoraServices';

export default function ProductoraForm({ productora, onClose }) {
  const [formData, setFormData] = useState({
    nombre: '',
    slogan: '',
    descripcion: '',
    estado: 'Activo'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (productora) {
      setFormData({
        nombre: productora.nombre || '',
        slogan: productora.slogan || '',
        descripcion: productora.descripcion || '',
        estado: productora.estado || 'Activo'
      });
    }
  }, [productora]);

  const validarFormulario = () => {
    const nuevosErrores = {};

    if (!formData.nombre.trim()) {
      nuevosErrores.nombre = 'El nombre es obligatorio';
    } else if (formData.nombre.length < 2) {
      nuevosErrores.nombre = 'El nombre debe tener al menos 2 caracteres';
    } else if (formData.nombre.length > 50) {
      nuevosErrores.nombre = 'El nombre no puede exceder 50 caracteres';
    }

    if (!formData.slogan.trim()) {
      nuevosErrores.slogan = 'El slogan es obligatorio';
    } else if (formData.slogan.length < 5) {
      nuevosErrores.slogan = 'El slogan debe tener al menos 5 caracteres';
    } else if (formData.slogan.length > 100) {
      nuevosErrores.slogan = 'El slogan no puede exceder 100 caracteres';
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
      if (productora) {
        await actualizarProductora(productora._id, formData);
      } else {
        await crearProductora(formData);
      }
      onClose();
    } catch (err) {
      setError(productora ? 'Error al actualizar la productora' : 'Error al crear la productora');
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
          {/* Header */}
          <div className="modal-header">
            <h5 className="modal-title d-flex align-items-center gap-2">
              {productora ? '✏️ Editar Productora' : '➕ Crear Nueva Productora'}
            </h5>
            <button
              type="button"
              className="btn-close"
              onClick={onClose}
              disabled={loading}
            ></button>
          </div>

          {/* Body */}
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
                  Nombre <span className="text-danger">*</span>
                </label>
                <input
                  type="text"
                  className={`form-control ${errors.nombre ? 'is-invalid' : ''}`}
                  id="nombre"
                  name="nombre"
                  value={formData.nombre}
                  onChange={handleChange}
                  placeholder="Ej: Warner Bros, Universal..."
                  disabled={loading}
                />
                {errors.nombre && <div className="invalid-feedback">{errors.nombre}</div>}
              </div>

              {/* Slogan */}
              <div className="mb-3">
                <label htmlFor="slogan" className="form-label fw-medium">
                  Slogan <span className="text-danger">*</span>
                </label>
                <input
                  type="text"
                  className={`form-control ${errors.slogan ? 'is-invalid' : ''}`}
                  id="slogan"
                  name="slogan"
                  value={formData.slogan}
                  onChange={handleChange}
                  placeholder="Ej: 'El cine que inspira emociones...'"
                  disabled={loading}
                />
                {errors.slogan && <div className="invalid-feedback">{errors.slogan}</div>}
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
                  placeholder="Describe la productora..."
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

          {/* Footer */}
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
              className="btn btn-primary"
              disabled={loading}
              onClick={handleSubmit}
            >
              {loading ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" role="status">
                    <span className="visually-hidden">Cargando...</span>
                  </span>
                  {productora ? 'Actualizando...' : 'Creando...'}
                </>
              ) : (
                productora ? 'Actualizar' : 'Crear'
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
}
