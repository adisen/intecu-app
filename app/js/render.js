/** @format */

const shell = require('electron').shell;
const { ipcRenderer } = require('electron');

//importing modules
import {getIntranetTest} from './intranet.js';
import {getInternetTest} from './internet.js';

import {mailReport} from './mail.js';
const fs = require('fs');

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
let date = document.querySelector('#date');

let ipAddress = document.querySelector('#ipAddress');
let gateway = document.querySelector('#gateway');
let speed = document.querySelector('#speed');
let login = document.querySelector('#login');
login.disabled = true;
let continual = document.querySelector('#continual');
continual.disabled = true;
let latency = document.querySelector('#latency');
let connectionInterface = document.querySelector('#connectionInterface');
let message = document.querySelector('#message');
let ping = document.querySelector('#ping');

let browse = document.querySelector('#browse');
let down = document.querySelector('#down');
let up = document.querySelector('#up');
let err = document.querySelector('#err');

let systemDet = false;
let systemDetData;
let intranetDet = false;
let internetDet = false;
let networkDet = false;
let networkDetData;


// Getting system details from the main process
ipcRenderer.on('getSystemDetails', (event, arg) => {
    // console.log(arg);
    date.innerHTML = arg.date;
    host.innerHTML = arg.host;
    systemManufacturer.innerHTML = arg.systemManufacturer;
    cpuManufacturer.innerHTML = arg.cpuManufacturer;
    cpuSpeed.innerHTML = arg.cpuSpeed;
    cpuBrand.innerHTML = arg.cpuBrand;

    if(arg.operatingSystem == 'darwin'){
        OS.innerHTML = 'MAC';
    } else if(arg.operatingSystem == 'win32'){
        OS.innerHTML = 'Windows';
    } else if(arg.operatingSystem == 'linux') {
        OS.innerHTML = 'Linux';
    }

    OSName.innerHTML = arg.operatingSystemName;
    OSType.innerHTML = arg.operatingSystemType;
    RAM.innerHTML = arg.RAM;
  
    systemDetData = arg;
    systemDet = true;
});
ipcRenderer.send('system-message');

// Getting network details from the main process
ipcRenderer.on('getNetworkDetails', async (event, arg) => {
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
            continual.disabled = false;
        } else{
            message.innerHTML = 'You\'re not Logged in, Click the Login button below.';
            login.disabled = false;
        }
        ping.innerHTML = ping;

        networkDetData = arg;
        networkDet = true;
    }

    if(systemDet && networkDet){

        await getIntranetTest().then((result) => {
            console.log('Test completed...');
            console.log(result);

            browse.innerHTML = result.browse;
            down.innerHTML = result.down;
            up.innerHTML = up.up;

            ipcRenderer.on('generatePDF', async (event, arg) => {
                console.log(arg);

                const mail = await mailReport();

                console.log(mail);

                try{
                    fs.unlink('report.pdf', (error) => {
                        if(error){
                            console.log(error);
                        }
                    });
                } catch (error) {
                    console.log(error);
                }
            });
            ipcRenderer.send('getPDF',{
                'down'   :   result.down,
                'browse' :   result.browse
            });
        }).catch((error) => {
            console.log('Test crashed...');
            err.innerHTML = "Test has crashed! Try to reload..."
            console.log(error);
        });

        if(arg.siteTest.status != 404){
            continual.disabled = false;
            await getInternetTest().then((result) => {
                console.log('Test completed...');
                console.log(result);
    
                browse.innerHTML = result.browse;
                down.innerHTML = result.down;
                up.innerHTML = up.up;
    
                ipcRenderer.on('generatePDF', async (event, arg) => {
                    console.log(arg);
    
                    const mail = await mailReport();
    
                    console.log(mail);
    
                    try{
                        fs.unlink('report.pdf', (error) => {
                            if(error){
                                console.log(error);
                            }
                        });
                    } catch (error) {
                        console.log(error);
                    }
                });
                ipcRenderer.send('getPDF',{
                    'down'   :   result.down,
                    'browse' :   result.browse
                });
            }).catch((error) => {
                console.log('Test crashed...');
                err.innerHTML = "Test has crashed! Try to reload..."
                console.log(error);
            });
        } else{
            login.disabled = false;
        }
    }
});
try {
    ipcRenderer.send('netowrk-message');
} catch (error) {
    console.log(error);
}

login.addEventListener('click',($event)=>{
    shell.openExternal('https://');
});

continual.addEventListener('click',($event)=>{
    shell.openExternal('https://');
});