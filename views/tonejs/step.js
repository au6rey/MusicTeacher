// console.clear();
let channelRack = document.querySelector(".channelRack");

//Fill the rack
for (let channelNum = 0; channelNum < 3; channelNum++) {
  channelRack.innerHTML += `<tr class="channel${channelNum + 1}"></tr>`;
  let checks = document.querySelector(`.channel${channelNum + 1}`);
  let html = "";
  for (let beatNum = 0; beatNum < 16; beatNum++) {
    let style = "";
    if ((beatNum + 1) % 4 === 0) {
      console.log(beatNum);
      style = `style="padding-right: 10px; color= "red""`;
    }
    html += `  
    
    <td ${style}><input type="checkbox" name="checkboxG${channelNum + 1}${
      beatNum + 1
      }" 
      id="checkboxG${channelNum + 1}${beatNum + 1}" class="css-checkbox" 
      />
    <label for="checkboxG${channelNum + 1}${beatNum + 1}"
    class="css-label"></label></td>`;
  }
  checks.innerHTML = html;
}

let colhtml = "";
for (let beatNum = 0; beatNum < 16; beatNum++) {
  colhtml += `<col id= "step${beatNum + 1}">`;
}
colhtml = `<colgroup>${colhtml}</colgroup>`
channelRack.innerHTML += colhtml;
//END OF RENDERING CHANNEL RACK

const audioFiles = [
  new Tone.Player("../tonejs/audio/Kick.wav"),
  new Tone.Player("../tonejs/audio/Snare.wav"),
  new Tone.Player("../tonejs/audio/Hihat.wav"),
];

const gain = new Tone.Gain(1);
gain.toDestination();
audioFiles.forEach((audio) => audio.connect(gain));

const $rows = document.body.querySelectorAll(".channelRack > tbody > tr ");
let $playBtn = document.getElementById("play");
let $stopBtn = document.getElementById("stop");
console.log($rows);
const sample = new Tone.Player("../tonejs/audio/plane_162bpm_dripchord.wav").connect(
  gain
);
sample.loop = true;
// console.log($rows[0]);

let stepCol = document.querySelectorAll(`col`);

let index = 0;
Tone.Transport.scheduleRepeat((time) => {
  let step = index % 16;
  for (let i = 0; i < $rows.length; i++) {
    let audio = audioFiles[i],
      $row = $rows[i].querySelectorAll(`input`),
      $input = $row[step];
      stepCol.forEach((stp) => {
        stp.style.backgroundColor = ``;
      });
      stepCol[step].style.backgroundColor = `rgb(224,36,36)`;
      
    if ($input.checked) {
      if (audio.state === "started") audio.stop(time);
      audio.start(time);
    }
  }
  // console.log(stepCol);
  index++;
});


$playBtn.addEventListener("click", playLoop);
function playLoop() {
  if (Tone.Transport.state === "stopped") {
    index = 0;
    Tone.Transport.bpm.value = 80;
    Tone.Transport.start();

    // sample.start();
    sample.playbackRate = 0.5;
    console.log(Tone.Transport.state);
  }
}

$stopBtn.addEventListener("click", stopLoop);
function stopLoop() {
  Tone.Transport.stop();
  sample.stop();
  console.log(Tone.Transport.state);
}
