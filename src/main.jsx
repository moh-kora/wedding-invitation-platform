import React, { useState } from 'react';
import { createRoot } from 'react-dom/client';
import { ArrowRight, CalendarDays, Check, Globe2, Heart, Play, Sparkles } from 'lucide-react';
import './styles.css';

const features = [
  ['Personalized', 'Names, dates, venue, story and schedule — all in one elegant invitation.'],
  ['Mobile-first', 'Designed to feel beautiful on every phone, where guests actually open it.'],
  ['Easy to share', 'One beautiful link for WhatsApp, Instagram, email and anywhere else.'],
];

function App() {
  const [lang, setLang] = useState('EN');
  const [demoOpen, setDemoOpen] = useState(false);

  const ar = lang === 'AR';
  return (
    <main dir={ar ? 'rtl' : 'ltr'}>
      <nav className="nav shell">
        <div className="brand"><span className="brand-mark">E</span><span>Everly</span></div>
        <div className="nav-links"><a href="#templates">Templates</a><a href="#features">Features</a><a href="#how">How it works</a></div>
        <div className="nav-actions">
          <button className="language" onClick={() => setLang(ar ? 'EN' : 'AR')}><Globe2 size={16}/>{lang}</button>
          <button className="outline-btn" onClick={() => setDemoOpen(true)}>Preview</button>
          <button className="primary-btn">Create invitation <ArrowRight size={16}/></button>
        </div>
      </nav>

      <section className="hero shell">
        <div className="hero-copy">
          <div className="eyebrow"><Sparkles size={14}/> {ar ? 'دعوتك، لكن بطريقة مختلفة' : 'Your moment, beautifully invited'}</div>
          <h1>{ar ? 'حوّل يومكم الكبير إلى تجربة لا تُنسى.' : 'Turn your big day into an unforgettable experience.'}</h1>
          <p>{ar ? 'دعوات زفاف رقمية فاخرة، مصممة بقلب ومشاركة في ثوانٍ.' : 'Luxury digital wedding invitations, thoughtfully designed and effortless to share.'}</p>
          <div className="hero-actions"><button className="primary-btn large">Create your invitation <ArrowRight size={18}/></button><button className="text-btn" onClick={() => setDemoOpen(true)}><span className="play"><Play size={13} fill="currentColor"/></span> See how it works</button></div>
          <div className="trust"><div className="avatars"><i/><i/><i/><i/></div><span>Made for modern couples</span><span className="dot">•</span><span>Simple. Elegant. Yours.</span></div>
        </div>
        <div className="hero-card-wrap">
          <div className="hero-card shadow-card">
            <div className="card-image"><div className="sun">J</div></div>
            <div className="card-body"><div className="small-caps">WE ARE GETTING MARRIED</div><h2>Jasmine <em>&</em> Omar</h2><div className="line"/><div className="date"><CalendarDays size={16}/> 18 · 10 · 2026</div><div className="place">Dubai · United Arab Emirates</div><button className="card-link">Open invitation</button></div>
          </div>
          <div className="floating-note"><Heart size={14} fill="currentColor"/> Your story starts here.</div>
        </div>
      </section>

      <section className="strip"><div className="shell strip-inner"><span>ONE LINK</span><b>→</b><span>YOUR STORY</span><b>→</b><span>YOUR DAY</span><b>→</b><span>FOREVER</span></div></section>

      <section id="features" className="section shell"><div className="section-heading"><div><div className="eyebrow">BUILT AROUND YOU</div><h2>Everything your invitation needs.</h2></div><p>Not just an online card. A polished guest experience that feels personal from the first tap.</p></div><div className="feature-grid">{features.map(([title, text], i) => <article className="feature" key={title}><span>0{i+1}</span><h3>{title}</h3><p>{text}</p></article>)}</div></section>

      <section id="templates" className="templates"><div className="shell"><div className="section-heading"><div><div className="eyebrow">THE COLLECTION</div><h2>Choose a feeling. Make it yours.</h2></div><button className="outline-btn">View all templates</button></div><div className="template-grid"><div className="template t1"><div className="template-label">Editorial</div><div className="template-names">Lina <span>&</span> Adam</div></div><div className="template t2"><div className="template-label">Romantic</div><div className="template-names">Sara <span>&</span> Zaid</div></div><div className="template t3"><div className="template-label">Minimal</div><div className="template-names">Maya <span>&</span> Omar</div></div></div></div></section>

      <section id="how" className="section shell how"><div className="eyebrow">HOW IT WORKS</div><h2>From idea to invitation in minutes.</h2><div className="steps"><div><strong>01</strong><h3>Pick a design</h3><p>Start with a style that matches your celebration.</p></div><div><strong>02</strong><h3>Add your details</h3><p>Names, dates, venue, story, RSVP and more.</p></div><div><strong>03</strong><h3>Share your link</h3><p>Send one beautiful invitation to every guest.</p></div></div></section>

      <footer className="footer"><div className="shell footer-inner"><div className="brand"><span className="brand-mark">E</span><span>Everly</span></div><span>Made for the moments that matter.</span><span>© 2026 Everly</span></div></footer>

      {demoOpen && <div className="modal-backdrop" onClick={() => setDemoOpen(false)}><div className="modal" onClick={e => e.stopPropagation()}><button className="close" onClick={() => setDemoOpen(false)}>×</button><div className="modal-preview"><Sparkles size={22}/><h2>Jasmine & Omar</h2><p>18 October 2026 · Dubai</p><button className="primary-btn">Open invitation</button></div></div></div>}
    </main>
  );
}

createRoot(document.getElementById('root')).render(<App />);
