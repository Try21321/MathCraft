let mode="normal";
let score=0;
let level=1;
let progress=0;
let bossHP=100;

let nums=[];
let answer="";
let typingInterval;

let facts=[
"🌿 София ты знала?: Изначально Крипер не был мобом - он появился в результате ошибки при создании свиньи. Позже ему изменили текстуру и добавили способность взрываться",
"💎 София ты знала?: У снежного голема есть лицо за маской из тыквы.",
"⚔ София ты знала?: С шансом в 0.01% в главном меню вместо большой надписи Minecraft появится название с ошибкой Minceraft",
"🔥 София ты знала?: Все коровы в Minecraft - женского пола, так как все дают молоко.",
"🌙 София ты знала?: Свинью можно превратить в свинозомби, если по ней ударит молния",
"🧱 София ты знала?: А если ударить молнией в Крипера, то он станет заряженным. Сила и радиус взрыва будут увеличены",
"💚 София ты знала?: В Странника Края невозможно попасть стрелой из лука, снежком или яйцом. На него также нельзя уронить наковальню",
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

/* ЗАДАНИЕ */
function newTask(){
  let input=document.getElementById("answer");
  input.value=""; // очищаем

  if(mode==="symbols"){
    let a=rand(5)+1;
    let b=rand(5)+1;
    let c=rand(5)+1;

    nums=[a,b,c];

    // выбираем случайные операции
    let ops=["+","-","*"];
    let op1 = ops[rand(ops.length)];
    let op2 = ops[rand(ops.length)];

    // формируем правильный ответ
    answer=eval(`${a}${op1}${b}${op2}${c}`);

    // сохраняем правильные операции для проверки
    nums.ops = [op1, op2];

    set(`${a} ? ${b} ? ${c} = ${answer}`);
    return;
  }

  // обычный режим
  let a=rand(10), b=rand(10);
  answer=a+b;
  set(`${a} + ${b}`);
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

  if(!val){
    showSonya("Нужно написать ответ");
    return;
  }

  if(mode==="symbols"){
    val=val.replace("×","*").replace("÷","/");

    // проверяем символы по правильным
    if(val[0] === nums.ops[0] && val[1] === nums.ops[1]){
      good();
    } else {
      bad();
    }

    input.value="";
    return;
  }

  if(parseInt(val)===answer){
    good();
  } else {
    bad();
  }

  input.value="";
}

/* УСПЕХ */
function good(){

  // начисляем очки
  score += 10;          // +10 за правильный ответ
  progress += 20;       // +20% прогресс

  // проверяем уровень
  if(progress >= 100){
    level++;
    progress = 0;
    showSonya("🎉 Новый уровень!\n\n"+randomFact());
  }

  // боссы отдельно
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

      update();  // обновляем UI после босса
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
function bad(){
  showSonya("❌ Упс, попробуй снова");
}

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

function set(t){
  document.getElementById("task").innerText=t;
}

function rand(n){
  return Math.floor(Math.random()*n);
}

function randomFact(){
  return facts[rand(facts.length)];
}