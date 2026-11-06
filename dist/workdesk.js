// Local extensions share the original storage and completion history.
(() => {
  const esc = value => String(value ?? '').replace(/[&<>"']/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
  const day = () => dateKey(new Date().toISOString());
  const monday = () => { const d = new Date(); d.setDate(d.getDate() - (d.getDay() + 6) % 7); return dateKey(d.toISOString()); };
  state.desk ||= { tasks:[], projects:[], rewards:[], weeks:{}, wellbeing:{}, reviews:{}, roadmap:null };
  const data = state.desk;
  data.errands ??= [];
  let backfilledRewards = false;
  for (const reward of data.rewards) {
    if (reward.done && reward.enjoyedAt && !reward.enjoyLogId && Number.isFinite(Date.parse(reward.enjoyedAt))) {
      reward.enjoyLogId = addHistory(reward.title, '奖励 · 已享受', reward.enjoyedAt);
      backfilledRewards = true;
    }
  }
  data.roadmap ||= [
    { period:'阶段 01', title:'确定当前重点', note:'' },
    { period:'阶段 02', title:'准备与探索', note:'' },
    { period:'阶段 03', title:'实践与积累', note:'' },
    { period:'阶段 04', title:'回顾与选择', note:'' },
    { period:'阶段 05', title:'下一段旅程', note:'' }
  ];
  if (state.theme === 'midnight') applyTheme('swiss', false);
  const persist = msg => { save(msg); };
  const shell = document.querySelector('.shell');
  const workspace = document.querySelector('.workspace');
  const nav = document.createElement('nav'); nav.className='desk-nav'; nav.setAttribute('aria-label','工作台导航');
  nav.innerHTML = [['today','今日','01 / TODAY'],['week','本周','02 / THIS WEEK'],['rewards','奖励','03 / LITTLE JOYS'],['more','更多','04 / COLLECTION']].map(([key,label,note])=>`<button type="button" data-page="${key}">${label}<small>${note}</small></button>`).join('');
  workspace.before(nav);
  const energy = document.createElement('div'); energy.className='energy-bar'; energy.innerHTML='<span>当前精力</span>'+['低能量','正常','充足'].map(v=>`<button type="button" data-energy="${v}" aria-pressed="false">${v}</button>`).join('');
  const energyNote=document.createElement('p'); energyNote.className='energy-note';
  workspace.before(energy,energyNote);
  energy.addEventListener('click',e=>{const b=e.target.closest('[data-energy]');if(!b)return;data.wellbeing[day()]||={};data.wellbeing[day()].energy=b.dataset.energy;persist('精力已记下');renderEnergy();});
  function renderEnergy(){const current=data.wellbeing[day()]?.energy;energy.querySelectorAll('button').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.energy===current)));energyNote.textContent=current==='低能量'?'今天可以从一个 5–20 分钟的小步骤开始。':current==='充足'?'按自己的节奏推进，完成预定目标就可以停。':'先选一件值得推进的事，也可以先休息。';}
  const originalInbox=$('inboxList').closest('.module');
  const teaser=document.createElement('section');teaser.className='module reward-teaser';originalInbox.replaceWith(teaser);
  const errands=document.createElement('section');
  errands.className='module errands'; errands.setAttribute('aria-labelledby','errandsTitle');
  errands.innerHTML=`<div class="module-kicker">LITTLE THINGS / 日常</div><div class="errands-head"><h2 class="section-title" id="errandsTitle">日常事务</h2><span class="section-note" id="errandsCount" aria-live="polite"></span></div><ul class="errand-list" id="errandsList"></ul><form class="errand-form" id="errandsForm"><input name="text" aria-label="新增日常事务" placeholder="健身、拿快递…" maxlength="100" autocomplete="off" required><button class="primary" type="submit">＋ 添加</button><label><input name="daily" type="checkbox"> 每天重复</label></form>`;
  teaser.before(errands);
  let errandsDay;
  function renderErrands() {
    errandsDay=day();
    const visible=data.errands.filter(item=>item.daily||!item.doneOn||item.doneOn===errandsDay);
    const isDone=item=>item.doneOn===errandsDay;
    visible.sort((a,b)=>Number(isDone(a))-Number(isDone(b)));
    $('errandsCount').textContent=visible.length?`${visible.filter(isDone).length} / ${visible.length} 已勾选`:'';
    $('errandsList').innerHTML=visible.map(item=>`<li class="errand-row${isDone(item)?' done':''}"><label><input type="checkbox" data-errand="${esc(item.id)}"${isDone(item)?' checked':''}><span>${esc(item.text)}</span>${item.daily?'<small>每天</small>':''}</label><button class="icon-btn" type="button" data-remove-errand="${esc(item.id)}" aria-label="移除：${esc(item.text)}">×</button></li>`).join('');
  }
  $('errandsForm').addEventListener('submit',e=>{
    e.preventDefault();
    const form=e.currentTarget;const fields=new FormData(form);const text=fields.get('text').trim();
    if(!text)return;
    data.errands.push({id:crypto.randomUUID(),text,daily:fields.has('daily')});
    persist('日常事务已添加');form.reset();renderErrands();form.elements.text.focus();
  });
  $('errandsList').addEventListener('change',e=>{
    const item=data.errands.find(x=>x.id===e.target.dataset.errand);
    if(!item)return;
    if(errandsDay!==day()){renderErrands();return;}
    if(e.target.checked&&item.doneOn!==errandsDay){
      item.doneOn=errandsDay;item.logId=addHistory(item.text,'日常事务');
    }else if(!e.target.checked&&item.doneOn===errandsDay){
      state.history=state.history.filter(entry=>entry.id!==item.logId);
      delete item.doneOn;delete item.logId;
    }
    persist();renderHistory();renderErrands();
    Array.from($('errandsList').querySelectorAll('[data-errand]')).find(input=>input.dataset.errand===item.id)?.focus();
  });
  $('errandsList').addEventListener('click',e=>{
    const button=e.target.closest('[data-remove-errand]');if(!button)return;
    data.errands=data.errands.filter(item=>item.id!==button.dataset.removeErrand);
    persist('日常事务已移除');renderErrands();$('errandsForm').elements.text.focus();
  });
  const refreshErrandsDay=()=>{if(errandsDay!==day())renderErrands();};
  window.addEventListener('focus',refreshErrandsDay);
  document.addEventListener('visibilitychange',refreshErrandsDay);
  setInterval(refreshErrandsDay,30000);
  const page=document.createElement('section');page.className='desk-page';page.hidden=true;page.id='deskPage';workspace.after(page);
  const dialog=document.createElement('dialog');dialog.className='desk-dialog';shell.after(dialog);
  let active='today';
  const heading=(number,title,note)=>`<div class="desk-heading"><div><div class="module-kicker">${number}</div><h1>${title}</h1></div><p>${note}</p></div>`;
  const field=(name,label,value='',type='text')=>`<label class="desk-field">${label}<input name="${name}" type="${type}" value="${esc(value)}"></label>`;
  const area=(name,label,value='')=>`<label class="desk-field">${label}<textarea name="${name}">${esc(value)}</textarea></label>`;
  const select=(name,label,values,value)=>`<label class="desk-field">${label}<select name="${name}">${values.map(v=>`<option${v===value?' selected':''}>${esc(v)}</option>`).join('')}</select></label>`;
  const empty=text=>`<div class="desk-empty">${text}</div>`;
  const action=(cmd,id,label)=>`<button class="secondary" type="button" data-action="${cmd}" data-id="${esc(id)}">${label}</button>`;
  function openEditor(title,body,onSave){dialog.innerHTML=`<h2>${title}</h2><form class="desk-form">${body}<div class="dialog-actions"><button type="button" class="secondary" data-close>取消</button><button class="primary" type="submit">保存</button></div></form>`;dialog.querySelector('[data-close]').onclick=()=>dialog.close();dialog.querySelector('form').onsubmit=e=>{e.preventDefault();onSave(Object.fromEntries(new FormData(e.target)));dialog.close();persist('已保存');render();};dialog.showModal();}
  const domains=['学业','职业','留学','健康','个人生活'];
  function editTask(id){const task=data.tasks.find(t=>t.id===id)||{};openEditor(id?'编辑任务':'添加任务',field('text','要做的具体动作',task.text)+`<details><summary>优先级、日期与更多信息</summary><div class="desk-pair">${select('domain','领域',domains,task.domain)}${select('priority','优先级',['P1 重要','P0 紧急','P2 可选'],task.priority)}${field('date','截止日期',task.date,'date')}${field('minutes','预计分钟数',task.minutes||20,'number')}${select('energy','所需精力',['低','中','高'],task.energy)}${select('status','状态',['待办','进行中','完成','暂停','取消'],task.status)}</div>${select('project','所属项目',['',...data.projects.map(p=>p.title)],task.project)}${area('next','下一步 / 最小动作',task.next)}</details>`,values=>{if(!values.text.trim())return;const next={...task,...values,id:task.id||crypto.randomUUID()};if(next.status==='完成'&&task.status!=='完成')next.logId=addHistory(next.text,next.domain);if(task.id)data.tasks[data.tasks.indexOf(task)]=next;else data.tasks.push(next);renderHistory();});}
  function taskRows(){const order={'P0 紧急':0,'P1 重要':1,'P2 可选':2};return data.tasks.slice().sort((a,b)=>(order[a.priority]??1)-(order[b.priority]??1)).map(t=>`<article class="desk-row ${t.status==='完成'?'done':''}"><div class="desk-tag">${esc(t.domain)} · ${esc(t.priority)} · ${esc(t.status)}${t.date?' · '+esc(t.date):''}${t.minutes?' · '+esc(t.minutes)+'分钟':''}</div><h3>${esc(t.text)}</h3>${t.next?`<p class="desk-muted">下一步：${esc(t.next)}</p>`:''}<div class="desk-actions">${!['完成','取消'].includes(t.status)?action('start',t.id,'现在做')+action('done',t.id,'✓ 完成'):''}${action('edit-task',t.id,'编辑')}${action('delete-task',t.id,'删除')}</div></article>`).join('')||empty('还没有任务。需要时再添加一个具体动作。');}
  function renderWeekPage(){const key=monday();const w=data.weeks[key]||={results:['','',''],budget:''};page.innerHTML=heading('THIS WEEK / '+key,'本周计划','三个关键结果，按精力调整工作量。')+`<div class="desk-grid"><div><section class="module desk-box"><h2>本周关键结果</h2><form class="desk-form" id="weekPlan">${['必须完成','重点推进','有余力再做'].map((label,i)=>field('result'+i,label,w.results[i])).join('')}${area('budget','各领域预算 · 可自由填写',w.budget)}<button class="primary" type="submit">保存本周计划</button><p class="week-save-note" role="status"></p></form></section><section class="module desk-box"><div class="desk-heading" style="margin:0 0 12px"><h2>任务清单</h2>${action('new-task','','＋ 添加')}</div><p class="desk-muted">${data.tasks.filter(t=>t.status==='完成').length} 项已完成 · 随时调整优先级与工作量</p>${taskRows()}</section></div><div><section class="module desk-box"><h2>所有重要日期</h2>${state.week.slice().sort((a,b)=>a.date.localeCompare(b.date)).map(x=>`<div class="desk-row"><span class="desk-tag">${esc(x.date)}</span><h3>${esc(x.text)}</h3></div>`).join('')||empty('暂无日期')}<p class="desk-muted">首页只显示未来七天；其他日期保留在这里。</p></section><div id="inboxMount"></div></div></div>`;page.querySelector('#inboxMount').append(originalInbox);const form=page.querySelector('#weekPlan');
    const note=form.querySelector('.week-save-note');
    form.addEventListener('input',()=>{note.textContent='';});
    form.addEventListener('submit',e=>{
      e.preventDefault();
      const f=new FormData(form);
      const previous=data.weeks[key];
      data.weeks[key]={results:[0,1,2].map(i=>f.get('result'+i)),budget:f.get('budget')};
      try { persist('本周计划已保存'); note.textContent='✓ 本周计划已保存'; }
      catch { data.weeks[key]=previous; note.textContent='无法保存。请检查浏览器是否允许此站点保存数据，再试一次。'; }
    });
  }
  function editReward(id){const r=data.rewards.find(x=>x.id===id)||{};openEditor(id?'编辑奖励':'记下一件想做的事',field('title','想做什么？',r.title)+select('size','适合什么时候',['小休息','空闲半天','值得期待的大计划'],r.size)+area('note','备注 / 地点 / 链接 / 预算（可空）',r.note),v=>{if(!v.title.trim())return;if(r.id)Object.assign(r,v);else data.rewards.push({...v,id:crypto.randomUUID(),done:false});});}
  function renderRewards(){page.innerHTML=heading('LITTLE JOYS / WISHLIST','给自己一点期待','把想做的事放在这里，忙完或有空时挑一个。')+`<section class="module desk-box reward-banner"><div class="desk-actions"><button class="primary" data-action="new-reward">＋ 添加想做的事</button><button class="secondary" data-action="random-reward">帮我挑一个</button></div><p class="desk-muted">随时可以安排。休息和喜欢的事，也值得留出位置。</p><p id="rewardPick" class="desk-note" aria-live="polite"></p></section><div class="reward-grid">${data.rewards.map((r,i)=>`<article class="module reward-card ${r.done?'done':''}"><div class="reward-no">${String(i+1).padStart(2,'0')} / ${esc(r.done?'已经享受':r.size)}</div><h2>${esc(r.title)}</h2><p>${esc(r.note)}</p><div class="desk-actions">${action('enjoy',r.id,r.done?'再期待一次':'✓ 已享受')}${action('edit-reward',r.id,'编辑')}${action('delete-reward',r.id,'删除')}</div>${r.enjoyedAt?`<small class="desk-muted">${esc(historyDateLabel(dateKey(r.enjoyedAt)))}</small>`:''}</article>`).join('')}</div>${!data.rewards.length?empty('从一个你真的想做的小事开始。<br>例如看场电影、踢场球、做一道想吃的菜——这些只是例子。'):''}`;}
  function editProject(id){const p=data.projects.find(x=>x.id===id)||{};openEditor(id?'编辑项目':'添加项目',field('title','项目名称',p.title)+select('domain','领域',domains,p.domain)+area('goal','目标',p.goal)+`<div class="desk-pair">${field('start','开始日期',p.start,'date')}${field('deadline','目标截止',p.deadline,'date')}</div>`+select('status','状态',['候选','进行中','暂停','完成','取消'],p.status)+area('next','下一步具体行动',p.next)+area('milestones','关键里程碑',p.milestones)+area('links','相关文件与最终成果',p.links),v=>{if(!v.title.trim())return;if(v.status==='进行中'&&data.projects.filter(x=>x.id!==p.id&&x.status==='进行中').length>=2){v.status='候选';save('已有两个进行中项目，先放候选');}if(p.id)Object.assign(p,v);else data.projects.push({...v,id:crypto.randomUUID()});});}
  function renderProjects(){page.innerHTML=heading('PROJECTS','项目','按需要开启，最多同时推进两个。')+`<button class="primary" data-action="new-project">＋ 添加项目</button><div class="reward-grid" style="margin-top:20px">${data.projects.map(p=>`<article class="module desk-box"><span class="desk-tag">${esc(p.domain)} / ${esc(p.status)}</span><h2>${esc(p.title)}</h2><p>${esc(p.goal)}</p><p class="desk-muted">${esc(p.start||'未定')} → ${esc(p.deadline||'未定')}</p><p>下一步：${esc(p.next||'待补充')}</p><details><summary>里程碑与成果</summary><p>${esc(p.milestones)}</p><p>${esc(p.links)}</p></details><div class="desk-actions">${action('edit-project',p.id,'编辑')}${action('delete-project',p.id,'删除')}</div></article>`).join('')}</div>${!data.projects.length?empty('目前没有进行中的项目。<br>需要推进新项目时，再把它放进来。'):''}`;}
  function renderRoadmap(){page.innerHTML=heading('ROADMAP / 2028 FALL','长期路线图','按季度回看，细化到有实际日期时再创建任务。')+data.roadmap.map((r,i)=>`<section class="module desk-box timeline-card"><div class="desk-tag">${esc(r.period)}</div><h2>${esc(r.title)}</h2><form class="desk-form" data-roadmap="${i}">${field('title','阶段主题',r.title)}${area('note','核心目标、关键成果、截止与依赖、风险调整',r.note)}<button class="secondary">保存这一阶段</button></form></section>`).join('');page.querySelectorAll('[data-roadmap]').forEach(f=>f.onsubmit=e=>{e.preventDefault();Object.assign(data.roadmap[Number(f.dataset.roadmap)],Object.fromEntries(new FormData(f)));persist('阶段规划已保存');});}
  function renderWellbeing(){const v=data.wellbeing[day()]||{};page.innerHTML=heading('WELLBEING / '+day(),'健康与精力','记录由你决定。留意生活节奏，随时可以中断和恢复。')+`<div class="desk-grid"><section class="module desk-box"><h2>今天感觉如何？</h2><form class="desk-form" id="wellForm">${field('sleep','睡眠小时数（可空）',v.sleep,'number')}${select('energy','当前精力',['','低能量','正常','充足'],v.energy)}${area('movement','运动与休息',v.movement)}${area('stress','压力与感受',v.stress)}${area('support','就诊或后续支持事项（可空）',v.support)}<button class="primary">保存今天</button></form></section><section class="module desk-box"><h2>往日记录</h2>${Object.entries(data.wellbeing).sort(([a],[b])=>b.localeCompare(a)).map(([date,x])=>`<div class="desk-row"><span class="desk-tag">${esc(date)}</span><p>${esc([x.energy,x.sleep?x.sleep+'小时睡眠':'',x.movement,x.stress,x.support].filter(Boolean).join(' · '))}</p></div>`).join('')||empty('有需要再记。')}</section></div>`;page.querySelector('#wellForm').onsubmit=e=>{e.preventDefault();data.wellbeing[day()]=Object.fromEntries(new FormData(e.target));persist('今天的状态已保存');render();};}
  function renderReview(){const key=monday();const v=data.reviews[key]||{};page.innerHTML=heading('REVIEW / '+key,'轻量复盘','每周花几分钟，决定下周如何更轻松地继续。')+`<div class="desk-grid"><section class="module desk-box"><form class="desk-form" id="reviewForm">${area('done','这周完成了什么？',v.done)}${area('hard','什么最难启动，为什么？',v.hard)}${area('change','下周删掉、简化或调整什么？',v.change)}<details><summary>月度检查（可选）</summary>${area('month','课程风险 / 项目进展 / 工作量 / 长期目标',v.month)}</details><button class="primary">保存复盘</button></form></section><section class="module desk-box"><h2>完成的证据</h2><p class="desk-muted">原有完成记录持续保留，可以随时打开回看。</p><button class="secondary" data-action="history">查看完成记录</button>${Object.keys(data.reviews).sort().reverse().map(k=>`<details class="desk-row"><summary>${esc(k)} 这一周</summary><p>${esc(data.reviews[k].done)}</p><p>${esc(data.reviews[k].hard)}</p><p>${esc(data.reviews[k].change)}</p></details>`).join('')}</section></div>`;page.querySelector('#reviewForm').onsubmit=e=>{e.preventDefault();data.reviews[key]=Object.fromEntries(new FormData(e.target));persist('复盘已保存');};}
  function renderMore(){page.innerHTML=heading('COLLECTION','更多空间','需要的时候打开，让今日保持轻盈。')+`<div class="hub-links">${[['projects','01','项目管理','目标、下一步、里程碑与成果'],['roadmap','02','长期路线图','按自己的阶段与节奏回看'],['wellbeing','03','健康与精力','睡眠、活动、压力与支持'],['review','04','轻量复盘','完成了什么，下周如何调整']].map(([key,n,title,note])=>`<button class="module hub-card" data-page="${key}"><span>${n} / OPEN →</span><h2>${title}</h2><p>${note}</p></button>`).join('')}</div>`;}
  function renderTeaser(){const r=data.rewards.find(r=>!r.done);teaser.innerHTML=`<div class="module-kicker">A LITTLE JOY / 奖励</div><h2>${esc(r?.title||'留一点期待')}</h2><p>${r?'有空时，给这件喜欢的事留个位置。':'把想做的事收进来，有空时挑一个。'}</p><button class="secondary" data-page="rewards">${r?'挑个奖励 ↗':'＋ 写下想做的事'}</button>`;}
  function render(){nav.querySelectorAll('button').forEach(b=>{if(b.dataset.page===(['projects','roadmap','wellbeing','review'].includes(active)?'more':active))b.setAttribute('aria-current','page');else b.removeAttribute('aria-current');});workspace.hidden=active!=='today';energy.hidden=energyNote.hidden=active!=='today';page.hidden=active==='today';renderEnergy();renderTeaser();if(active==='week')renderWeekPage();if(active==='rewards')renderRewards();if(active==='more')renderMore();if(active==='projects')renderProjects();if(active==='roadmap')renderRoadmap();if(active==='wellbeing')renderWellbeing();if(active==='review')renderReview();}
  function go(key){active=key;document.body.classList.remove('focus-mode');$('focusButton').textContent='进入专注';render();}
  document.addEventListener('click',e=>{const route=e.target.closest('[data-page]');if(route){go(route.dataset.page);return;}const b=e.target.closest('[data-action]');if(!b)return;const id=b.dataset.id;switch(b.dataset.action){
    case 'new-task':editTask();break;case 'edit-task':editTask(id);break;
    case 'start':{const t=data.tasks.find(x=>x.id===id);state.focusTask=t.text;state.resumeAt=t.next||'';state.doneWhen='';data.activeTaskId=id;t.status='进行中';['focusTask','resumeAt','doneWhen'].forEach(k=>$(k).value=state[k]);persist('开始这一件');go('today');$('focusTask').focus();break;}
    case 'done':{const t=data.tasks.find(x=>x.id===id);t.status='完成';t.logId=addHistory(t.text,t.domain);persist('完成，已记下');renderHistory();render();break;}
    case 'new-reward':editReward();break;case 'edit-reward':editReward(id);break;
    case 'enjoy':{
      const r=data.rewards.find(x=>x.id===id);
      if(!r)break;
      r.done=!r.done;
      r.enjoyedAt=r.done?new Date().toISOString():null;
      if(r.done)r.enjoyLogId=addHistory(r.title,'奖励 · 已享受',r.enjoyedAt);
      persist(r.done?'已计入完成记录':'再次期待');
      renderHistory();render();break;
    }
    case 'random-reward':{const list=data.rewards.filter(r=>!r.done);const r=list[Math.floor(Math.random()*list.length)];$('rewardPick').textContent=r?'这次可以：'+r.title:'先写下一件想做的事吧。';break;}
    case 'new-project':editProject();break;case 'edit-project':editProject(id);break;
    case 'delete-task':case 'delete-reward':case 'delete-project':{if(!confirm('删除这一项？已保存的完成记录会保留。'))return;const key={'delete-task':'tasks','delete-reward':'rewards','delete-project':'projects'}[b.dataset.action];data[key]=data[key].filter(x=>x.id!==id);persist('已删除');render();break;}
    case 'history':setHistoryOpen(true);break;
  }});
  let matchedTask;
  $('confirmFinish').addEventListener('click',()=>{matchedTask=data.tasks.find(t=>t.id===data.activeTaskId&&t.text===state.focusTask.trim());},true);
  $('confirmFinish').addEventListener('click',()=>{if(matchedTask){matchedTask.status='完成';matchedTask.logId=state.history[0]?.id;}delete data.activeTaskId;persist('完成，已记下');renderTeaser();});
  $('historyPanel').inert=true;
  const oldOpen=setHistoryOpen;setHistoryOpen=open=>{oldOpen(open);$('historyPanel').inert=!open;workspace.inert=page.inert=nav.inert=open;if(!open)$('historyToggle').focus();};
  persist();render();renderErrands();
  if(backfilledRewards)renderHistory();
})();
