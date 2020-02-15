// In renderer process (web page).
const { ipcRenderer } = require('electron')
const data = ipcRenderer.sendSync('synchronous-message', 'ping') // prints "pong"

// const div = document.querySelector('#test');
const div = document.getElementById('test')

div.innerHTML = data;