// ======================================
// Science Wheel Game
// Part 1
// ======================================

// Canvas
const canvas = document.getElementById("wheel");
const ctx = canvas.getContext("2d");

// عناصر الصفحة
const spinBtn = document.getElementById("spinBtn");

const questionModal = document.getElementById("questionModal");
const questionText = document.getElementById("questionText");

const answerButtons =
document.querySelectorAll(".answerBtn");

const scoreBox =
document.getElementById("score");

const remainingBox =
document.getElementById("remaining");

const timerBox =
document.getElementById("time");

const finishScreen =
document.getElementById("finishScreen");

const finalScore =
document.getElementById("finalScore");

const restartBtn =
document.getElementById("restartBtn");

// الأصوات
const bg =
document.getElementById("bg");

const click =
document.getElementById("click");

const hover =
document.getElementById("hover");

const openSound =
document.getElementById("open");

const correctSound =
document.getElementById("correct");

const wrongSound =
document.getElementById("wrong");

const finishSound =
document.getElementById("finish");

//=======================================
// متغيرات اللعبة
//=======================================

let questions = [];

let wheel = [];

let currentQuestion = null;

let currentIndex = -1;

let score = 0;

let rotation = 0;

let spinning = false;

let timer = null;

let seconds = 30;

//=======================================
// تحميل الأسئلة
//=======================================

fetch("questions.json")

.then(response => response.json())

.then(data=>{

questions = data;

// إنشاء قطاعات العجلة

wheel = questions.map((q,index)=>{

return{

id:index,

label:"Q"+(index+1),

color:getColor(index),

used:false

};

});

remainingBox.textContent = wheel.length;

drawWheel();

startBackground();

});

//=======================================
// تشغيل الموسيقى
//=======================================

function startBackground(){

bg.volume=.35;

bg.play().catch(()=>{});

}

//=======================================
// ألوان القطاعات
//=======================================

function getColor(index){

const colors=[

"#F44336",

"#FF9800",

"#FFEB3B",

"#4CAF50",

"#03A9F4",

"#3F51B5",

"#9C27B0",

"#E91E63",

"#009688",

"#795548",

"#607D8B",

"#8BC34A"

];

return colors[index%colors.length];

}

//=======================================
// رسم العجلة
//=======================================

function drawWheel(){

ctx.clearRect(0,0,canvas.width,canvas.height);

if(wheel.length===0) return;

const cx=canvas.width/2;

const cy=canvas.height/2;

const radius=290;

const slice=(Math.PI*2)/wheel.length;

wheel.forEach((item,index)=>{

const start=index*slice+rotation;

const end=start+slice;

ctx.beginPath();

ctx.moveTo(cx,cy);

ctx.arc(

cx,

cy,

radius,

start,

end

);

ctx.closePath();

ctx.fillStyle=item.color;

ctx.fill();

ctx.lineWidth=3;

ctx.strokeStyle="#fff";

ctx.stroke();

ctx.save();

ctx.translate(cx,cy);

ctx.rotate(start+slice/2);

ctx.fillStyle="white";

ctx.font="bold 24px Arial";

ctx.textAlign="right";

ctx.fillText(

item.label,

240,

8

);

ctx.restore();

});

// مركز العجلة

ctx.beginPath();

ctx.arc(

cx,

cy,

55,

0,

Math.PI*2

);

ctx.fillStyle="white";

ctx.fill();

ctx.strokeStyle="#444";

ctx.lineWidth=4;

ctx.stroke();

ctx.fillStyle="#0c4f78";

ctx.font="bold 22px Arial";

ctx.textAlign="center";

ctx.fillText(

"SCIENCE",

cx,

cy+8

);

}

//=======================================
// Hover Sound
//=======================================

document.querySelectorAll("button")

.forEach(btn=>{

btn.addEventListener(

"mouseenter",

()=>{

hover.currentTime=0;

hover.play();

}

);

});

//=======================================
// Click Sound
//=======================================

document.querySelectorAll("button")

.forEach(btn=>{

btn.addEventListener(

"click",

()=>{

click.currentTime=0;

click.play();

}

);

});

//=======================================
// إعادة اللعبة
//=======================================

restartBtn.onclick=()=>{

location.reload();

};
//=======================================
// دوران العجلة
//=======================================

let speed = 0;

spinBtn.addEventListener("click", spinWheel);

function spinWheel(){

    if(spinning) return;

    if(wheel.length===0) return;

    spinning = true;

    spinBtn.disabled = true;

    speed = Math.random()*0.25 + 0.45;

    animateWheel();

}

//=======================================
// Animation
//=======================================

function animateWheel(){

    rotation += speed;

    speed *= 0.985;

    drawWheel();

    if(speed > 0.002){

        requestAnimationFrame(animateWheel);

    }else{

        spinning = false;

        spinBtn.disabled = false;

        rotation %= Math.PI*2;

        chooseSector();

    }

}

//=======================================
// تحديد القطاع الموجود أسفل السهم
//=======================================

function chooseSector(){

    const total = wheel.length;

    const slice = (Math.PI*2)/total;

    const pointer = -Math.PI/2;

    let angle = pointer - rotation;

    while(angle<0){

        angle += Math.PI*2;

    }

    angle %= Math.PI*2;

    let index = Math.floor(angle/slice);

    index = (total-index)%total;

    if(index>=wheel.length){

        index=0;

    }

    currentIndex=index;

    currentQuestion=questions[index];

    setTimeout(showQuestion,400);

}

//=======================================
// عرض السؤال
//=======================================

function showQuestion(){

    openSound.currentTime=0;

    openSound.play();

    questionModal.classList.remove("hidden");

    questionText.textContent=currentQuestion.question;

    answerButtons.forEach((btn,i)=>{

        btn.disabled=false;

        btn.classList.remove("correct");

        btn.classList.remove("wrong");

        btn.textContent=currentQuestion.answers[i];

        btn.onclick=()=>checkAnswer(i);

    });

    startTimer();

}

//=======================================
// المؤقت
//=======================================

function startTimer(){

    clearInterval(timer);

    seconds=30;

    timerBox.textContent=seconds;

    timer=setInterval(()=>{

        seconds--;

        timerBox.textContent=seconds;

        if(seconds<=0){

            clearInterval(timer);

            revealAnswer(-1);

        }

    },1000);

}
//=======================================
// التحقق من الإجابة
//=======================================

function checkAnswer(selected){

    clearInterval(timer);

    answerButtons.forEach(btn=>btn.disabled=true);

    if(selected===currentQuestion.correct){

        answerButtons[selected].classList.add("correct");

        correctSound.currentTime=0;

        correctSound.play();

        score+=100;

        scoreBox.textContent=score;

    }else{

        answerButtons[selected].classList.add("wrong");

        answerButtons[currentQuestion.correct].classList.add("correct");

        wrongSound.currentTime=0;

        wrongSound.play();

    }

    setTimeout(removeCurrentSector,1800);

}

//=======================================
// انتهاء الوقت
//=======================================

function revealAnswer(){

    answerButtons.forEach(btn=>btn.disabled=true);

    answerButtons[currentQuestion.correct].classList.add("correct");

    wrongSound.currentTime=0;

    wrongSound.play();

    setTimeout(removeCurrentSector,1800);

}

//=======================================
// حذف القطاع الحالي
//=======================================

function removeCurrentSector(){

    questionModal.classList.add("hidden");

    wheel.splice(currentIndex,1);

    questions.splice(currentIndex,1);

    remainingBox.textContent=wheel.length;

    if(wheel.length===0){

        finishGame();

        return;

    }

    drawWheel();

}

//=======================================
// شاشة النهاية
//=======================================

function finishGame(){

    bg.pause();

    finishSound.currentTime=0;

    finishSound.play();

    finalScore.textContent=score;

    finishScreen.classList.remove("hidden");

}

//=======================================
// اختصار لوحة المفاتيح
//=======================================

document.addEventListener("keydown",e=>{

    if(e.code==="Space"){

        e.preventDefault();

        if(!spinning){

            spinWheel();

        }

    }

});