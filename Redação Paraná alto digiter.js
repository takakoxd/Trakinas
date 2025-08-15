if(!document.getElementById("trak_splash")){
  // === Splash ===
  const splash=document.createElement("div");
  splash.id="trak_splash";
  splash.style.cssText=`position:fixed;top:0;left:0;width:100%;height:100%;background:black;display:flex;flex-direction:column;justify-content:center;align-items:center;z-index:999999;transition:opacity 0.5s;`;
  splash.innerHTML=`
    <div style="font-size:60px;font-weight:bold;color:#ff0;text-shadow:0 0 15px #ff0;">Trakinas</div>
    <div style="margin-top:20px;font-size:30px;color:#ff0;text-shadow:0 0 10px #ff0;">Tava com saudades né?</div>
  `;
  document.body.appendChild(splash);

  setTimeout(()=>{
    splash.style.opacity="0";
    setTimeout(()=>{splash.remove(); initGui();},500);
  },1700);
}

// === GUI ===
function initGui(){
  if(document.getElementById("trak_gui")) return;

  const style=document.createElement("style");
  style.innerHTML=`
  #trak_gui{position:fixed;top:50px;left:50px;width:320px;background:rgba(0,0,0,0.85);border:2px solid #ff0;border-radius:12px;box-shadow:0 0 15px #ff0;color:#ff0;font-family:monospace;padding:12px;display:flex;flex-direction:column;align-items:center;z-index:999999;user-select:none;opacity:1;transition:all 0.3s ease;}
  #trak_topbar{width:100%;cursor:grab;margin-bottom:8px;display:flex;align-items:center;}
  #trak_topbar img{width:50px;height:50px;border-radius:50%;border:2px solid #ff0;margin-right:8px;}
  #trak_topbar div{font-weight:bold;font-size:16px;}
  #trak_text{width:95%;padding:10px;margin-bottom:8px;background:black;color:#ff0;border:2px solid #ff0;border-radius:8px;font-size:16px;height:50px;}
  #trak_speed{-webkit-appearance:none;width:95%;height:14px;border-radius:8px;background:rgba(0,0,0,0.85);border:2px solid #ff0;margin-bottom:8px;outline:none;}
  #trak_speed::-webkit-slider-thumb{-webkit-appearance:none;appearance:none;width:20px;height:20px;background:#ff0;cursor:pointer;border-radius:50%;border:2px solid #000;}
  #trak_speed::-moz-range-thumb{width:20px;height:20px;background:#ff0;cursor:pointer;border-radius:50%;border:2px solid #000;}
  #trak_gui button{background:black;border:1px solid #ff0;color:#ff0;border-radius:8px;padding:6px;cursor:pointer;margin-bottom:8px;width:95%;}
  #trak_gui button:hover{background:#222;}
  #trak_status{height:20px;text-align:center;margin-top:4px;}
  #trak_min_btn{position:fixed;top:10px;right:10px;width:50px;height:50px;border-radius:12px;border:2px solid #ff0;box-shadow:0 0 10px #ff0;background:black;color:#ff0;font-size:30px;font-weight:bold;display:flex;align-items:center;justify-content:center;cursor:pointer;z-index:999998;transition:all 0.3s ease;}
  #trak_min_btn:hover{box-shadow:0 0 20px #ff0;transform:scale(1.1);}
  `;
  document.head.appendChild(style);

  const gui=document.createElement("div");
  gui.id="trak_gui";
  gui.innerHTML=`
    <div id="trak_topbar">
      <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSpvy6dOcEctXK6BMdTVyC6lb5vsaWX74gg5jk2cRr1tte1IDiqOyRmd6k&s"/>
      <div>Trakinas</div>
    </div>
    <input type="text" id="trak_text" placeholder="Digite aqui..."/>
    <input type="range" id="trak_speed" min="25" max="50" step="1" value="50"/>
    <div>Velocidade: <span id="trak_speed_val">50</span>ms</div>
    <button id="auto_type">Auto Digitar</button>
    <div id="trak_status"></div>
  `;
  document.body.appendChild(gui);

  const textInput=document.getElementById("trak_text");
  const autoBtn=document.getElementById("auto_type");
  const status=document.getElementById("trak_status");
  const slider=document.getElementById("trak_speed");
  const speedValue=document.getElementById("trak_speed_val");

  slider.addEventListener("input",()=>{speedValue.textContent=slider.value;});

  // === Auto digitar no campo externo após 1.9s para selecionar ===
  autoBtn.onclick=function(){
    status.textContent="⏳ Clique no campo em 1.9s";
    let countdown=1.9;
    const targetField={el:null};

    const focusListener=e=>{targetField.el=e.target;};
    document.addEventListener("focus",focusListener,true);

    const timer=setInterval(()=>{
      countdown-=0.1;
      status.textContent=countdown>0?"⏳ Selecione o campo: "+countdown.toFixed(1)+"s":"Digitando...";
      if(countdown<=0){
        clearInterval(timer);
        document.removeEventListener("focus",focusListener,true);
        if(!targetField.el){
          status.textContent="⚠️ Nenhum campo selecionado!";
          setTimeout(()=>{status.textContent="";},2000);
          return;
        }
        const text=textInput.value;
        let idx=0;
        const speed=parseInt(slider.value);
        function typeChar(){
          if(idx<text.length){
            const active=targetField.el;
            const start=active.selectionStart||0;
            const end=active.selectionEnd||0;
            const val=active.value;
            active.value=val.slice(0,start)+text[idx]+val.slice(end);
            active.selectionStart=active.selectionEnd=start+1;
            active.dispatchEvent(new Event('input',{bubbles:true}));
            idx++;
            setTimeout(typeChar,speed);
          } else {
            status.textContent="✅ Concluído";
            setTimeout(()=>{status.textContent="";},2000);
          }
        }
        typeChar();
      }
    },100);
  };

  // === Botão minimizar flutuante com fade ===
  const minBtn=document.createElement("div");
  minBtn.id="trak_min_btn";
  minBtn.textContent="+";
  document.body.appendChild(minBtn);

  let minimized=false;
  minBtn.onclick=()=>{
    minimized=!minimized;
    if(minimized){
      gui.style.opacity="0";
      setTimeout(()=>{gui.style.display="none";},300);
    } else {
      gui.style.display="flex";
      setTimeout(()=>{gui.style.opacity="1";},10);
    }
  };

  // === Arrastar apenas pelo topbar ===
  const topbar=document.getElementById("trak_topbar");
  let dx,dy,dragging=false;
  topbar.addEventListener("mousedown",e=>{
    dragging=true;
    dx=e.clientX-gui.offsetLeft;
    dy=e.clientY-gui.offsetTop;
  });
  document.addEventListener("mousemove",e=>{
    if(dragging){
      gui.style.left=e.clientX-dx+"px";
      gui.style.top=e.clientY-dy+"px";
    }
  });
  document.addEventListener("mouseup",()=>dragging=false);

  topbar.addEventListener("touchstart",e=>{
    dragging=true;
    dx=e.touches[0].clientX-gui.offsetLeft;
    dy=e.touches[0].clientY-gui.offsetTop;
  },{passive:true});
  document.addEventListener("touchmove",e=>{
    if(dragging){
      gui.style.left=e.touches[0].clientX-dx+"px";
      gui.style.top=e.touches[0].clientY-dy+"px";
    }
  },{passive:true});
  document.addEventListener("touchend",()=>dragging=false);
                             }
