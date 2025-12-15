import React, { useState, useEffect } from 'react'

const images = [
  '/images/1765290625930.JPG',
  '/images/1765290625942.JPG',
  '/images/1765290625950.jpg',
  '/images/1765290626003.jpg',
]

// Hero with subtle auto-rotation but fixed overlay text to match design
export default function Banner() {
  const [idx, setIdx] = useState(0)

  useEffect(() => {
    const t = setInterval(() => setIdx(i => (i + 1) % images.length), 4000)
    return () => clearInterval(t)
  }, [])

  return (
    <section className="hero">
      <div
        className="hero__image"
        style={{ backgroundImage: `url(${images[idx]})` }}
      >
        <div className="hero__overlay">
          <p className="hero__eyebrow">Travel</p>
          <h1 className="hero__title">TRAVEL WITH BATUWA</h1>
        </div>
      </div>
    </section>
  )
}
