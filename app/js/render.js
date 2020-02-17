/** @format */

// Renderer process (web page).
const { ipcRenderer } = require('electron');

// Getting system details from the main process
ipcRenderer.on('getSystemDetails', event => {
  console.log(arg);
});
ipcRenderer.send('system-message');

// Getting network details from the main process
ipcRenderer.on('getNetworkDetails', (event, arg) => {
  console.log(arg);
});
ipcRenderer.send('netowrk-message');
