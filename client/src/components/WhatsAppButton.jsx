import React, { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
// Default WhatsApp number (international, no + or dashes). Update if needed.
const WHATSAPP_NUMBER = '9779801113349'
const WHATSAPP_ICON_PATH = '/images/WhatsApp.png'

export default function WhatsAppButton() {
  const { pathname } = useLocation()
  const [heroActive, setHeroActive] = useState(pathname === '/')
  const href = WHATSAPP_NUMBER
    ? `https://wa.me/${WHATSAPP_NUMBER}`
    : 'https://wa.me/'

  useEffect(() => {
    if (pathname !== '/') {
      setHeroActive(false)
      return undefined
    }

    const hero = document.querySelector('.hero')
    if (!hero) {
      setHeroActive(false)
      return undefined
    }

    const observer = new IntersectionObserver(([entry]) => {
      setHeroActive(entry.isIntersecting)
    }, { threshold: 0.1 })

    observer.observe(hero)
    return () => observer.disconnect()
  }, [pathname])

  return (
    <a
      className={`whatsapp-btn ${heroActive ? 'whatsapp-btn--hidden' : ''}`}
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat on WhatsApp"
    >
      <img src={WHATSAPP_ICON_PATH} alt="WhatsApp" />
    </a>
  )
}
