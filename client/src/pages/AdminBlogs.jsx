import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

const API = import.meta.env.VITE_API_URL || 'http://localhost:4000'
function authHeaders(){ const t = localStorage.getItem('admin_token'); return t?{ Authorization:`Bearer ${t}` }:{} }

export default function AdminBlogs(){
  const nav = useNavigate()
  const [blogs, setBlogs] = useState([])
  const [form, setForm] = useState({ _id:'', title:'', excerpt:'', thumb:'', date:'', author:'', content:'' })
  const [msg, setMsg] = useState('')

  useEffect(()=>{
    if (!localStorage.getItem('admin_token')) return nav('/admin/login')
    fetch(`${API}/api/blogs`).then(r=>r.json()).then(setBlogs)
  }, [])

  async function save(e){
    e.preventDefault()
    const method = form._id? 'PUT':'POST'
    const url = form._id? `${API}/api/blogs/${form._id}`:`${API}/api/blogs`
    const res = await fetch(url, { method, headers:{ 'Content-Type':'application/json', ...authHeaders() }, body: JSON.stringify(form) })
    if (!res.ok) return setMsg('Save failed')
    setForm({ _id:'', title:'', excerpt:'', thumb:'', date:'', author:'', content:'' })
    setMsg('Saved')
    const list = await fetch(`${API}/api/blogs`).then(r=>r.json())
    setBlogs(list)
  }

  async function del(id){ await fetch(`${API}/api/blogs/${id}`, { method:'DELETE', headers:authHeaders() }); setBlogs(b=>b.filter(x=>x._id!==id)); setMsg('Deleted') }
  function edit(b){ setForm({...b}) }

  return (
    <div className="admin-page">
      <h2>Blogs</h2>
      {msg && <div className="muted">{msg}</div>}
      <form onSubmit={save} style={{display:'grid',gap:8,maxWidth:700}}>
        <input placeholder="Title" value={form.title} onChange={e=>setForm({...form,title:e.target.value})} />
        <input placeholder="Excerpt" value={form.excerpt} onChange={e=>setForm({...form,excerpt:e.target.value})} />
        <input placeholder="Thumb path" value={form.thumb} onChange={e=>setForm({...form,thumb:e.target.value})} />
        <input placeholder="Author" value={form.author} onChange={e=>setForm({...form,author:e.target.value})} />
        <input placeholder="Date" value={form.date} onChange={e=>setForm({...form,date:e.target.value})} />
        <textarea placeholder="Content" rows={6} value={form.content} onChange={e=>setForm({...form,content:e.target.value})} />
        <div style={{display:'flex',gap:8}}>
          <button className="btn" type="submit">Save</button>
          <button className="btn" type="button" onClick={()=>setForm({ _id:'', title:'', excerpt:'', thumb:'', date:'', author:'', content:'' })}>Clear</button>
        </div>
      </form>

      <div style={{marginTop:16}}>
        {blogs.map(b=> (
          <div className="admin-list-item" key={b._id} style={{marginTop:8}}>
            <div>
              <strong>{b.title}</strong>
              <div className="muted">{b.excerpt}</div>
            </div>
            <div style={{display:'flex',gap:8}}>
              <button className="btn" onClick={()=>edit(b)}>Edit</button>
              <button className="btn" onClick={()=>del(b._id)}>Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
