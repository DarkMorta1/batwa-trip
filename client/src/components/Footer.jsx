import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { contactMethods, socialLinks } from '../constants/contact'

const API = import.meta.env.VITE_API_URL || 'http://localhost:4000'

export default function Footer() {
  const [settings, setSettings] = useState(null)

  useEffect(() => {
    fetch(`${API}/api/website-settings`)
      .then(response => response.ok ? response.json() : null)
      .then(data => data && setSettings(data))
      .catch(() => {})
  }, [])

  const configuredContact = [
    { ...contactMethods[0], value: settings?.contactPhone || contactMethods[0].value, href: settings?.contactPhone ? `tel:${settings.contactPhone.replace(/\s+/g, '')}` : contactMethods[0].href },
    { ...contactMethods[1], value: settings?.contactEmail || contactMethods[1].value, href: settings?.contactEmail ? `mailto:${settings.contactEmail}` : contactMethods[1].href },
    { ...contactMethods[2], value: settings?.address || contactMethods[2].value, href: settings?.googleMapsUrl || contactMethods[2].href },
    contactMethods[3]
  ]
  const configuredSocials = socialLinks.map(social => {
    const configuredUrl = settings?.socialLinks?.[social.name.toLowerCase()]
    if (configuredUrl) return { ...social, url: configuredUrl }
    if (social.name === 'WhatsApp' && settings?.whatsappNumber) {
      return { ...social, url: `https://wa.me/${settings.whatsappNumber.replace(/\D/g, '')}` }
    }
    return social
  })

  return (
    <footer className="site-footer">
      <div className="site-footer__inner">
        <div className="site-footer__brand">
          <img src="/images/logo.jpg" alt="Batuwa Trip" className="site-footer__logo" />
          <h2>Batuwa Trip</h2>
          <p>Thoughtful journeys through Nepal, shaped by local insight.</p>
          <div className="site-footer__socials">
            {configuredSocials.map(social => (
              <a key={social.name} href={social.url} target="_blank" rel="noopener noreferrer" aria-label={social.name}>
                <img src={social.icon} alt="" />
              </a>
            ))}
          </div>
        </div>

        <div className="site-footer__links">
          <h3>Explore</h3>
          <Link to="/">Home</Link>
          <Link to="/gallery">Gallery</Link>
          <Link to="/blogs">Blogs</Link>
          <Link to="/about">About Us</Link>
          <Link to="/contact">Contact</Link>
        </div>

        <div className="site-footer__contact">
          <h3>Contact</h3>
          {configuredContact.map(method => (
            <a key={method.label} href={method.href}>
              <span aria-hidden>{method.icon}</span>
              <span><strong>{method.label}</strong>{method.value}</span>
            </a>
          ))}
        </div>
      </div>
      <div className="site-footer__bottom">© {new Date().getFullYear()} Batuwa Trip. All rights reserved.</div>
    </footer>
  )
}