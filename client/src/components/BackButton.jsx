import React from 'react'

export default function BackButton({ onClick, label = 'Back' }) {
  return (
    <button type="button" className="back-button" onClick={onClick}>
      <span className="back-button__icon" aria-hidden="true">←</span>
      <span>{label}</span>
    </button>
  )
}
