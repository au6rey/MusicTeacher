
  // UPDATE: there is a problem in chrome with starting audio context
  //  before a user gesture. This fixes it.
  var started = false;
  document.documentElement.addEventListener('mousedown', () => {
    if (started) return;
    started = true;
    const inst = new Instrument();
    const midi = new MIDIAccess({ onDeviceInput });
    midi.start().then(() => {
      console.log('STARTED!');
    }).catch(console.error);
  
    function onDeviceInput({ input, value }) {
      if (input === 23) inst.toggleSound(value);
      else if (input === 2) inst.handleVolume(value);
      else if (input === 14) inst.handleFilter(value);
      else console.log('onDeviceInput!', input, value);
    }
  });
  