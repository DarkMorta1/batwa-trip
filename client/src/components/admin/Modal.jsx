import React from 'react'

export default function Modal({ isOpen, onClose, title, children, size = 'md' }) {
  if (!isOpen) return null

  const sizeStyles = {
    sm: { maxWidth: '448px' },
    md: { maxWidth: '672px' },
    lg: { maxWidth: '896px' },
    xl: { maxWidth: '1152px' }
  }

  return (
    <div className="admin-modal-overlay" onClick={onClose}>
      <div 
        className="admin-modal" 
        style={sizeStyles[size]}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        {title && (
          <div className="admin-modal-header">
            <h2 className="admin-modal-title">{title}</h2>
            <button
              onClick={onClose}
              className="admin-modal-close"
            >
              ×
            </button>
          </div>
        )}

        {/* Body */}
        <div className="admin-modal-body">
          {children}
        </div>
      </div>
    </div>
  )
}

