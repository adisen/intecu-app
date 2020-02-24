/** @format */

// Get elements from DOM
let model = document.querySelector('#model');
let cpuName = document.querySelector('#cpuName');
let cpuSpeed = document.querySelector('#cpuSpeed');
let ipAddress = document.querySelector('#ipAddress');
let gateway = document.querySelector('#gateway');
let speed = document.querySelector('#speed');

// Renderer process (web page).
const { ipcRenderer } = require('electron');

// Getting system details from the main process
ipcRenderer.on('getSystemDetails', (event, arg) => {
  console.log(arg);
  model.innerHTML = arg.model;
  cpuName.innerHTML = arg.cpuName;
  cpuSpeed.innerHTML = arg.cpuSpeed;
});
ipcRenderer.send('system-message');

// Getting network details from the main process
ipcRenderer.on('getNetworkDetails', (event, arg) => {
  console.log(arg);
  ipAddress.innerHTML = arg.ipAddress;
  gateway.innerHTML = arg.gateway;
  speed.innerHTML = arg.speed;
});
ipcRenderer.send('netowrk-message');
