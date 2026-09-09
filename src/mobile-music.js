/* Mobile-safe SoundCloud playback.
 * The invitation's Open Invitation button is the explicit user gesture used
 * to start the background track on iPhone/Safari and Android browsers.
 */
(function(){
  const SDK='https://w.soundcloud.com/player/api.js';
  let widget=null;
  let sdkLoaded=false;
  let pendingPlay=false;

  function frame(){return document.querySelector('.sc-music-embed');}

  function init(){
    const f=frame();
    if(!f || !window.SC || !SC.Widget || widget)return;
    try{
      widget=SC.Widget(f);
      widget.bind(SC.Widget.Events.READY,function(){
        if(pendingPlay) play();
      });
    }catch(e){widget=null;}
  }

  function play(){
    pendingPlay=true;
    if(!widget)init();
    if(widget){try{widget.play();}catch(e){}}
  }

  function load(){
    if(window.SC && SC.Widget){sdkLoaded=true;init();return;}
    if(document.querySelector('script[data-sc-widget-api]'))return;
    const s=document.createElement('script');
    s.src=SDK;
    s.async=true;
    s.dataset.scWidgetApi='true';
    s.onload=function(){sdkLoaded=true;init();if(pendingPlay)play();};
    document.head.appendChild(s);
  }

  function activateFromOpenButton(){
    pendingPlay=true;
    load();
    play();
    setTimeout(play,80);
    setTimeout(play,400);
    setTimeout(play,1000);
  }

  function bindButton(){
    const btn=document.querySelector('.j-entry-button');
    if(!btn || btn.dataset.musicBound==='true')return;
    btn.dataset.musicBound='true';
    /* This handler runs directly from the user's tap — the gesture Safari needs. */
    btn.addEventListener('pointerup',activateFromOpenButton,{passive:true});
    btn.addEventListener('touchend',activateFromOpenButton,{passive:true});
    btn.addEventListener('click',activateFromOpenButton,{passive:true});
  }

  function boot(){
    load();
    bindButton();
    new MutationObserver(function(){
      bindButton();
      if(!widget && frame() && sdkLoaded)init();
    }).observe(document.documentElement,{childList:true,subtree:true});
  }

  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});
  else boot();
})();
