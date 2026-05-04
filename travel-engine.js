var txMyList=[], txCurF='all', txSpots=[], txData={};

/* 데이터 주입 - 각 글에서 호출 */
function txInit(data){
  txData=data; txSpots=data.spots; txMyList=[]; txCurF='all';
  /* 헤더 */
  document.getElementById('txTitle').innerHTML=data.title;
  document.getElementById('txSubtitle').textContent=data.subtitle||'';
  document.getElementById('txBadge').textContent=data.badge||'🍁 슬기로운 캐나다 생활';
  /* 지도 */
  document.getElementById('txMapIframe').src='https://www.google.com/maps/d/embed?mid='+data.mapId+'&ehbc=2E312F';
  /* 지도 안내 */
  var guides=data.mapGuide||[
    {icon:'📍',t:'핀 클릭하면',d:'구글 사진·리뷰·정보 팝업. 실제 방문자 후기 확인.'},
    {icon:'🔢',t:'지도 번호 = 카드 번호',d:'지도 핀 번호와 아래 카드 번호가 일치합니다.'}
  ];
  document.getElementById('txMapGuide').innerHTML=guides.map(function(g){
    return '<div class="tx-mg"><span class="tx-mg-i">'+g.icon+'</span><div><span class="tx-mg-t">'+g.t+'</span><span class="tx-mg-d">'+g.d+'</span></div></div>';
  }).join('');
  /* 필터 */
  var filters=data.filters||[
    {f:'all',l:'🗺️ 전체',c:''},
    {f:'summer',l:'☀️ 여름',c:'fsu'},
    {f:'fall',l:'🍂 가을',c:'ffa'},
    {f:'winter',l:'❄️ 겨울',c:'fwi'},
    {f:'family',l:'👨‍👩‍👧‍👦 가족',c:''},
    {f:'hiking',l:'🥾 하이킹·카누',c:''},
    {f:'ski',l:'⛷️ 스키',c:'fsk'},
    {f:'photo',l:'📸 사진·뷰',c:''},
    {f:'drive',l:'🚗 드라이브',c:''},
    {f:'food',l:'🍜 한식·일식',c:'ffo'}
  ];
  var fhtml='<span class="tx-fglabel">시즌</span><div class="tx-fgrow">';
  filters.filter(function(f){return ['all','summer','fall','winter'].indexOf(f.f)!==-1;}).forEach(function(f){
    fhtml+='<div class="tx-fbtn '+(f.c||'')+' '+(f.f==='all'?'on':'')+'" data-f="'+f.f+'" onclick="txFilt(this)">'+f.l+'</div>';
  });
  fhtml+='</div><span class="tx-fglabel">스타일</span><div class="tx-fgrow">';
  filters.filter(function(f){return ['all','summer','fall','winter'].indexOf(f.f)===-1;}).forEach(function(f){
    fhtml+='<div class="tx-fbtn '+(f.c||'')+'" data-f="'+f.f+'" onclick="txFilt(this)">'+f.l+'</div>';
  });
  fhtml+='</div>';
  document.getElementById('txFilters').innerHTML=fhtml;
  /* 앱 표시 */
  document.getElementById('tx-app').style.display='block';
  txRender();
}

function txFilt(btn){
  txCurF=btn.getAttribute('data-f');
  document.querySelectorAll('#txFilters .tx-fbtn').forEach(function(b){b.classList.remove('on');});
  btn.classList.add('on');
  txRender();
}

function txRender(){
  var grid=document.getElementById('txGrid');
  grid.innerHTML=''; var count=0;
  txSpots.forEach(function(s){
    if(txCurF!=='all'&&s.tags.indexOf(txCurF)===-1)return;
    count++;
    var nc=s.cat==='food'?'food':s.cat==='ski'?'ski':s.cat==='drive'?'drv':'';
    var ccl=s.cat==='food'?'tx-cf':s.cat==='ski'?'tx-ck':s.cat==='drive'?'tx-cd':'tx-cs';
    var clb=s.cat==='food'?'🍽️ 식당·카페':s.cat==='ski'?'⛷️ 스키장':s.cat==='drive'?'🚗 드라이브':'📍 명소';
    var isOn=txMyList.some(function(x){return x.num===s.num;});
    var acts='';
    if(s.activities&&s.activities.length){
      acts='<div class="tx-acticons">';
      s.activities.forEach(function(a){acts+='<div class="tx-aic">'+(a==='canoe'?'🛶':'⛷️')+'</div>';});
      acts+='</div>';
    }
    var tags=s.badges.map(function(b){return '<span class="tx-ctag" style="background:'+b[1]+';color:'+b[2]+'">'+b[0]+'</span>';}).join('');
    var card=document.createElement('div');
    card.className='tx-card';
    card.innerHTML=
      '<div class="tx-ciw">'
        +'<img class="tx-cimg" src="'+(s.img||'')+'" alt="'+s.title+'" loading="lazy">'
        +'<div class="tx-cph" id="txPh'+s.num+'">'+s.emoji+'</div>'
        +'<div class="tx-nbadge '+nc+'">'+s.num+'</div>'
        +acts
        +'<button class="tx-wish'+(isOn?' on':'')+'" id="txW'+s.num+'">'+(isOn?'✓':'＋')+'</button>'
      +'</div>'
      +'<div class="tx-cbody">'
        +'<span class="tx-ccat '+ccl+'">'+clb+'</span>'
        +'<span class="tx-ctitle">'+s.emoji+' '+s.title+'</span>'
        +'<span class="tx-csub">'+s.sub+'</span>'
        +'<div class="tx-ctags">'+tags+'</div>'
        +'<div class="tx-cinfo">'
          +'<div class="tx-ci"><span class="tx-cil">'+s.info[0][0]+'</span><span class="tx-civ">'+s.info[0][1]+'</span></div>'
          +'<div class="tx-ci"><span class="tx-cil">'+s.info[2][0]+'</span><span class="tx-civ">'+s.info[2][1]+'</span></div>'
        +'</div>'
        +'<span class="tx-cdesc">'+s.desc.substring(0,72)+'...</span>'
        +'<div class="tx-cft">'
          +'<div style="display:flex;gap:4px">'
            +'<a class="tx-gbtn" href="'+s.url+'" target="_blank">지도</a>'
            +(s.officialUrl?'<a class="tx-gbtn tx-obtn" href="'+s.officialUrl+'" target="_blank">공식</a>':'')
          +'</div>'
          +(s.diff?'<span class="tx-diff">'+s.diff+'</span>':'')
        +'</div>'
      +'</div>';
    var img=card.querySelector('.tx-cimg');
    (function(n){img.onerror=function(){this.style.display='none';var ph=document.getElementById('txPh'+n);if(ph)ph.classList.add('show');};})(s.num);
    (function(sp){card.addEventListener('click',function(e){if(e.target.closest('.tx-wish')||e.target.closest('a'))return;txOpenModal(sp);});})(s);
    var wb=card.querySelector('.tx-wish');
    (function(n){function dW(e){e.stopPropagation();e.preventDefault();txToggle(n);}wb.addEventListener('click',dW);wb.addEventListener('touchend',dW,{passive:false});})(s.num);
    grid.appendChild(card);
  });
  var lbl={all:'전체',summer:'☀️ 여름',fall:'🍂 가을',winter:'❄️ 겨울',family:'👨‍👩‍👧‍👦 가족',hiking:'🥾 하이킹·카누',ski:'⛷️ 스키',photo:'📸 사진·뷰',drive:'🚗 드라이브',food:'🍜 한식·일식'}[txCurF]||'';
  document.getElementById('txCntBar').innerHTML='<strong>'+count+'개</strong> '+lbl+' 명소 표시 중';
}

function txOpenModal(s){
  var nc=s.cat==='food'?'food':s.cat==='ski'?'ski':s.cat==='drive'?'drv':'';
  var acts='';
  if(s.activities&&s.activities.length){s.activities.forEach(function(a){acts+='<span class="mact">'+(a==='canoe'?'🛶 카누 인생샷':'⛷️ 스키·스노보드')+'</span>';});}
  document.getElementById('txMIW').innerHTML='<img class="mimg" src="'+s.img+'" onerror="this.outerHTML=\'<div class=mph>'+s.emoji+'</div>\'">'+'<div class="mnum '+nc+'">'+s.num+'</div>'+(acts?'<div class="macts">'+acts+'</div>':'');
  document.getElementById('txMTitle').textContent=s.emoji+' '+s.title;
  document.getElementById('txMSub').textContent=s.sub;
  document.getElementById('txMDesc').textContent=s.desc;
  document.getElementById('txMInfo').innerHTML=s.info.map(function(x){return '<div class="mi"><span class="mi-l">'+x[0]+'</span><span class="mi-v">'+x[1]+'</span></div>';}).join('');
  document.getElementById('txMTags').innerHTML=s.badges.map(function(b){return '<span class="tx-ctag" style="background:'+b[1]+';color:'+b[2]+'">'+b[0]+'</span>';}).join('');
  var tp='';
  if(s.tips&&(s.tips.summer||s.tips.fall||s.tips.winter)){
    tp='<span class="stip-t">🗓️ 시즌별 팁</span>';
    if(s.tips.summer)tp+='<span class="stip st-s">'+s.tips.summer+'</span>';
    if(s.tips.fall)tp+='<span class="stip st-f">'+s.tips.fall+'</span>';
    if(s.tips.winter)tp+='<span class="stip st-w">'+s.tips.winter+'</span>';
  }
  document.getElementById('txMTips').innerHTML=tp;
  document.getElementById('txMFoot').innerHTML='<a class="mgmap" href="'+s.url+'" target="_blank">📍 Google Maps</a>'+(s.officialUrl?'<a class="moff" href="'+s.officialUrl+'" target="_blank">🔗 '+s.officialName+'</a>':'');
  document.getElementById('txModal').classList.add('open');
  document.body.style.overflow='hidden';
}
function txCloseModal(){document.getElementById('txModal').classList.remove('open');document.body.style.overflow='';}
document.getElementById('txModal').addEventListener('click',function(e){if(e.target===this)txCloseModal();});
document.getElementById('txMClose').addEventListener('click',txCloseModal);
document.getElementById('txMClose').addEventListener('touchend',function(e){e.preventDefault();txCloseModal();},{passive:false});

function txToggle(num){
  var s=txSpots.find(function(x){return x.num===num;});
  if(!s)return;
  var idx=txMyList.findIndex(function(x){return x.num===num;});
  var btn=document.getElementById('txW'+num);
  if(idx===-1){txMyList.push(s);if(btn){btn.innerHTML='✓';btn.classList.add('on');}}
  else{txMyList.splice(idx,1);if(btn){btn.innerHTML='＋';btn.classList.remove('on');}}
  txRenderList();
}
function txRemove(num){
  txMyList=txMyList.filter(function(x){return x.num!==num;});
  var b=document.getElementById('txW'+num);
  if(b){b.innerHTML='＋';b.classList.remove('on');}
  txRenderList();
}
function txClear(){
  txMyList.forEach(function(s){var b=document.getElementById('txW'+s.num);if(b){b.innerHTML='＋';b.classList.remove('on');}});
  txMyList=[];txRenderList();
}
function txRenderList(){
  var empty=document.getElementById('txEmpty'),items=document.getElementById('txItems'),footer=document.getElementById('txFooter'),cnt=document.getElementById('txCnt');
  if(!txMyList.length){empty.style.display='block';items.classList.remove('show');footer.classList.remove('show');cnt.style.display='none';return;}
  empty.style.display='none';items.classList.add('show');footer.classList.add('show');cnt.style.display='inline-flex';cnt.textContent=txMyList.length;
  items.innerHTML=txMyList.map(function(s){
    var nc=s.cat==='food'?'food':s.cat==='ski'?'ski':s.cat==='drive'?'drv':'';
    return '<div class="tx-item"><div class="tx-inum '+nc+'">'+s.num+'</div><div class="tx-iemoji">'+s.emoji+'</div><div class="tx-iinfo"><span class="tx-iname">'+s.title+'</span><span class="tx-isub">'+s.info[0][1]+' · '+s.info[2][1]+'</span></div><a class="tx-igmap" href="'+s.url+'" target="_blank">지도</a><button class="tx-idel" data-num="'+s.num+'">✕</button></div>';
  }).join('');
  items.querySelectorAll('.tx-idel').forEach(function(b){b.addEventListener('click',function(){txRemove(this.getAttribute('data-num'));});});
}

function txOpenPlan(){
  if(!txMyList.length){alert('먼저 명소를 선택해 주세요!');return;}
  document.getElementById('txPlanItems').innerHTML=
    '<div class="pdate-hdr"><span>📅 방문 날짜</span><input type="date" id="txPD"></div>'
    +txMyList.map(function(s){
      var nc=s.cat==='food'?'food':s.cat==='ski'?'ski':'';
      return '<div class="pitem"><div class="pih"><div class="piN '+nc+'">'+s.num+'</div><span class="piNm">'+s.emoji+' '+s.title+'</span></div>'
        +'<div class="pflds">'
        +'<div class="pfld"><label>⏰ 방문 시간</label><input type="time" id="txPT'+s.num+'"></div>'
        +'<div class="pfld ro"><label>🗺️ 지도 번호</label><input type="text" value="'+s.num+'" readonly></div>'
        +'<div class="pfld ro"><label>📍 명소명</label><input type="text" value="'+s.title+'" readonly></div>'
        +'<div class="pfld ro"><label>⏱ 소요시간</label><input type="text" value="'+s.info[2][1]+'" readonly></div>'
        +'<div class="pfld ro"><label>🎫 입장료</label><input type="text" value="'+s.info[0][1]+'" readonly></div>'
        +'<div class="pfld ro"><label>🅿️ 주차</label><input type="text" value="'+s.info[1][1]+'" readonly></div>'
        +'<div class="pfld full"><label>📝 메모</label><textarea id="txPM'+s.num+'" placeholder="준비물, 예약, 동행자 등"></textarea></div>'
        +'</div></div>';
    }).join('');
  document.getElementById('txPlan').classList.add('open');
  document.body.style.overflow='hidden';
}
function txClosePlan(){document.getElementById('txPlan').classList.remove('open');document.body.style.overflow='';}
document.getElementById('txPlan').addEventListener('click',function(e){if(e.target===this)txClosePlan();});

function _txTimelineHTML(list, dateStr, withMemo){
  return list.map(function(s,i){
    var time=(document.getElementById('txPT'+s.num)||{}).value||'';
    var memo=withMemo?((document.getElementById('txPM'+s.num)||{}).value||''):'';
    var isLast=i===list.length-1;
    return '<div style="display:flex;gap:0;align-items:stretch">'
      +'<div style="width:52px;text-align:right;padding-right:10px;padding-top:3px;flex-shrink:0">'
        +(time?'<span style="font-size:13px;font-weight:700;color:#1565C0">'+time+'</span>':'<span style="font-size:12px;color:#ccc">--:--</span>')
      +'</div>'
      +'<div style="display:flex;flex-direction:column;align-items:center;flex-shrink:0;width:20px">'
        +'<div style="width:12px;height:12px;border-radius:50%;background:#D64040;border:2.5px solid white;box-shadow:0 0 0 2px #D64040;flex-shrink:0;margin-top:3px"></div>'
        +(!isLast?'<div style="width:2px;flex:1;background:#e8e8e8;min-height:24px;margin-top:2px"></div>':'')
      +'</div>'
      +'<div style="flex:1;padding:0 0 20px 10px">'
        +'<div style="font-size:14px;font-weight:700;color:#1a1a1a;line-height:1.4;margin-bottom:3px">'
          +'<span style="display:inline-flex;align-items:center;justify-content:center;min-width:22px;height:22px;border-radius:11px;background:#D64040;color:white;font-size:10px;font-weight:700;padding:0 5px;margin-right:5px;vertical-align:middle">'+s.num+'</span>'
          +s.emoji+' '+s.title
        +'</div>'
        +(memo?'<div style="font-size:12px;color:#555;line-height:1.6;margin-bottom:4px;background:#f8f8f6;padding:5px 8px;border-radius:6px">'+memo+'</div>':'')
        +'<div style="font-size:11px;color:#bbb">'+s.info[0][1]+(s.info[2][1]?' · '+s.info[2][1]:'')+'</div>'
      +'</div>'
    +'</div>';
  }).join('');
}

function _txOpenWindow(titleText, dateStr, rows, note){
  var w=window.open('','_blank','width=500,height=860');
  w.document.write('<html><head><meta charset="UTF-8"><title>'+titleText+'</title>'
    +'<style>body{font-family:sans-serif;padding:24px;max-width:460px;margin:0 auto;background:white}@media print{body{padding:16px}}</style></head><body>'
    +'<div style="text-align:center;margin-bottom:22px">'
    +'<div style="font-size:28px">🍁</div>'
    +'<h2 style="font-size:17px;margin:6px 0;color:#2D5016;font-family:serif">'+titleText+'</h2>'
    +(dateStr?'<div style="display:inline-block;background:#1565C0;color:white;font-size:13px;font-weight:700;padding:4px 14px;border-radius:20px;margin:4px 0">'+dateStr+'</div><br>':'')
    +'<span style="font-size:11px;color:#aaa">슬기로운 캐나다 생활</span></div>'
    +'<div>'+rows+'</div>'
    +'<div style="margin-top:20px;padding-top:14px;border-top:1px solid #eee;text-align:center;font-size:10px;color:#bbb">'+note+'</div>'
    +'</body></html>');
  w.document.close();
  setTimeout(function(){w.print();},600);
}

function txSaveImg(){
  if(!txMyList.length){alert('먼저 명소를 선택해 주세요!');return;}
  var rows=_txTimelineHTML(txMyList,'',false);
  _txOpenWindow('나만의 '+txData.regionName+' 여행 리스트','',rows,'날짜·시간·메모 추가는 📋 일정표 만들기를 이용하세요');
}
function txPlanImg(){
  var dateVal=(document.getElementById('txPD')||{}).value||'';
  var dateStr='';
  if(dateVal){var d=new Date(dateVal);var days=['일','월','화','수','목','금','토'];dateStr=(d.getMonth()+1)+'월 '+d.getDate()+'일 ('+days[d.getDay()]+')';}
  var rows=_txTimelineHTML(txMyList,dateStr,true);
  _txOpenWindow('나만의 '+txData.regionName+' 여행 일정표',dateStr,rows,'Ctrl+P → PDF 저장 | 슬기로운 캐나다 생활');
}
function txPlanCSV(){
  var date=(document.getElementById('txPD')||{}).value||'';
  var BOM='\uFEFF';
  var H=['순서','지도번호','날짜','시간','명소','소요시간','입장료','주차','메모'];
  var rows=txMyList.map(function(s,i){
    var time=((document.getElementById('txPT'+s.num)||{}).value)||'';
    var memo=(((document.getElementById('txPM'+s.num)||{}).value)||'').replace(/,/g,'，').replace(/\n/g,' ');
    return [i+1,s.num,date,time,'"'+s.title+'"','"'+s.info[2][1]+'"','"'+s.info[0][1]+'"','"'+s.info[1][1]+'"','"'+memo+'"'].join(',');
  });
  var a=document.createElement('a');
  a.href=URL.createObjectURL(new Blob([BOM+H.join(',')+'\n'+rows.join('\n')],{type:'text/csv;charset=utf-8'}));
  a.download=txData.regionName+'_여행_일정표.csv';
  a.click();
}

/* ── 티스토리 글 본문에서 데이터 자동 감지 ── */
function txScanAndInit() {
  var el = document.getElementById('tx-json-data');
  if (!el || el.getAttribute('data-loaded')) return;
  try {
    var data = JSON.parse(el.textContent || el.innerHTML);
    el.setAttribute('data-loaded', '1');
    txInit(data);
  } catch(e) {
    console.warn('tx-json-data 파싱 오류:', e);
  }
}

/* 페이지 로드 시 즉시 시도 */
document.addEventListener('DOMContentLoaded', function() {
  txScanAndInit();
  /* 혹시 늦게 로드될 경우 대비 MutationObserver */
  var observer = new MutationObserver(function() {
    txScanAndInit();
  });
  observer.observe(document.body, { childList: true, subtree: true });
  /* 3초 후 재시도 (티스토리 지연 로딩 대비) */
  setTimeout(txScanAndInit, 500);
  setTimeout(txScanAndInit, 1500);
});