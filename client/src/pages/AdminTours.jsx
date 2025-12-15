import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

const API = import.meta.env.VITE_API_URL || 'http://localhost:4000'
function authHeaders(){ const t = localStorage.getItem('admin_token'); return t?{ Authorization:`Bearer ${t}` }:{} }

export default function AdminTours(){
  const nav = useNavigate()
  const [tours, setTours] = useState([])
  const [form, setForm] = useState({ _id:'', title:'', img:'', desc:'', price:0, days:1, location:'', trending:false, upcoming:false, photos: [], details: { expenses: '', itinerary: [] } })
  const [photoUrl, setPhotoUrl] = useState('')
  const [itineraryItem, setItineraryItem] = useState('')
  const [msg, setMsg] = useState('')

  useEffect(()=>{
    if (!localStorage.getItem('admin_token')) return nav('/admin/login')
    fetch(`${API}/api/tours`).then(r=>r.json()).then(setTours)
  }, [])

  async function save(e){
    e.preventDefault()
    // client-side validation
    if (!form.title || !form.img || !form.desc || !form.location) {
      return setMsg('Please fill Title, Image, Description and Location before saving')
    }
    const method = form._id? 'PUT':'POST'
    const url = form._id? `${API}/api/tours/${form._id}`:`${API}/api/tours`
    const res = await fetch(url, { method, headers:{ 'Content-Type':'application/json', ...authHeaders() }, body: JSON.stringify(form) })
    if (!res.ok) return setMsg('Save failed')
    setForm({ _id:'', title:'', img:'', desc:'', price:0, days:1, location:'', trending:false, upcoming:false, photos: [], details: { expenses: '', itinerary: [] } })
    setMsg('Saved')
    setTours(await fetch(`${API}/api/tours`).then(r=>r.json()))
  }

  async function del(id){ await fetch(`${API}/api/tours/${id}`, { method:'DELETE', headers:authHeaders() }); setTours(t=>t.filter(x=>x._id!==id)); setMsg('Deleted') }
  function edit(t){ setForm({...t}) }

  return (
    <div className="admin-page">
      <h2>Tours</h2>
      {msg && <div className="muted">{msg}</div>}
      <form onSubmit={save} style={{display:'grid',gap:8,maxWidth:700}}>
        <input placeholder="Title" value={form.title} onChange={e=>setForm({...form,title:e.target.value})} />
        <textarea placeholder="Description" value={form.desc} onChange={e=>setForm({...form, desc: e.target.value})} rows={5} />
        <input placeholder="Image path" value={form.img} onChange={e=>setForm({...form,img:e.target.value})} />
        <div style={{display:'flex',gap:8}}>
          <input type="number" placeholder="Price" value={form.price} onChange={e=>setForm({...form,price:Number(e.target.value)})} />
          <input type="number" placeholder="Days" value={form.days} onChange={e=>setForm({...form,days:Number(e.target.value)})} />
          <input placeholder="Location" value={form.location} onChange={e=>setForm({...form,location:e.target.value})} />
          <input value={form.details?.expenses || ''} onChange={e=>setForm({...form, details: { ...(form.details||{}), expenses: e.target.value }})} placeholder="Expenses (what's included)" />
          <div style={{display:'flex',gap:8,alignItems:'center'}}>
            <input value={photoUrl} onChange={e=>setPhotoUrl(e.target.value)} placeholder="Add photo URL" />
            <button type="button" className="btn" onClick={()=>{
              if(!photoUrl) return;
              setForm(f=>({ ...f, photos: [...(f.photos||[]), photoUrl] }));
              setPhotoUrl('')
            }}>Add Photo</button>
          </div>
          {form.photos && form.photos.length>0 && (
            <div style={{display:'flex',gap:8,flexWrap:'wrap'}}>
              {form.photos.map((p,i)=> (
                <div key={i} style={{background:'#fff',padding:6,borderRadius:8}}>
                  <img src={p} alt={`p-${i}`} style={{height:56,width:80,objectFit:'cover',borderRadius:6}} />
                  <div>
                    <button className="btn" type="button" onClick={()=>setForm(f=>({ ...f, photos: f.photos.filter((_,idx)=>idx!==i) }))}>Remove</button>
                  </div>
                </div>
              ))}
            </div>
          )}
          <div style={{display:'flex',gap:8,alignItems:'center'}}>
            <input value={itineraryItem} onChange={e=>setItineraryItem(e.target.value)} placeholder="Add itinerary item" />
            <button type="button" className="btn" onClick={()=>{
              if(!itineraryItem) return;
              setForm(f=>({ ...f, details: { ...(f.details||{}), itinerary: [...((f.details&&f.details.itinerary)||[]), itineraryItem] } }));
              setItineraryItem('')
            }}>Add Itinerary Item</button>
          </div>
          {form.details?.itinerary && form.details.itinerary.length>0 && (
            <ol>
              {form.details.itinerary.map((it,i)=> (
                <li key={i}>{it} <button className="btn" type="button" onClick={()=>setForm(f=>({ ...f, details: { ...(f.details||{}), itinerary: f.details.itinerary.filter((_,idx)=>idx!==i) } }))}>Remove</button></li>
              ))}
            </ol>
          )}
        </div>
        <label className="admin-label"><input type="checkbox" checked={form.trending} onChange={e=>setForm({...form, trending:e.target.checked})} /> Trending</label>
        <label className="admin-label"><input type="checkbox" checked={form.upcoming} onChange={e=>setForm({...form, upcoming:e.target.checked})} /> Upcoming</label>
        <div style={{display:'flex',gap:8}}>
          <button className="btn" type="submit">Save</button>
          <button className="btn" type="button" onClick={()=>setForm({ _id:'', title:'', img:'', price:0, days:1, location:'', trending:false, upcoming:false })}>Clear</button>
        </div>
      </form>

      <div style={{marginTop:16}}>
        {tours.map(t=> (
          <div key={t._id} className="admin-list-item" style={{marginTop:8}}>
            <div>
              <strong>{t.title}</strong>
              <div className="muted">Price: {t.price}</div>
            </div>
            <div style={{display:'flex',gap:8}}>
              <button className="btn" onClick={()=>edit(t)}>Edit</button>
              <button className="btn" onClick={()=>del(t._id)}>Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
