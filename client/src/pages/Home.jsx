import React, { useEffect, useState } from 'react'
import Banner from '../components/Banner'
import TravelCard from '../components/TravelCard'
import { buildWhatsAppLink } from '../constants/whatsapp'
import { getBlogSlug } from '../utils/tourSlug'
import Footer from '../components/Footer'

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

const HOME_REVIEWS = [
  {
    name: 'FARZANA KHAN',
    initials: 'FK',
    location: 'Kathmandu, Nepal',
    trip: 'Mohini Jharna hike',
    message: 'I did the Mohini Jharna hike yesterday with Batuwa. The two guides were very friendly and supportive and the group was very nice . The hike itself was scenic and everything was organized well . Thank you Batuwa.',
  },
  {
    name: 'Aarakshya Pokharel',
    initials: 'AP',
    location: 'Kathmandu, Nepal',
    trip: 'DHORPATAN TREK',
    message: 'Had a great trip to Dhorpatan with Batuwa. Everything was well managed, and the overall experience was really good. A big thank you to our guide, Denji Dai, who was friendly, helpful, and always there whenever anyone needed anything. He made sure everyone was comfortable and enjoying the trip. Thanks to the whole Batuwa team for making it such a memorable experience. Looking forward to joining another trip soon!',
  },
  {
    name: 'Bishnu Gurung',
    initials: 'BG',
    location: 'Kathmandu, Nepal',
    trip: 'Langtang Valley Trek',
    message: 'I had an amazing experience with Batuwa Trip. Everything was well organized, the team was friendly and supportive, and the trip was fun from start to finish. Highly recommended for anyone who loves traveling and making great memories.Thank you, Batuwa Trip, for such a wonderful experience. The itinerary was well planned, the guides were helpful, Looking forward to joining more …❤️🥰',
  },
]

function ReviewContent({ review, featured = false }) {
  return (
    <>
      <div className="home-review-card__reviewer">
        <span className="home-review-card__avatar" aria-hidden="true">{review.initials}</span>
        <div>
          <h3>{review.name}</h3>
          <span className="home-review-card__verified">✓ Verified Trail Review</span>
        </div>
      </div>
      <div className="home-review-card__meta">
        <span>{review.location}</span>
        <span aria-hidden="true">·</span>
        <span>{review.trip}</span>
      </div>
      <div className="home-review-card__stars" aria-label="5 out of 5 stars">★★★★★</div>
      <blockquote>{review.message}</blockquote>
      <div className="home-review-card__trip">{featured ? 'Featured journey' : review.trip}</div>
    </>
  )
}

export default function Home() {
  const [tours, setTours] = useState([])
  const [blogs, setBlogs] = useState([])
  const [currentBlogIndex, setCurrentBlogIndex] = useState(0)
  useEffect(() => {
    // Fetch tours in display order (uses display-settings endpoint)
    fetch(`${API}/api/display-settings/tours`)
      .then(r => {
        if (!r.ok) {
          console.error('Failed to fetch tours:', r.status, r.statusText)
          throw new Error(`Failed to fetch tours: ${r.status}`)
        }
        return r.json()
      })
      .then(data => {
        console.log('Fetched tours from backend:', data.length, 'tours')
        // Backend already filters to published and orders them
        if (data.length > 0) {
          setTours(data.map(d => ({ ...d, id: d.id || d._id })))
        } else {
          console.warn('⚠️ No published tours found!')
          setTours([])
        }
      })
      .catch((error) => {
        console.error('Error fetching tours:', error)
        setTours([])
      })
    
    // Fetch blogs in display order (uses display-settings endpoint)
    fetch(`${API}/api/display-settings/blogs`)
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
          // Backend already orders them - show max 4
          const sortedBlogs = data
            .map(d => ({ ...d, id: d.id || d._id, slug: d.slug || getBlogSlug(d.title) }))
            .slice(0, 4) // Show max 4 blogs
          setBlogs(sortedBlogs)
        } else {
          setBlogs([])
        }
      })
      .catch((error) => {
        console.error('Error fetching blogs:', error)
        setBlogs([])
      })
    
  }, [])

  // Filter only published tours with flags
  const trips = tours.filter(t => (t.trending || t.upcoming) && t.status === 'published')
  const visibleTrips = trips.slice(0, 3)
  const nav = useNavigate()

  // Blog carousel - show 4 max, latest first, navigate with arrows
  const latestBlogs = blogs // Already sorted latest first and limited to 4
  const nextBlog = () => {
    setCurrentBlogIndex((prev) => (prev + 1) % latestBlogs.length)
  }
  const prevBlog = () => {
    setCurrentBlogIndex((prev) => (prev - 1 + latestBlogs.length) % latestBlogs.length)
  }
  
  return (
    <div className="home-page">
      <Banner />

      <section id="trips" className="section section--trips">
        <div className="section__heading trips-header">
          <div className="trips-header__title-wrap">
            <span className="trips-header__dot" aria-hidden="true" />
            <h2 className="section__title section__title--strong">Trips</h2>
          </div>
          <a
            className="btn btn--pink trips-header__cta"
            href={buildWhatsAppLink('Hi, I would like to customize a trip.')}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Customize a trip via WhatsApp"
          >
            Customize Trip
          </a>
        </div>
        <p className="trips-header__subtitle">Choose from authentic weekend getaways, cultural jeep safaris, or bucket-list Himalayan passes led by virtual local trail marshals.</p>
        {visibleTrips.length === 0 ? (
          <div style={{ padding: '40px', textAlign: 'center', color: 'rgba(255,255,255,0.7)' }}>
            <p>Loading.... Please Wait</p>
          </div>
        ) : (
          <div className="grid grid--cards trips-grid">
            {visibleTrips.map(t => (
              <TravelCard key={t.id} tour={t} />
            ))}
          </div>
        )}
        {trips.length > 3 && (
          <div className="trips-see-more-wrap">
            <button className="btn btn--secondary trips-see-more" onClick={()=>{ nav('/trips/all') }}>
              See More
            </button>
          </div>
        )}
      </section>

      <section className="section section--tight latest-blogs">
        <div className="latest-blogs__header">
          <div className="latest-blogs__heading">
            <h2 className="latest-blogs__title">Latest Blogs</h2>
            <span className="latest-blogs__subtitle">Stories From Our Travelers</span>
          </div>
          <button className="latest-blogs__all" onClick={() => nav('/blogs')}>All</button>
        </div>

        {latestBlogs.length === 0 ? (
          <div style={{ padding: '40px', textAlign: 'center', color: 'rgba(255,255,255,0.7)' }}>
            <p>No blogs available yet. Check back soon!</p>
          </div>
        ) : (() => {
          const featuredBlog = latestBlogs[currentBlogIndex] || latestBlogs[0]
          const secondaryBlogs = latestBlogs.filter((blog, index) => index !== currentBlogIndex).slice(0, 2)
          const blogImage = (blog) => blog?.thumb
            ? (blog.thumb.startsWith('http') ? blog.thumb : (blog.thumb.startsWith('/') ? blog.thumb : `/images/${blog.thumb}`))
            : '/images/placeholder.jpg'
          const readTime = (blog) => {
            const wordCount = (blog?.excerpt || '').split(/\s+/).filter(Boolean).length || 120
            return Math.max(3, Math.ceil(wordCount / 150))
          }

          return (
            <>
              <div className="latest-blogs__layout">
                <article
                  className="latest-blogs__featured"
                  onClick={() => nav(`/blog/${featuredBlog?.slug || getBlogSlug(featuredBlog?.title)}`)}
                  aria-label={`Open featured blog: ${featuredBlog?.title}`}
                >
                  <div className="latest-blogs__featured-topbar">
                    <div className="latest-blogs__brandmark">b</div>
                    <div className="latest-blogs__brand-copy">
                      <div className="latest-blogs__brand-name">Batuwa Trip</div>
                      <div className="latest-blogs__brand-slogan">"BE A PART • A FEW TRAIL"</div>
                    </div>
                  </div>
                  <div className="latest-blogs__featured-image-wrap">
                    <img
                      src={blogImage(featuredBlog)}
                      alt={featuredBlog?.title}
                      onError={(e) => {
                        e.target.src = '/images/placeholder.jpg'
                      }}
                    />
                    <div className="latest-blogs__featured-badge">TRAVEL</div>
                    <div className="latest-blogs__featured-overlay-title">TRAVEL WITH BATUWA</div>
                  </div>
                  <div className="latest-blogs__featured-body">
                    <h3>{featuredBlog?.title}</h3>
                    <div className="latest-blogs__meta-row">
                      <span className="latest-blogs__tag">{featuredBlog?.category || 'Travel Story'}</span>
                      <span>{featuredBlog?.date}</span>
                      <span>•</span>
                      <span>{readTime(featuredBlog)} min read</span>
                    </div>
                    <p>{featuredBlog?.excerpt}</p>
                  </div>
                </article>

                <div className="latest-blogs__rail">
                  {secondaryBlogs.map((blog) => (
                    <article
                      key={blog.id || blog._id || blog.title}
                      className="latest-blogs__rail-item"
                      onClick={() => nav(`/blog/${blog?.slug || getBlogSlug(blog?.title)}`)}
                      aria-label={`Open blog: ${blog?.title}`}
                    >
                      <img
                        src={blogImage(blog)}
                        alt={blog?.title}
                        onError={(e) => {
                          e.target.src = '/images/placeholder.jpg'
                        }}
                      />
                      <div className="latest-blogs__rail-copy">
                        <div className="latest-blogs__tag latest-blogs__tag--small">{blog?.category || 'Travel Story'}</div>
                        <h3>{blog?.title}</h3>
                        <div className="latest-blogs__meta-row latest-blogs__meta-row--small">
                          <span>{blog?.date}</span>
                        </div>
                        <p>{blog?.excerpt}</p>
                      </div>
                    </article>
                  ))}
                </div>
              </div>

              {false && latestBlogs.length > 1 && (
                <div className="latest-blogs__nav" aria-label="Blog navigation">
                  <button
                    type="button"
                    className="latest-blogs__nav-btn"
                    onClick={(e) => {
                      e.stopPropagation()
                      prevBlog()
                    }}
                    aria-label="Previous blog"
                  >
                    ‹
                  </button>
                  <button
                    type="button"
                    className="latest-blogs__nav-btn"
                    onClick={(e) => {
                      e.stopPropagation()
                      nextBlog()
                    }}
                    aria-label="Next blog"
                  >
                    ›
                  </button>
                </div>
              )}
            </>
          )
        })()}
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

      <section className="section home-reviews" aria-labelledby="home-reviews-title">
        <div className="home-reviews__heading">
          <div>
            <span className="home-reviews__eyebrow">Stories from the trail</span>
            <h2 id="home-reviews-title" className="home-reviews__title">Loved by travelers</h2>
            <p className="home-reviews__subtitle">Real moments from guests who explored Nepal with Batuwa Trip.</p>
          </div>
          <a
            className="home-reviews__google-link"
            href="https://www.google.com/maps/place/Batuwa+Trip/@27.6902412,85.3184684,17z/data=!4m8!3m7!1s0x39eb1975c1914f29:0x109032dfd4792095!8m2!3d27.6902365!4d85.3210433!9m1!1b1!16s%2Fg%2F11j8xh15bp?entry=ttu&g_ep=EgoyMDI1MTIwOS4wIKXMDSoASAFQAw%3D%3D"
            target="_blank"
            rel="noopener noreferrer"
          >
            Read all reviews
          </a>
        </div>

        <div className="home-reviews__stage">
          <article className="home-review-card home-review-card--side home-review-card--left">
            <ReviewContent review={HOME_REVIEWS[1]} />
          </article>
          <article className="home-review-card home-review-card--featured">
            <div className="home-review-card__story">Stories</div>
            <ReviewContent review={HOME_REVIEWS[0]} featured />
          </article>
          <article className="home-review-card home-review-card--side home-review-card--right">
            <ReviewContent review={HOME_REVIEWS[2]} />
          </article>
        </div>
      </section>
      <Footer />
    </div>
  )
}
