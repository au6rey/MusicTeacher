// console.clear();
let connectedKeyboards = [];
class MIDIAccess {
  constructor(args = {}) {
    this.onDeviceInput = args.onDeviceInput || console.log;
  }

  start() {
    return new Promise((resolve, reject) => {
      this._requestAccess()
        .then((access) => {
          this.initialize(access);
          resolve();
        })
        .catch(() => reject("Something went wrong."));
    });
  }

  initialize(access) {
    const devices = access.inputs.values();

    for (let device of devices) {
      this.initializeDevice(device);
      connectedKeyboards.push(device);
    }
    console.log(connectedKeyboards);
  }

  initializeDevice(device) {
    device.onmidimessage = this.onMessage.bind(this);
  }

  onMessage(message) {
    
    let [_, input, value] = message.data;
    this.onDeviceInput({ input, value });
    
  }

  _requestAccess() {
    return new Promise((resolve, reject) => {
      if (navigator.requestMIDIAccess)
        navigator.requestMIDIAccess().then(resolve).catch(reject);
      else reject();
    });
  }
}

const midi = new MIDIAccess({ onDeviceInput });
midi
  .start()
  .then(() => {
    console.log("STARTED!");
  })
  .catch(console.error);
