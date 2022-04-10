//Global Variables
var pattern = [3, 2, 1, 2, 3, 3, 3, 2, 2, 2, 3, 3, 3, 3, 2, 1, 2, 3, 3, 3, 1, 2, 2, 3, 2, 1];
var progress = 0; 
var gamePlaying = false;
var tonePlaying = false;
var volume = 0.5;
const clueHoldTime = 1000;
const cluePauseTime = 333;
const nextClueWaitTime = 1000;
var guessCounter = 0;

function startGame(){
  progress = 0;
  gamePlaying = true;
  document.getElementById("startBtn").classList.add("hidden");
  document.getElementById("endBtn").classList.remove("hidden");
  playClueSequence();
}

function stopGame(){
  gamePlaying = false;
  document.getElementById("startBtn").classList.remove("hidden");
  document.getElementById("endBtn").classList.add("hidden");
}

// Sound Synthesis Functions
const freqMap = {
  1: 261.6,
  2: 294.3,
  3: 327,
  4: 348.8,
  5: 392.4,
  6: 436,
  7: 490.6,
  8: 523.3
}
function playTone(btn,len){ 
  o.frequency.value = freqMap[btn]
  g.gain.setTargetAtTime(volume,context.currentTime + 0.02,0.01)
  context.resume()
  tonePlaying = true
  setTimeout(function(){
    stopTone()
  },len)
}
function startTone(btn){
  if(!tonePlaying){
    context.resume()
    o.frequency.value = freqMap[btn]
    g.gain.setTargetAtTime(volume,context.currentTime + 0.02,0.01)
    context.resume()
    tonePlaying = true
  }
}
function stopTone(){
  g.gain.setTargetAtTime(0,context.currentTime + 0.02,0.01)
  tonePlaying = false
}

// Page Initialization
// Init Sound Synthesizer
var AudioContext = window.AudioContext || window.webkitAudioContext 
var context = new AudioContext()
var o = context.createOscillator()
var g = context.createGain()
g.connect(context.destination)
g.gain.setValueAtTime(0,context.currentTime)
o.connect(g)
o.start(0)

function lightButton(btn){
  document.getElementById("button" + btn).classList.add("lit");
}
function clearButton(btn){
  document.getElementById("button" + btn).classList.remove("lit");
}
function playSingleClue(btn) {
  if (gamePlaying) {
    lightButton(btn);
    playTone(btn, clueHoldTime);
    setTimeout(clearButton, clueHoldTime, btn); //essentially plays sound for the amount of specified time and then clearsbutton
  }
}
function playClueSequence() {
  //context.resume()
  guessCounter = 0;
  let delay = nextClueWaitTime; //set delay to initial wait time
  for (let i = 0; i <= progress; i++){ // for each clue that is revealed so far
    console.log("play single clue: " + pattern[i] + " in " + delay + "ms")
    setTimeout(playSingleClue,delay,pattern[i]) // set a timeout to play that clue
    delay += clueHoldTime 
    delay += cluePauseTime;
  }
}
function loseGame(btn) {
  stopGame();
  alert("Game Over. You Lost.")
}
function winGame(btn) {
  stopGame();
  alert("Game Over. You Won!")
}
function guess(btn) {
  console.log("user guessed: " + btn);
  if (!gamePlaying) return;
  
  if (pattern[guessCounter] == btn){
    if (guessCounter == progress){
      if (progress == pattern.length - 1){
        winGame();
      } else {
        progress++;
        playClueSequence();
      }
    } else {
      guessCounter++;
    }
  } else {
    loseGame();
  }
}