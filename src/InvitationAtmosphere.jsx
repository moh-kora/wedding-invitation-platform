import React,{useEffect,useRef,useState} from 'react';
import './soundcloud.css';

const TRACK='https://soundcloud.com/girlssongs/adeelah-ya-baidah?si=5285f611b0b34086ad9c44d0cf5ae5af&utm_source=clipboard&utm_medium=text&utm_campaign=social_sharing';
const EMBED=`https://w.soundcloud.com/player/?url=${encodeURIComponent(TRACK)}&color=%238e1832&auto_play=false&hide_related=true&show_comments=false&show_user=false&show_reposts=false&show_teaser=false&visual=false`;

export default function InvitationAtmosphere(){
  const iframeRef=useRef(null); const [playing,setPlaying]=useState(false);
  useEffect(()=>{
    const iframe=iframeRef.current; if(!iframe)return;
    const onMessage=e=>{if(typeof e.data!=='string')return; if(e.data.includes('PLAY'))setPlaying(true); if(e.data.includes('PAUSE')||e.data.includes('FINISH'))setPlaying(false)};
    window.addEventListener('message',onMessage); return()=>window.removeEventListener('message',onMessage);
  },[]);
  useEffect(()=>{
    const nodes=[...document.querySelectorAll('.j-page main section,.j-page .j-nav')];
    nodes.forEach((el,i)=>{el.classList.add('j-reveal');el.style.setProperty('--reveal-delay',`${Math.min(i,8)*55}ms`)});
    const io=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('is-visible');io.unobserve(e.target)}}),{threshold:.12});
    nodes.forEach(n=>io.observe(n)); return()=>io.disconnect();
  },[]);
  const toggle=()=>{const w=iframeRef.current?.contentWindow;if(!w)return;w.postMessage(JSON.stringify({method:'toggle'}),'*');setPlaying(v=>!v)};
  return <>
    <div className="j-floating-petals" aria-hidden="true">{Array.from({length:14},(_,i)=><span key={i}>✦</span>)}</div>
    <div className="sc-music-shell" aria-label="Wedding music">
      <button className={`sc-music-button ${playing?'playing':''}`} onClick={toggle} aria-label={playing?'Pause wedding music':'Play wedding music'}>{playing?'Ⅱ':'♫'}</button>
      <span className="sc-music-label">{playing?'Playing':'Wedding music'}</span>
      <a className="sc-music-credit" href={TRACK} target="_blank" rel="noreferrer">SoundCloud</a>
      <iframe ref={iframeRef} className="sc-music-embed" title="Wedding music" allow="autoplay" src={EMBED}/>
    </div>
  </>;
}
