/* Mobile-safe SoundCloud background music.
 * Browsers may block autoplay, so the invitation's first real touch/click
 * is used to call the SoundCloud Widget API directly on the embedded player.
 */
(function(){
  const SDK='https://w.soundcloud.com/player/api.js';
  let widget=null;
  let sdkReady=false;
  let userInteracted=false;

  function getFrame(){return document.querySelector('.sc-music-embed');}

  function init(){
    const frame=getFrame();
    if(!frame || !window.SC || !SC.Widget)return;
    try{
      widget=SC.Widget(frame);
      widget.bind(SC.Widget.Events.READY,function(){
        if(userInteracted) play();
      });
    }catch(e){}
  }

  function play(){
    if(!widget)return;
    try{widget.play();}catch(e){}
  }

  function loadSDK(){
    if(window.SC && SC.Widget){sdkReady=true;init();return;}
    if(document.querySelector('script[data-sc-widget-api]'))return;
    const s=document.createElement('script');
    s.src=SDK;
    s.async=true;
    s.dataset.scWidgetApi='true';
    s.onload=function(){sdkReady=true;init();};
    document.head.appendChild(s);
  }

  function activate(){
    userInteracted=true;
    loadSDK();
    if(widget)play();
    setTimeout(function(){if(widget)play();},100);
    setTimeout(function(){if(widget)play();},500);
    setTimeout(function(){if(widget)play();},1200);
  }

  function boot(){
    loadSDK();
    document.addEventListener('pointerdown',activate,{passive:true,once:true});
    document.addEventListener('touchstart',activate,{passive:true,once:true});
    document.addEventListener('click',activate,{passive:true,once:true});
  }

  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});
  else boot();

  new MutationObserver(function(){
    if(!widget && getFrame() && sdkReady)init();
  }).observe(document.documentElement,{childList:true,subtree:true});
})();
