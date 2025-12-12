import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { crearDirector, actualizarDirector } from '../../../services/directorServices';

export default function DirectorForm({ director, onClose }) {
  const [formData, setFormData] = useState({
    nombres: '',
    estado: 'Activo',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (director) {
      setFormData({
        nombres: director.nombres || '',
        estado: director.estado || 'Activo',
      });
    }
  }, [director]);

  const validarFormulario = () => {
    const nuevosErrores = {};

    if (!formData.nombres.trim()) {
      nuevosErrores.nombres = 'El nombre es obligatorio';
    } else if (formData.nombres.length < 2) {
      nuevosErrores.nombres = 'El nombre debe tener al menos 2 caracteres';
    } else if (formData.nombres.length > 100) {
      nuevosErrores.nombres = 'El nombre no puede exceder 100 caracteres';
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
      if (director) {
        await actualizarDirector(director._id, formData);
      } else {
        await crearDirector(formData);
      }
      onClose();
    } catch (err) {
      setError(director ? 'Error al actualizar el director' : 'Error al crear el director');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: '',
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
      <div className="modal-dialog modal-dialog-centered modal-md">
        <div className="modal-content">
          {/* Modal Header */}
          <div className="modal-header">
            <h5 className="modal-title">
              {director ? '✏️ Editar Director' : '➕ Crear Nuevo Director'}
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
              {/* Nombres */}
              <div className="mb-3">
                <label htmlFor="nombres" className="form-label fw-medium">
                  Nombre del Director <span className="text-danger">*</span>
                </label>
                <input
                  type="text"
                  className={`form-control ${errors.nombres ? 'is-invalid' : ''}`}
                  id="nombres"
                  name="nombres"
                  value={formData.nombres}
                  onChange={handleChange}
                  placeholder="Ej: Christopher Nolan"
                  disabled={loading}
                />
                {errors.nombres && (
                  <div className="invalid-feedback">{errors.nombres}</div>
                )}
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
              className="btn btn-primary"
              disabled={loading}
              onClick={handleSubmit}
            >
              {loading ? (
                <>
                  <span
                    className="spinner-border spinner-border-sm me-2"
                    role="status"
                  >
                    <span className="visually-hidden">Cargando...</span>
                  </span>
                  {director ? 'Actualizando...' : 'Creando...'}
                </>
              ) : director ? (
                'Actualizar'
              ) : (
                'Crear'
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
}
