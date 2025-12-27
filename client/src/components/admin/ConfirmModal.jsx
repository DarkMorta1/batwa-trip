import React from 'react'
import Modal from './Modal'

export default function ConfirmModal({ isOpen, onClose, onConfirm, title, message, confirmText = 'Confirm', cancelText = 'Cancel', danger = false }) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} size="sm">
      <div className="admin-space-y-4">
        <p className="admin-text-gray-600">{message}</p>
        <div className="admin-modal-footer" style={{ padding: 0, border: 'none' }}>
          <button
            onClick={onClose}
            className="admin-btn admin-btn-ghost"
          >
            {cancelText}
          </button>
          <button
            onClick={() => {
              onConfirm()
              onClose()
            }}
            className={`admin-btn ${danger ? 'admin-btn-danger' : 'admin-btn-primary'}`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </Modal>
  )
}

