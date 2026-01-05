import React from 'react'
// Default WhatsApp number (international, no + or dashes). Update if needed.
const WHATSAPP_NUMBER = '9779801113349'
const WHATSAPP_ICON_PATH = '/images/WhatsApp.png'

export default function WhatsAppButton() {
  const href = WHATSAPP_NUMBER
    ? `https://wa.me/${WHATSAPP_NUMBER}`
    : 'https://wa.me/'

  return (
    <a
      className="whatsapp-btn"
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat on WhatsApp"
    >
      <img src={WHATSAPP_ICON_PATH} alt="WhatsApp" />
    </a>
  )
}
