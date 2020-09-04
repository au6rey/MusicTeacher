//Will store created notes
var midikeys = [];
//Will generate notes and html
var data = ["C", "D", "E", "F", "G", "A", "B"];
//Will render eys/notes
var html = "";
var activeNotesHtml = "";
//Midi control of volume. filter and their outputs
{
  var volSlider = document.getElementById("volumeSlider");
  var filtSlider = document.getElementById("filterSlider");
  var volOutput = document.getElementById("volumeValue");
  var filtOutput = document.getElementById("filterValue");
}


//Render keys by specified number of octaves using data array
//Octave + 4 = 4th Octave
for (var octave = 0; octave < 2; octave++) {
  for (var i = 0; i < data.length; i++) {
    var note = data[i];
    var hasSharp = ["E", "B"].indexOf(note) == -1;
    html += `<div class='whitenote' 
        id='${note + (octave + 4)}'
        ondragenter='noteDown( this, false)' 
        onmousedown='noteDown(this, false)' 
        onmouseup='noteUp(this,false)' 
        onmouseleave='noteUp(this,false)' 
        ondragleave='noteUp(this,false)' 
        data-note='${note + (octave + 4)}'>
        <p id='notename'>${note + (octave + 4)}</p>`;
    
    //Insert non-sharp keys to array
    midikeys.push(note + (octave + 4));

    if (hasSharp) {
      html += `<div class='blacknote' 
          id='${note + "#" + (octave + 4)}'
          ondragenter='noteDown(this, true)'  
          onmousedown='noteDown(this, true)' 
          onmouseup='noteUp(this, true)' 
          onmouseleave='noteUp(this,true)' 
          ondragleave='noteUp(this,true)' 
          data-note='${note + "#" + (octave + 4)}'>
          <p id='notename'>${note + "#" + (octave + 4)}</p>
          </div>`;
      //Insert sharp keys to array
      midikeys.push(note + "#" + (octave + 4));
    }

    html += `</div>`;
  }
}

console.log(midikeys);
document.getElementById("keyscontainer").innerHTML = html;

//Instrument class
class Instrument {
  constructor() {
    this.synth = new Tone.PolySynth();
    this.filter = new Tone.Filter();
    this.volume = new Tone.Gain();
    this.synth.connect(this.filter);
    this.filter.connect(this.volume);
    this.volume.toDestination();
    this.filter.frequency.value = 5000; // 200 - 15000
    this.volume.gain.value = 0.4; // 0-0.8
    console.log(this.synth.get());
  }

  //Play a note
  playSound(note) {
    this.synth.triggerAttack(note);
  }

  //Release a note

  stopSound(note){
    this.synth.triggerRelease(note);
    event.stopPropagation();
  }

  //Volume control
  handleVolume(value) {
    // 0-127
    let val = (value / 127) * 0.8;
    this.volume.gain.value = val;
  }

  //Filter control
  handleFilter(value) {
    // 0-127
    let val = (value / 127) * 14800 + 200;
    this.filter.frequency.value = val;
  }
}

//Make new instrument
const inst = new Instrument();
//Array to store actively playing notes
let activeNotes = [];

//Runs when midi is activated
function onDeviceInput({ _, input, value }) {
  if (input === 1) {
    inst.handleVolume(value);
    volumeSlider.value = value;
    volOutput.innerHTML = value;
  } else if (input === 2) {
    inst.handleFilter(value);
    filterSlider.value = value;
    filtOutput.innerHTML = value;
  } else if (input >= 48 && input <= 72) {
    let keyIndex = midikeys.length - (72 - input);
    let elem = document.getElementById(midikeys[keyIndex]);
    let sharpTest = midikeys[keyIndex].indexOf("#") !== -1;

    if (!input || value === 0) {
      noteUp(elem, sharpTest);
    }

    if (value > 0) {
      inst.playSound(midikeys[keyIndex]);
      elem.style.background = sharpTest ? "black" : "#ccc";
      displayNotes(midikeys[keyIndex]);
    }
  } else console.log("onDeviceInput!", input, value);
}

//Handle mouse drag input of volume and filter
{
  volOutput.innerHTML = volSlider.value;
  filtOutput.innerHTML = filtSlider.value;
  volSlider.oninput = function () {
    volOutput.innerHTML = this.value;
    inst.handleVolume(this.value);
  };
  filtSlider.oninput = function () {
    filtOutput.innerHTML = this.value;
    inst.handleFilter(this.value);
  };
}
//Relaxed note
function noteUp(elem, isSharp) {
  activeNotes = [];
  inst.stopSound(elem.dataset.note);
  document.getElementById("noteslist").innerHTML = "";
  elem.style.background = isSharp ? "#777" : "";
}

//Pressed note
function noteDown(elem, isSharp) {
  var note = elem.dataset.note;
  inst.playSound(note);
  displayNotes(note);
  elem.style.background = isSharp ? "black" : "#ccc";
}

//Display currently playing notes
let displayNotes = (note) => {
  activeNotes.push(note);
  console.log("ACTIVE", activeNotes);
  activeNotesHtml = activeNotes;
  document.getElementById("noteslist").innerHTML = activeNotesHtml;
};
