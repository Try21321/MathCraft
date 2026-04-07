let mode="normal";
let score=0;
let level=1;
let progress=0;
let bossHP=100;

let currentTask = {}; // теперь хранит числа и правильные операции
let typingInterval;

let facts=[
  "🌿 София ты знала?: Изначально Крипер не был мобом - он появился в результате ошибки при создании свиньи.",
  "💎 София ты знала?: У снежного голема есть лицо за маской из тыквы.",
  "⚔ София ты знала?: С шансом в 0.01% в главном меню вместо большой надписи Minecraft появится название с ошибкой Minceraft",
  "🔥 София ты знала?: Все коровы в Minecraft - женского пола, так как все дают молоко.",
  "🌙 София ты знала?: Свинью можно превратить в свинозомби, если по ней ударит молния",
  "🧱 София ты знала?: А если ударить молнией в Крипера, то он станет заряженным. Сила и радиус взрыва будут увеличены",
  "💚 София ты знала?: В Странника Края невозможно попасть стрелой из лука, снежком или яйцом. На него также нельзя уронить наковальню",
  "💎 София ты знала?: Криперы хоть и не имеют рук, но всё равно спосбны подниматься по лестницам",
  "💎 София ты знала?: Никогда не спите в Нижнем Мире. При взаимодействии с кроватью, она взорвётся и вы получите урон.",
  "💎 София ты знала?: В самых ранних версиях игры со скелетов с небольшим шансом мог выпасть колчан. Он позволял стрелять из лука, не тратя стрелы",
  "💎 София ты знала?:  Кактус в доме можно использовать вместо мусорного ведра - когда выпавший предмет касается его, он пропадает.",
  "💎 София ты знала?: Переименовав моба с помощью бирки, используя имена Grumm или Dinnerbone, вы перевернёте игровую модель данного моба.",
  "💎 София ты знала?: Концептом для чёрно-белой кошки в Minecraft служила настоящая кошка Йенса - Ньютон",
  "💎 София ты знала?: Самые маленькие мобы в игре - детёныш черепахи, чешуйница Края и летучая мышь",
  "💎 София ты знала?: Надев на голову тыкву, вы спокойно можете смотреть на Странников Края - они не будут вас атаковать",
  "💎 София ты знала?:  Обычно с скелетов лук в правой руке, однако с шансом в 5% он может появится в левой",
  "💎 София ты знала?: Любые пауки неуязвимы к зелью отравления",
  "💎 София ты знала?: Ведьма не может сгореть в лаве или утонуть в воде",
  "💎 София ты знала?: Странник Края получают урон от воды. Более того, им можно нанести урон с помощью пузырька с водой",
  "💎 София ты знала?: Изначально зелья должны были вариться в котлах, по позже способ их создания заменили на варочную стойку",
  "💎 София ты знала?: Железный голем может подарить жителям или детям цветок. Это отслыка к аниме Небесный Замок Лапута",
  "💎 София ты знала?: Снежками можно отталкивать огненные шары Гастов",
  "💎 София ты знала?: Если поставить ковёр сверху забора, то вы сможете перепрыгнуть такую конструкцию, а вот мобы — нет",

];

/* РЕЖИМ */
function setMode(m){
  mode=m;

  document.getElementById("symbols").classList.toggle("hidden", m!=="symbols");
  document.getElementById("bossBox").classList.toggle("hidden", m!=="boss");

  let input=document.getElementById("answer");
  if(m==="symbols"){
    input.readOnly=true;
    input.style.fontSize="28px";
  } else {
    input.readOnly=false;
    input.style.fontSize="20px";
  }

  newTask();
}

/* НОВОЕ ЗАДАНИЕ */
function newTask(){
  let input=document.getElementById("answer");
  input.value="";

  /* 🔣 SYMBOLS */
  if(mode==="symbols"){

    let a,b,c,op1,op2,ans;

    while(true){

      a=rand(9)+1;
      b=rand(9)+1;
      c=rand(9)+1;

      let ops=["*","/","+"]; // ❌ убрали минус
      op1=ops[rand(ops.length)];
      op2=ops[rand(ops.length)];

      // 👉 деление только если делится
      if(op1==="/"){
        a = b * (rand(9)+1);
      }
      if(op2==="/"){
        b = c * (rand(9)+1);
      }

      ans = eval(`${a}${op1}${b}${op2}${c}`);

      // 👉 фильтр нормальных заданий
      if(Number.isInteger(ans) && ans > 0 && ans < 100){
        break;
      }
    }

    currentTask = {
      nums:[a,b,c],
      ops:[op1,op2],
      answer:ans
    };

    set(`${a} ? ${b} ? ${c} = ${ans}`);
    return;
  }

  /* ⚔ БОСС */
  if(mode==="boss"){
    let a=rand(9)+1;
    let b=rand(9)+1;

    currentTask = {nums:[a,b], answer:a*b};

    set(`⚔ ${a} × ${b}`);
    return;
  }

  /* ⛏ КРАФТ */
  if(mode==="craft"){
    let b=rand(9)+1;
    let answerVal=rand(9)+1;
    let a=b*answerVal;

    if(Math.random()>0.5){
      currentTask = {nums:[a,b], answer:answerVal};
      set(`⛏ ${a} ÷ ${b}`);
    } else {
      currentTask = {nums:[b,answerVal], answer:a};
      set(`⛏ ${b} × ${answerVal}`);
    }
    return;
  }

  /* ➕ NORMAL */
  let a=rand(9)+1;
  let b=rand(9)+1;

  if(Math.random()>0.4){
    currentTask = {nums:[a,b], answer:a*b};
    set(`${a} × ${b}`);
  } else {
    currentTask = {nums:[a,b], answer:a+b};
    set(`${a} + ${b}`);
  }
}

/* ВЫБОР СИМВОЛА */
function pick(s){
  let input=document.getElementById("answer");
  if(input.value.length<2){
    if(s==="*") input.value+="×";
    else if(s==="/") input.value+="÷";
    else input.value+=s;
  }
}

/* ПРОВЕРКА */
function check(){
  let input=document.getElementById("answer");
  let val=input.value;
  if(!val){ showSonya("Нужно написать ответ"); return; }

  if(mode==="symbols"){
    val = val.replace("×","*").replace("÷","/");
    if(val[0]===currentTask.ops[0] && val[1]===currentTask.ops[1]){
      good();
    } else { bad(); }
    input.value="";
    return;
  }

  if(parseInt(val)===currentTask.answer){
    good();
  } else { bad(); }

  input.value="";
}

/* УСПЕХ */
function good(){
  score += 10;
  progress += 20;

  if(progress >= 100){
    level++;
    progress = 0;
    showSonya("🎉 Новый уровень!\n\n"+randomFact());
  }

  if(mode==="boss"){
    bossHP -= 20;
    damage(20);
    document.getElementById("hp").style.width = bossHP + "%";

    if(bossHP <= 0){
      bossHP = 0;
      showSonya("🏆 Соня: Ты победила босса! Ты легенда! 🔥");
      addResource();
      addResource();

      setTimeout(()=>{
        bossHP = 100;
        setMode("normal");
      },1000);

      update();
      return;
    }
  }

  update();
  newTask();
}

/* РЕСУРСЫ */
let inventory = {};
function addResource(){
  let items=["🪵","🪨","⛓","💎"];
  let item=items[rand(items.length)];
  inventory[item] = (inventory[item] || 0) + 1;
  renderInventory();
}
function renderInventory(){
  let inv=document.getElementById("inv");
  let html="";
  for(let item in inventory){
    html += `<span class="inv-item">${item} x${inventory[item]}</span>`;
  }
  inv.innerHTML = html;
}

/* ОШИБКА */
function bad(){ showSonya("❌ Упс, попробуй снова"); }

/* УРОН */
function damage(d){
  let el=document.createElement("div");
  el.className="damage";
  el.innerText="-"+d;
  let boss=document.getElementById("bossImg").getBoundingClientRect();
  el.style.left=boss.left+boss.width/2+"px";
  el.style.top=boss.top+"px";
  document.body.appendChild(el);
  setTimeout(()=>el.remove(),1000);
}

/* СОНЯ */
function showSonya(text){
  let m=document.getElementById("sonyaModal");
  let el=document.getElementById("sonyaText");
  m.classList.remove("hidden");
  el.innerHTML="";
  let i=0;
  clearInterval(typingInterval);
  typingInterval=setInterval(()=>{
    el.innerHTML+=text[i];
    i++;
    if(i>=text.length) clearInterval(typingInterval);
  },40);
}
function closeSonya(){
  document.getElementById("sonyaModal").classList.add("hidden");
  newTask();
}

/* UI */
function update(){
  document.getElementById("score").innerText=score;
  document.getElementById("level").innerText=level;
  document.getElementById("progress").style.width=progress+"%";
}

function set(t){ document.getElementById("task").innerText=t; }
function rand(n){ return Math.floor(Math.random()*n); }
function randomFact(){ return facts[rand(facts.length)]; }