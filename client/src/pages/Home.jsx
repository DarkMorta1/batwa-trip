import React, { useEffect, useState } from 'react'
import Banner from '../components/Banner'
import TravelCard from '../components/TravelCard'
import localTours from '../data/tours'
import localBlogs from '../data/blogs'
import { buildWhatsAppLink } from '../constants/whatsapp'

const API = import.meta.env.VITE_API_URL || 'http://localhost:4000'
import { useNavigate } from 'react-router-dom'

const memoryPhotos = [
  '/images/1765290625930.JPG',
  '/images/1765290625942.JPG',
  '/images/1765290625950.jpg',
  '/images/1765290625960.jpg',
  '/images/1765290625968.jpg',
  '/images/1765290625980.jpg',
]

export default function Home() {
  const [tours, setTours] = useState(localTours)
  const [blogs, setBlogs] = useState(localBlogs)
  const [reviews, setReviews] = useState([])
  const [showReviewForm, setShowReviewForm] = useState(false)
  const [reviewForm, setReviewForm] = useState({ author:'', rating:5, message:'' })
  const [reviewMessage, setReviewMessage] = useState('')
  const [showAllUpcoming, setShowAllUpcoming] = useState(false)
  const [showAllAvailable, setShowAllAvailable] = useState(false)
  const [showAllReviews, setShowAllReviews] = useState(false)
  const [currentBlogIndex, setCurrentBlogIndex] = useState(0)
  useEffect(() => {
    // Fetch published tours only - backend filters this automatically for public routes
    fetch(`${API}/api/tours`)
      .then(r => {
        if (!r.ok) {
          console.error('Failed to fetch tours:', r.status, r.statusText)
          throw new Error(`Failed to fetch tours: ${r.status}`)
        }
        return r.json()
      })
      .then(data => {
        console.log('Fetched tours from backend:', data.length, 'tours')
        // Backend already filters to published, but double-check for safety
        const publishedTours = data.filter(t => t.status === 'published')
        console.log('Published tours:', publishedTours.length)
        
        if (publishedTours.length > 0) {
          setTours(publishedTours.map(d => ({ ...d, id: d.id || d._id })))
        } else {
          console.warn('⚠️ No published tours found!')
          console.warn('   The backend returned', data.length, 'tours, but none are published.')
          console.warn('   Solution: Go to /admin/tours and set tour status to "Published"')
          // Keep local data as fallback if no published tours
          if (data.length === 0) {
            console.warn('   No tours in database at all. Using local fallback data.')
          }
        }
      })
      .catch((error) => {
        console.error('Error fetching tours:', error)
        // Keep local data as fallback
        console.warn('Using local tour data as fallback')
      })
    
    // Fetch all blogs
    fetch(`${API}/api/blogs`)
      .then(r => {
        if (!r.ok) {
          console.error('Failed to fetch blogs:', r.status)
          throw new Error(`Failed to fetch blogs: ${r.status}`)
        }
        return r.json()
      })
      .then(data => {
        console.log('Fetched blogs from backend:', data.length, 'blogs')
        if (data.length > 0) {
          // Sort by createdAt (newest first) and take latest 3
          const sortedBlogs = data
            .map(d => ({ ...d, id: d.id || d._id }))
            .sort((a, b) => {
              const dateA = new Date(a.createdAt || a.date || 0)
              const dateB = new Date(b.createdAt || b.date || 0)
              return dateB - dateA
            })
            .slice(0, 3)
          setBlogs(sortedBlogs)
        }
      })
      .catch((error) => {
        console.error('Error fetching blogs:', error)
        console.warn('Using local blog data as fallback')
      })
    
    // Fetch approved reviews only - backend filters this automatically for public routes
    fetch(`${API}/api/reviews?approved=true`)
      .then(r => {
        if (!r.ok) {
          console.error('Failed to fetch reviews:', r.status)
          throw new Error(`Failed to fetch reviews: ${r.status}`)
        }
        return r.json()
      })
      .then(data => {
        console.log('Fetched reviews from backend:', data.length, 'reviews')
        // Backend already filters to approved and not hidden, but double-check
        const visibleReviews = data.filter(r => r.approved && !r.hidden)
        console.log('Visible reviews:', visibleReviews.length)
        setReviews(visibleReviews)
      })
      .catch((error) => {
        console.error('Error fetching reviews:', error)
        console.warn('Reviews could not be loaded')
      })
  }, [])

  // Filter only published tours with flags
  const trending = tours.filter(t => t.trending && t.status === 'published')
  const upcoming = tours.filter(t => t.upcoming && t.status === 'published')
  const visibleUpcoming = showAllUpcoming ? upcoming : upcoming.slice(0, 3)
  const visibleAvailable = showAllAvailable ? trending : trending.slice(0, 3)
  const nav = useNavigate()

  // Slideshow functions for blogs
  const latestBlogs = blogs.slice(0, 3)
  const nextBlog = () => {
    setCurrentBlogIndex((prev) => (prev + 1) % latestBlogs.length)
  }
  const prevBlog = () => {
    setCurrentBlogIndex((prev) => (prev - 1 + latestBlogs.length) % latestBlogs.length)
  }

  // Auto-advance slideshow
  useEffect(() => {
    if (latestBlogs.length <= 1) return
    const interval = setInterval(() => {
      setCurrentBlogIndex((prev) => (prev + 1) % latestBlogs.length)
    }, 5000) // Change slide every 5 seconds
    return () => clearInterval(interval)
  }, [latestBlogs.length])
  
  return (
    <div className="home-page">
      <Banner />

      <section className="section">
        <h2 className="section__title section__title--strong">Upcoming Trips</h2>
        <div style={{margin:'8px 0 16px', textAlign:'right'}}>
          <a
            className="btn btn--pink"
            href={buildWhatsAppLink('Hi, I would like to customize a trip.')}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Customize a trip via WhatsApp"
          >
            Customize Trip
          </a>
        </div>
        {visibleUpcoming.length === 0 ? (
          <div style={{ padding: '40px', textAlign: 'center', color: 'rgba(255,255,255,0.7)' }}>
            <p>No upcoming trips available. Check back soon!</p>
            <p style={{ fontSize: '14px', marginTop: '8px' }}>
              Admin: Make sure tours are set to "Published" status and "Upcoming" flag in the admin panel.
            </p>
          </div>
        ) : (
          <div className="grid grid--cards">
            {visibleUpcoming.map(t => (
              <TravelCard key={t.id} tour={t} />
            ))}
          </div>
        )}
        {upcoming.length > 3 && (
          <div style={{textAlign:'center', marginTop:16}}>
            <button className="btn" onClick={()=>setShowAllUpcoming(s => !s)}>
              {showAllUpcoming ? 'Show Less' : 'Show More'}
            </button>
          </div>
        )}
      </section>

      <section className="section">
        <h2 className="section__title section__title--strong">Available Trips</h2>
        {visibleAvailable.length === 0 ? (
          <div style={{ padding: '40px', textAlign: 'center', color: 'rgba(255,255,255,0.7)' }}>
            <p>No available trips at the moment. Check back soon!</p>
            <p style={{ fontSize: '14px', marginTop: '8px' }}>
              Admin: Make sure tours are set to "Published" status and "Trending" flag in the admin panel.
            </p>
          </div>
        ) : (
          <div className="grid grid--cards">
            {visibleAvailable.map(tour => (
              <TravelCard key={tour.id} tour={tour} />
            ))}
          </div>
        )}
        {trending.length > 3 && (
          <div style={{textAlign:'center', marginTop:16}}>
            <button className="btn" onClick={()=>setShowAllAvailable(s => !s)} style={{minHeight:'44px',padding:'12px 20px'}}>
              {showAllAvailable ? 'Show Less' : 'Show More'}
            </button>
          </div>
        )}
      </section>


     
       <section className="section section--tight">
        <div className="section__heading">
          <div>
            <h2 className="section__title section__title--pink">Latest Blogs</h2>
            <span className="section__subtitle">Stories from our travelers</span>
          </div>
          <div className="pager">
            <button className="pager__btn" onClick={() => nav('/blogs')}>All</button>
          </div>
        </div>

        {latestBlogs.length === 0 ? (
          <div style={{ padding: '40px', textAlign: 'center', color: 'rgba(255,255,255,0.7)' }}>
            <p>No blogs available yet. Check back soon!</p>
          </div>
        ) : (
          <div style={{ position: 'relative', width: '100%', overflow: 'hidden' }}>
            {/* Slideshow Container */}
            <div 
              style={{ 
                display: 'flex', 
                transition: 'transform 0.5s ease-in-out',
                transform: `translateX(-${currentBlogIndex * 100}%)`,
                width: `${latestBlogs.length * 100}%`
              }}
            >
              {latestBlogs.map((b, index) => (
                <div
                  key={b.id}
                  style={{ 
                    minWidth: `${100 / latestBlogs.length}%`,
                    width: `${100 / latestBlogs.length}%`,
                    flexShrink: 0,
                    padding: '0 8px'
                  }}
                >
                  <article 
                    className="mini-blog" 
                    onClick={() => nav(`/blog/${b.id}`)}
                    style={{ 
                      cursor: 'pointer',
                      background: '#fff',
                      borderRadius: '12px',
                      overflow: 'hidden',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                      height: '100%'
                    }}
                  >
                    <img 
                      src={b.thumb?.startsWith('http') ? b.thumb : (b.thumb?.startsWith('/') ? b.thumb : `/images/${b.thumb || 'placeholder.jpg'}`)} 
                      alt={b.title}
                      style={{ width: '100%', height: '200px', objectFit: 'cover' }}
                      onError={(e) => {
                        e.target.src = '/images/placeholder.jpg'
                      }}
                    />
                    <div style={{ padding: '16px' }}>
                      <h3 style={{margin: '8px 0 4px', fontSize: 15, fontWeight: 'bold'}}>{b.title}</h3>
                      <p className="muted" style={{fontSize:13, margin:0, lineHeight: '1.4'}}>{b.excerpt}</p>
                      <p className="meta" style={{marginTop:8, fontSize: '12px', color: '#999'}}>{b.date} • {b.author}</p>
                    </div>
                  </article>
                </div>
              ))}
            </div>

            {/* Navigation Buttons */}
            {latestBlogs.length > 1 && (
              <>
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    prevBlog()
                  }}
                  style={{
                    position: 'absolute',
                    left: '10px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'rgba(0, 0, 0, 0.6)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '50%',
                    width: '44px',
                    height: '44px',
                    minWidth: '44px',
                    minHeight: '44px',
                    fontSize: '20px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 10,
                    transition: 'background 0.2s',
                    touchAction: 'manipulation'
                  }}
                  onMouseEnter={(e) => e.target.style.background = 'rgba(0, 0, 0, 0.8)'}
                  onMouseLeave={(e) => e.target.style.background = 'rgba(0, 0, 0, 0.6)'}
                  aria-label="Previous blog"
                >
                  ‹
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    nextBlog()
                  }}
                  style={{
                    position: 'absolute',
                    right: '10px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'rgba(0, 0, 0, 0.6)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '50%',
                    width: '44px',
                    height: '44px',
                    minWidth: '44px',
                    minHeight: '44px',
                    fontSize: '20px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 10,
                    transition: 'background 0.2s',
                    touchAction: 'manipulation'
                  }}
                  onMouseEnter={(e) => e.target.style.background = 'rgba(0, 0, 0, 0.8)'}
                  onMouseLeave={(e) => e.target.style.background = 'rgba(0, 0, 0, 0.6)'}
                  aria-label="Next blog"
                >
                  ›
                </button>

                {/* Dots Indicator */}
                <div style={{
                  display: 'flex',
                  justifyContent: 'center',
                  gap: '8px',
                  marginTop: '16px',
                  position: 'relative',
                  zIndex: 5
                }}>
                  {latestBlogs.map((_, index) => (
                    <button
                      key={index}
                      onClick={(e) => {
                        e.stopPropagation()
                        setCurrentBlogIndex(index)
                      }}
                      style={{
                        width: currentBlogIndex === index ? '24px' : '8px',
                        height: '8px',
                        borderRadius: '4px',
                        border: 'none',
                        background: currentBlogIndex === index ? '#ff5a5f' : 'rgba(255, 255, 255, 0.5)',
                        cursor: 'pointer',
                        transition: 'all 0.3s',
                        padding: 0,
                        touchAction: 'manipulation'
                      }}
                      aria-label={`Go to blog ${index + 1}`}
                    />
                  ))}
                </div>
              </>
            )}
          </div>
        )}
      </section> 
 {/* Review KO FORM 
      <section className="section">
        <div className="section__heading">
          <div>
            <h2 className="section__title section__title--pink">Send us your valuable feedback</h2>
            <span className="section__subtitle">Share your experience — we read every message</span>
          </div>
        </div>

        <div className="review-section-grid" style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:24,alignItems:'start'}}>
          {/* Feedback form card */}
          {/* <div style={{background:'#fff',padding:20,borderRadius:12,boxShadow:'0 12px 30px rgba(2,6,23,0.2)'}}>
            <p style={{margin:0,color:'#666',fontSize:14}}>We'd love to hear from you — tell us what went well and what we can improve.</p>
            <form onSubmit={async (e)=>{
                e.preventDefault()
                setReviewMessage('')
                try{
                  const res = await fetch(`${API}/api/reviews`, { method: 'POST', headers: { 'Content-Type':'application/json' }, body: JSON.stringify(reviewForm) })
                  if (!res.ok) return setReviewMessage('Failed to submit feedback')
                  setReviewForm({ author:'', rating:5, message:'' })
                  setReviewMessage('Thank you for your feedback.')
                }catch(err){
                  setReviewMessage('Error submitting feedback')
                }
              }} style={{display:'grid',gap:12,marginTop:16}}>
              <input value={reviewForm.author} onChange={e=>setReviewForm({...reviewForm, author:e.target.value})} placeholder="Your name" style={{padding:12,borderRadius:8,border:'1px solid #e6e6e6',fontSize:14}} />
              <input value={reviewForm.email || ''} onChange={e=>setReviewForm({...reviewForm, email:e.target.value})} placeholder="Email (optional)" style={{padding:12,borderRadius:8,border:'1px solid #e6e6e6',fontSize:14}} />
              <div style={{display:'flex',alignItems:'center',gap:12}}>
                <div style={{display:'flex',gap:6}}>
                  {[1,2,3,4,5].map(i=> (
                    <button type="button" key={i} onClick={()=>setReviewForm(f=>({ ...f, rating: i }))} style={{background:'transparent',border:'none',cursor:'pointer',fontSize:22,color: i <= (reviewForm.rating||0) ? '#ffd166' : '#cfcfcf'}} aria-label={`${i} star`}>
                      {i <= (reviewForm.rating||0) ? '★' : '☆'}
                    </button>
                  ))}
                </div>
                <div style={{fontSize:13,color:'#999'}}>{reviewForm.rating} / 5</div>
              </div>
              <textarea value={reviewForm.message} onChange={e=>setReviewForm({...reviewForm, message:e.target.value})} placeholder="Tell us about your experience" rows={5} style={{padding:12,borderRadius:8,border:'1px solid #e6e6e6',fontSize:16,resize:'vertical',minHeight:'120px'}} />

              <div style={{display:'flex',gap:12}}>
                  <button className="btn btn--pink" type="submit" style={{flex:1,minHeight:'44px',padding:'12px 20px'}}>Send Feedback</button>
                <button type="button" className="btn" onClick={()=>{ setReviewForm({ author:'', rating:5, message:'' }); setReviewMessage('') }} style={{minHeight:'44px',padding:'12px 20px'}}>Reset</button>
              </div>
              {reviewMessage && <div style={{marginTop:8,color:'#4caf50',fontWeight:600}}>{reviewMessage}</div>}
            </form>
          </div> */}

          {/* Right column: image and recent reviews */}
          {/* <aside>
            <div style={{background:'#fff',padding:16,borderRadius:12,boxShadow:'0 8px 18px rgba(2,6,23,0.08)'}}>
              <h4 style={{margin:'0 0 8px 0'}}>Recent reviews</h4>
              {reviews.length===0 && <div className="muted">No reviews yet</div>}
              {(showAllReviews ? reviews : reviews.slice(0,4)).map(rv=> (
                <div key={rv._id} style={{padding:10,borderRadius:8,background:'#fafafa',marginTop:8}}>
                  <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
                    <div style={{fontWeight:700}}>{rv.author}</div>
                    <div style={{color:'#ffd166'}}>{'★'.repeat(Math.max(0, Math.min(5, Math.round(rv.rating || 0))))}</div>
                  </div>
                  <div style={{fontSize:13,color:'#333',marginTop:8}}>{rv.message}</div>
                </div>
              ))}

              {reviews.length > 4 && (
                <div style={{textAlign:'center', marginTop:12}}>
                  <button className="btn" onClick={()=>setShowAllReviews(s=>!s)}>
                    {showAllReviews ? 'Show Less' : 'Show More'}
                  </button>
                </div>
              )}
            </div>
          </aside>
        </div>
      </section> */}

      {/* New review */}
      <section className="section">
  <div className="section__heading">
    <div>
      <h2 className="section__title section__title--pink">Send us your valuable feedback</h2>
      <span className="section__subtitle">Share your experience — we read every message</span>
    </div>
  </div>
  <br></br>
  <div className="review-section-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, alignItems: 'start' }}>
    {/* Feedback button card */}
    <div style={{ background: '#fff', padding: 20, borderRadius: 12, boxShadow: '0 12px 30px rgba(2,6,23,0.2)' }}>
      <p style={{ margin: 0, color: '#666', fontSize: 14 }}>We'd love to hear from you</p>

      {/* "Review Us" Button */}
      <div style={{ marginTop: 16 }}>
        <a
          href="https://www.google.com/maps/place/Batuwa+Trip/@27.6902412,85.3184684,17z/data=!4m8!3m7!1s0x39eb1975c1914f29:0x109032dfd4792095!8m2!3d27.6902365!4d85.3210433!9m1!1b1!16s%2Fg%2F11j8xh15bp?entry=ttu&g_ep=EgoyMDI1MTIwOS4wIKXMDSoASAFQAw%3D%3D"  // Replace this with the actual Google review link for your company
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: 'inline-block',
            padding: '12px 24px',
            backgroundColor: '#ff5a5f', // Button color (you can change this)
            color: '#fff',
            fontWeight: '700',
            fontSize: '16px',
            borderRadius: '8px',
            textAlign: 'center',
            textDecoration: 'none',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
            transition: 'background-color 0.3s, transform 0.2s',
            width: 'auto',
            cursor: 'pointer',
          }}
          onMouseEnter={(e) => e.target.style.backgroundColor = '#e2494f'} // Darker color on hover
          onMouseLeave={(e) => e.target.style.backgroundColor = '#ff5a5f'} // Original color on mouse leave
          onClick={() => window.location.href = "https://www.google.com/maps/place/Batuwa+Trip/@27.6902412,85.3184684,17z/data=!4m8!3m7!1s0x39eb1975c1914f29:0x109032dfd4792095!8m2!3d27.6902365!4d85.3210433!9m1!1b1!16s%2Fg%2F11j8xh15bp?entry=ttu&g_ep=EgoyMDI1MTIwOS4wIKXMDSoASAFQAw%3D%3D"}  // Ensure it's a Google Review link
        >
          Review Us
        </a>
      </div>
    </div>

  </div>
</section>
    </div>
  )
}
