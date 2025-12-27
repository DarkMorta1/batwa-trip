import React, { useEffect } from 'react'

export default function Toast({ message, type = 'success', onClose, duration = 3000 }) {
  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        onClose()
      }, duration)
      return () => clearTimeout(timer)
    }
  }, [duration, onClose])

  return (
    <div className={`admin-toast admin-toast-${type}`}>
      <span>{message}</span>
      <button
        onClick={onClose}
        className="admin-toast-close"
      >
        ×
      </button>
    </div>
  )
}

