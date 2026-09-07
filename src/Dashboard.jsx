import React, { useMemo, useState } from 'react';
import { ArrowLeft, BarChart3, CalendarDays, Check, ExternalLink, Heart, LogOut, Mail, Plus, Users } from 'lucide-react';

const AUTH_KEY = 'everly-auth';
const DEMO_INVITATION = { id:'demo', bride:'Jasmine', groom:'Omar', date:'2026-10-18', time:'18:00', venue:'Dubai Opera', status:'Published', rsvps:[
  {name:'Sarah Ahmed', attending:true, guests:2, note:'Can’t wait!'},
  {name:'Omar Hassan', attending:true, guests:1, note:''},
  {name:'Mariam Ali', attending:false, guests:1, note:'Thank you for inviting me.'}
] };

export function getAuth(){try{return JSON.parse(localStorage.getItem(AUTH_KEY)||'null')}catch{return null}}
export function setAuth(user){localStorage.setItem(AUTH_KEY,JSON.stringify(user))}
export function clearAuth(){localStorage.removeItem(AUTH_KEY)}

export default function Dashboard({onCreate,onOpen,onBack}){
 const [user,setUser]=useState(getAuth());
 if(!user)return <AuthScreen onSuccess={u=>{setAuth(u);setUser(u)}} onBack={onBack}/>;
 return <DashboardHome user={user} onCreate={onCreate} onOpen={onOpen} onLogout={()=>{clearAuth();setUser(null)}} onBack={onBack}/>;
}

function AuthScreen({onSuccess,onBack}){
 const [mode,setMode]=useState('login'); const [name,setName]=useState(''); const [email,setEmail]=useState(''); const [password,setPassword]=useState(''); const [error,setError]=useState('');
 const submit=e=>{e.preventDefault(); if(!email||!password||(mode==='signup'&&!name)){setError('Please complete all required fields.');return} onSuccess({name:name||email.split('@')[0],email})};
 return <div className="auth-shell"><header className="auth-top"><button className="back-link" onClick={onBack}><ArrowLeft size={16}/> Back to Everly</button><div className="brand"><span className="brand-mark">E</span><span>Everly</span></div><span/></header><div className="auth-card"><div className="eyebrow">EVERLY ACCOUNT</div><h1>{mode==='login'?'Welcome back.':'Create your Everly account.'}</h1><p>{mode==='login'?'Manage your invitations, guests and RSVPs in one place.':'Save invitations permanently and manage every guest from your dashboard.'}</p><form onSubmit={submit}>{mode==='signup'&&<label className="field"><span>Full name</span><input value={name} onChange={e=>setName(e.target.value)} placeholder="Your name"/></label>}<label className="field"><span>Email</span><input type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="you@example.com"/></label><label className="field"><span>Password</span><input type="password" value={password} onChange={e=>setPassword(e.target.value)} placeholder="••••••••"/></label>{error&&<div className="auth-error">{error}</div>}<button className="primary-btn auth-submit">{mode==='login'?'Log in':'Create account'}</button></form><button className="auth-switch" onClick={()=>{setMode(mode==='login'?'signup':'login');setError('')}}>{mode==='login'?"Don't have an account? Sign up":"Already have an account? Log in"}</button><small className="auth-note">Demo authentication is active now. Supabase Auth will replace this local session when the project credentials are connected.</small></div></div>
}

function DashboardHome({user,onCreate,onOpen,onLogout,onBack}){
 const [invitation]=useState(()=>{try{return {...DEMO_INVITATION,...JSON.parse(localStorage.getItem('everly-draft')||'{}')}}catch{return DEMO_INVITATION}});
 const stats=useMemo(()=>{const r=invitation.rsvps||[];return {responses:r.length,attending:r.filter(x=>x.attending).length,guests:r.filter(x=>x.attending).reduce((n,x)=>n+Number(x.guests||1),0)}},[invitation]);
 const slug=`${(invitation.bride||'jasmine').toLowerCase().replace(/[^a-z0-9]+/g,'-')}-${(invitation.groom||'omar').toLowerCase().replace(/[^a-z0-9]+/g,'-')}`;
 return <div className="dashboard-shell"><header className="dashboard-top"><button className="back-link" onClick={onBack}><ArrowLeft size={16}/> Everly</button><div className="brand"><span className="brand-mark">E</span><span>Everly</span></div><div className="dashboard-user"><span>{user.name}</span><button onClick={onLogout} title="Log out"><LogOut size={16}/></button></div></header><main className="dashboard-main"><div className="dashboard-heading"><div><div className="eyebrow">YOUR DASHBOARD</div><h1>Good to see you, {user.name.split(' ')[0]}.</h1><p>Create, publish and keep track of every guest response.</p></div><button className="primary-btn" onClick={onCreate}><Plus size={17}/> Create invitation</button></div><div className="stat-grid"><Stat icon={<BarChart3/>} label="Responses" value={stats.responses}/><Stat icon={<Check/>} label="Attending" value={stats.attending}/><Stat icon={<Users/>} label="Guests" value={stats.guests}/><Stat icon={<CalendarDays/>} label="Status" value={invitation.status||'Draft'}/></div><section className="dashboard-section"><div className="section-title"><h2>Your invitations</h2><span>1 invitation</span></div><article className="invitation-row"><div className="mini-cover"><Heart size={22} fill="currentColor"/></div><div className="inv-info"><h3>{invitation.bride||'Jasmine'} & {invitation.groom||'Omar'}</h3><p><CalendarDays size={13}/> {invitation.date||'2026-10-18'} · {invitation.venue||'Dubai Opera'}</p><span className="published-badge"><i/> {invitation.status||'Published'}</span></div><div className="row-actions"><button className="outline-btn" onClick={onOpen}><ExternalLink size={14}/> Open</button><button className="outline-btn" onClick={onOpen}>Edit</button></div></article></section><section className="dashboard-section"><div className="section-title"><h2>Recent RSVPs</h2><span>{stats.responses} responses</span></div><div className="rsvp-table">{(invitation.rsvps||[]).map((r,i)=><div className="rsvp-row" key={i}><div className="guest-avatar">{r.name.charAt(0)}</div><div className="guest-info"><strong>{r.name}</strong><span>{r.note||'No message'}</span></div><div className={`rsvp-status ${r.attending?'yes':'no'}`}>{r.attending?'Attending':'Declined'}</div><div className="guest-count">{r.guests} {r.guests===1?'guest':'guests'}</div></div>)}</div></section><div className="dashboard-footer-note"><Mail size={15}/> RSVP management is ready for Supabase persistence once backend credentials are connected.</div></main></div>
}
function Stat({icon,label,value}){return <div className="stat-card"><div className="stat-icon">{icon}</div><span>{label}</span><strong>{value}</strong></div>}
