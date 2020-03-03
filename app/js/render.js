/** @format */

const shell = require('electron').shell;
// Get elements from DOM
let systemManufacturer = document.querySelector('#systemManufacturer');
let cpuManufacturer = document.querySelector('#cpuManufacturer');
let cpuBrand = document.querySelector('#cpuBrand');
let cpuSpeed = document.querySelector('#cpuSpeed');
let OS = document.querySelector('#OS');
let OSName = document.querySelector('#OSName');
let OSType = document.querySelector('#OSType');
let RAM = document.querySelector('#RAM');
let host = document.querySelector('#host');


let ipAddress = document.querySelector('#ipAddress');
let gateway = document.querySelector('#gateway');
let speed = document.querySelector('#speed');
let login = document.querySelector('#login');
let continual = document.querySelector('#continual');
let latency = document.querySelector('#latency');
let connectionInterface = document.querySelector('#connectionInterface');
let message = document.querySelector('#message');
let ping = document.querySelector('#ping');
// Renderer process (web page).
const { ipcRenderer } = require('electron');

// Getting system details from the main process
ipcRenderer.on('getSystemDetails', (event, arg) => {
  // console.log(arg);
  host.innerHTML = arg.host;
  systemManufacturer.innerHTML = arg.systemManufacturer;
  cpuManufacturer.innerHTML = arg.cpuManufacturer;
  cpuSpeed.innerHTML = arg.cpuSpeed;
  cpuBrand.innerHTML = arg.cpuBrand;
  OS.innerHTML = arg.operatingSystem;
  OSName.innerHTML = arg.operatingSystemName;
  OSType.innerHTML = arg.operatingSystemType;
  RAM.innerHTML = arg.RAM;
});
ipcRenderer.send('system-message');

// Getting network details from the main process
ipcRenderer.on('getNetworkDetails', (event, arg) => {
  // console.log(arg);
  if(arg){
    ipAddress.innerHTML = arg.ipAddress;
    gateway.innerHTML = arg.gateway;
    speed.innerHTML = arg.speed;
    latency.innerHTML = arg.latency;

    if(arg.netInterface.type == 'wireless'){
      connectionInterface.innerHTML = 'Wireless'
    } else{
      connectionInterface .innerHTML = 'LAN'
    }
    console.log(arg.siteTest);
    if(arg.siteTest.ok){
      message.innerHTML = 'You\'re Logged in, Continue to Browse.';
    } else{
      message.innerHTML = 'You\'re not Logged in, Click the Login button below.';
    }
  }
});
try {
  ipcRenderer.send('netowrk-message');
} catch (error) {
  console.log(error);
}




setInterval(() => {
  // Getting network details from the main process
  ipcRenderer.on('getNetworkDetails', (event, arg) => {
    // console.log(arg);
    if(arg){
      ipAddress.innerHTML = arg.ipAddress;
      gateway.innerHTML = arg.gateway;
      speed.innerHTML = arg.speed;
      latency.innerHTML = arg.latency;

      if(arg.netInterface.type == 'wireless'){
        connectionInterface.innerHTML = 'Wireless'
      } else{
        connectionInterface .innerHTML = 'LAN'
      }
      console.log(arg.siteTest);
      if(arg.siteTest.status == 404){
        message.innerHTML = 'You\'re not Logged in, Click the Login button below.';
      } else{
        message.innerHTML = 'You\'re Logged in, Continue to Browse.';
      }
      ping.innerHTML = arg.ping;
    }
    
  });
  ipcRenderer.send('netowrk-message');

}, 15000);



login.addEventListener('click',($event)=>{
  shell.openExternal('https://gateway.oauife.edu.ng/');
});

continual.addEventListener('click',($event)=>{
  shell.openExternal('https://gateway.oauife.edu.ng/');
});