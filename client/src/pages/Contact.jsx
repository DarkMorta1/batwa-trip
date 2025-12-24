import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function Contact() {
  const nav = useNavigate()
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', message: '' })
  const [submitted, setSubmitted] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log('Message submitted:', formData)
    setSubmitted(true)
    setTimeout(() => {
      setFormData({ name: '', email: '', phone: '', message: '' })
      setSubmitted(false)
    }, 3000)
  }

  const contactMethods = [
    { icon: '📞', label: 'Phone', value: '+977 980-1113350', href: 'tel:+977 980-1113350' },
    { icon: '📧', label: 'Email', value: 'batuwatrip@gmail.com ', href: 'mailto:batuwatrip@gmail.com ' },
    { icon: '📍', label: 'Location', value: 'Kathmandu, Nepal', href: '#' },
    { icon: '⏰', label: 'Hours', value: '9AM - 6PM ', href: '#' },
  ]

   const socialLinks = [
    { name: 'Facebook', icon: '/images/fb.png', url: 'https://www.facebook.com/share/1BZt5p95gK/', color: 'rgba(59, 89, 152, 0.2)', hoverColor: 'rgba(59, 89, 152, 0.4)'},
    { name: 'Instagram', icon: '/images/Instagram_icon.png', url: 'https://www.instagram.com/batuwatrip', color: 'rgba(217, 48, 128, 0.2)', hoverColor: 'rgba(217, 48, 128, 0.4)' },
    { name: 'WhatsApp', icon: '/images/WhatsApp.png', url: 'https://wa.me/9779801113350', color: 'rgba(37, 211, 102, 0.2)', hoverColor: 'rgba(37, 211, 102, 0.4)' },
    { name: 'Call Now', icon: '/images/phone.png', url: 'tel:+977980-1113350', color: 'rgba(63, 81, 181, 0.2)', hoverColor: 'rgba(63, 81, 181, 0.4)' },
  ]

  return (
    <div style={{ padding: '0', minHeight: 'calc(100vh - 140px)' }}>
      {/* Back Button */}
      <div style={{ padding: '16px 28px' }}>
        <button className="back" onClick={() => nav('/')} style={{
          background: '#3f51b5',
          border: 'none',
          borderRadius: '50%',
          width: '40px',
          height: '40px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '20px',
          cursor: 'pointer',
          color: '#fff',
          transition: 'all 200ms'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = '#2d3a8c'
          e.currentTarget.style.transform = 'scale(1.1)'
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = '#3f51b5'
          e.currentTarget.style.transform = 'scale(1)'
        }}
        >←</button>
      </div>

      {/* Header Section */}
      <div style={{ padding: '0 28px 28px', maxWidth: '1120px', margin: '0 auto' }}>
        <div style={{ marginBottom: '32px' }}>
          <span style={{ color: 'rgba(255,255,255,0.7)', textTransform: 'uppercase', fontWeight: '600', fontSize: '12px', letterSpacing: '0.5px' }}>
            Stay Connected
          </span>
          <h1 style={{ color: '#fff', margin: '4px 0 12px 0', fontSize: '28px', fontWeight: '700' }}>
            <span style={{ color: '#e91e63' }}>Contact</span> Us
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.75)', margin: 0, fontSize: '15px', lineHeight: '1.6' }}>
            Have questions about our tours? We're here to help! Reach out through any of these channels.
          </p>
        </div>

        {/* Contact Methods Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '32px' }}>
          {contactMethods.map((method, idx) => (
            <a key={idx} href={method.href} 
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '12px',
                padding: '18px',
                background: '#fff',
                borderRadius: '12px',
                border: '1px solid #e6e6e6',
                textDecoration: 'none',
                boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                transition: 'all 200ms',
                cursor: 'pointer'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-4px)'
                e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.12)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)'
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.08)'
              }}
            >
              <span style={{ fontSize: '28px' }}>{method.icon}</span>
              <div>
                <p style={{ margin: '0 0 4px 0', color: '#666', fontSize: '12px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  {method.label}
                </p>
                <p style={{ margin: 0, color: '#111', fontSize: '15px', fontWeight: '600' }}>
                  {method.value}
                </p>
              </div>
            </a>
          ))}
        </div>

        {/* Main Content Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '28px' }}>
          {/* Message Form */}
          {/* <div>
            <h2 style={{ color: '#fff', fontSize: '22px', fontWeight: '700', marginBottom: '18px' }}>Send Us a Message</h2>
            <form onSubmit={handleSubmit} style={{
              background: '#fff',
              borderRadius: '12px',
              padding: '24px',
              boxShadow: '0 8px 18px rgba(0,0,0,0.08)',
            }}>
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', color: '#111', fontWeight: '600', marginBottom: '8px', fontSize: '14px' }}>
                  Your Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="John Doe"
                  required
                  style={{
                    width: '100%',
                    padding: '12px 14px',
                    border: '1px solid #e6e6e6',
                    borderRadius: '8px',
                    fontSize: '14px',
                    fontFamily: 'Poppins, sans-serif',
                    boxSizing: 'border-box',
                    transition: 'all 200ms'
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = '#3f51b5'
                    e.target.style.boxShadow = '0 0 0 3px rgba(63, 81, 181, 0.1)'
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = '#e6e6e6'
                    e.target.style.boxShadow = 'none'
                  }}
                />
              </div>

              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', color: '#111', fontWeight: '600', marginBottom: '8px', fontSize: '14px' }}>
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="john@example.com"
                  required
                  style={{
                    width: '100%',
                    padding: '12px 14px',
                    border: '1px solid #e6e6e6',
                    borderRadius: '8px',
                    fontSize: '14px',
                    fontFamily: 'Poppins, sans-serif',
                    boxSizing: 'border-box',
                    transition: 'all 200ms'
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = '#3f51b5'
                    e.target.style.boxShadow = '0 0 0 3px rgba(63, 81, 181, 0.1)'
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = '#e6e6e6'
                    e.target.style.boxShadow = 'none'
                  }}
                />
              </div>

              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', color: '#111', fontWeight: '600', marginBottom: '8px', fontSize: '14px' }}>
                  Phone Number
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="+977 98********"
                  style={{
                    width: '100%',
                    padding: '12px 14px',
                    border: '1px solid #e6e6e6',
                    borderRadius: '8px',
                    fontSize: '14px',
                    fontFamily: 'Poppins, sans-serif',
                    boxSizing: 'border-box',
                    transition: 'all 200ms'
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = '#3f51b5'
                    e.target.style.boxShadow = '0 0 0 3px rgba(63, 81, 181, 0.1)'
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = '#e6e6e6'
                    e.target.style.boxShadow = 'none'
                  }}
                />
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', color: '#111', fontWeight: '600', marginBottom: '8px', fontSize: '14px' }}>
                  Message
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Tell us about your travel plans..."
                  required
                  rows="5"
                  style={{
                    width: '100%',
                    padding: '12px 14px',
                    border: '1px solid #e6e6e6',
                    borderRadius: '8px',
                    fontSize: '14px',
                    fontFamily: 'Poppins, sans-serif',
                    boxSizing: 'border-box',
                    resize: 'vertical',
                    transition: 'all 200ms'
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = '#3f51b5'
                    e.target.style.boxShadow = '0 0 0 3px rgba(63, 81, 181, 0.1)'
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = '#e6e6e6'
                    e.target.style.boxShadow = 'none'
                  }}
                />
              </div>

              <button
                type="submit"
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  background: '#e91e63',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '24px',
                  fontWeight: '700',
                  fontSize: '15px',
                  cursor: 'pointer',
                  transition: 'all 200ms',
                  boxShadow: '0 8px 16px rgba(233, 30, 99, 0.25)',
                  fontFamily: 'Poppins, sans-serif'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)'
                  e.currentTarget.style.boxShadow = '0 12px 24px rgba(233, 30, 99, 0.35)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)'
                  e.currentTarget.style.boxShadow = '0 8px 16px rgba(233, 30, 99, 0.25)'
                }}
              >
                {submitted ? '✓ Message Sent!' : 'Send Message'}
              </button>

              {submitted && (
                <p style={{
                  marginTop: '12px',
                  color: '#4caf50',
                  fontSize: '14px',
                  fontWeight: '600',
                  textAlign: 'center'
                }}>
                  Thank you! We'll get back to you soon.
                </p>
              )}
            </form>
          </div> */}

          {/* Social Media Section */}
          <div>
            <h2 style={{ color: '#fff', fontSize: '22px', fontWeight: '700', marginBottom: '18px' }}>Connect With Us</h2>
            <div style={{
              background: '#fff',
              borderRadius: '12px',
              padding: '24px',
              boxShadow: '0 8px 18px rgba(0,0,0,0.08)',
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap: '12px',
              height: 'fit-content'
            }}>
              {socialLinks.map((social, idx) => (
                <a
                  key={idx}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '10px',
                    padding: '18px',
                    background: social.color,
                    border: '1px solid rgba(255,255,255,0.2)',
                    borderRadius: '10px',
                    textDecoration: 'none',
                    color: '#fff',
                    fontWeight: '600',
                    fontSize: '14px',
                    transition: 'all 200ms',
                    cursor: 'pointer'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = social.hoverColor
                    e.currentTarget.style.transform = 'translateY(-4px)'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = social.color
                    e.currentTarget.style.transform = 'translateY(0)'
                  }}
                >
                  <img src={social.icon} alt={social.name} style={{ width: '36px', height: '36px', objectFit: 'contain' }} />
                    <span>{social.name}</span>
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
