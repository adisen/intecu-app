/** @format */

// Main Process
const electron = require('electron');

const PDFDocument = require('pdfkit');
const fs = require('fs');


const si = require('systeminformation');
const os = require('os');

const exec = require('child_process').exec;

const { app, BrowserWindow, Menu, ipcMain } = electron;

// Get system details
const getSystemInformation = async () => {
  // Processor type, IP Address, RAM, System Model, OS,
  try {

    let raw_date = new Date();
    const year = raw_date.getFullYear();
    const month = ("0" + (raw_date.getMonth() + 1)).slice(-2);
    const re_date = ("0" + raw_date.getDate()).slice(-2);;
    const hours = raw_date.getHours();
    const minutes = raw_date.getMinutes();
    const seconds = raw_date.getSeconds();
    const date = re_date + ":" + month + ":" + year + " " + hours + ":" + minutes + ":" + seconds;
    
    
    
    const systemData = await si.system();
    const systemManufacturer = await systemData.manufacturer;
    const model = await systemData.model;
    const host = await os.hostname();

    const cpuData = await si.cpu();
    const cpuManufacturer = await cpuData.manufacturer;
    const cpuBrand = await cpuData.brand;
    const cpuSpeed = await cpuData.speed;
    const operatingSystem = (await si.osInfo()).platform;
    const operatingSystemName = (await si.osInfo()).distro;
    const operatingSystemType = (await si.osInfo()).arch;
    const RAM = await Math.round((await si.mem()).total/(1073741824))+' GB';

    return {
      date,
      systemManufacturer,
      cpuManufacturer,
      cpuBrand,
      model,
      cpuSpeed,
      operatingSystem,
      operatingSystemName,
      operatingSystemType,
      RAM,
      host,
    };

  } catch (err) {
    console.log(err);
  }
};

const generatetPDF = async (arg) => {
    
    try{
        console.log('started generating report...');

        const doc = new PDFDocument;
        
        doc.pipe(fs.createWriteStream('report.pdf'));

        // Embed a font, set the font size, and render some text
        doc.font('fonts/Quicksand-Light.ttf')
        .fontSize(25)
        .text('Browsing Speed is: '+arg.browse+'\n'+'Download Speed is: '+arg.down+'\n', 100, 100);

        doc.end();

        return {
            'success'   :   true,
        };
    } catch (error) {
        console.log('report generation crashed...');
        console.log(error)
        return {
            'success'   :   false,
        };
    }
}

// Function to get the network details
const getNetworkInformation = async () => {
  // IP Address, SSID, Network Speed,
  try {
      const networkData = await si.networkInterfaces();
      // const ipAddress = networkData[1].ip4;
      const gateway = await si.networkGatewayDefault();
      const siteTest = await si.inetChecksite('www.youtube.com');

      const latency = await si.inetLatency();

      for (let index = 0; index < networkData.length; index++) {
        interface = networkData[index];
        if(interface.mac){
          netInterface = interface;
          ipAddress = netInterface.ip4;
          break;
        }
      }
      
      const SSID = await netInterface.ifaceName;
      // const speed = await netInterface.speed+' Kb/s';

      // async function execute(command, callback) {
      //   exec(command, (error, stdout, stderr) => { 
      //     if(error){
      //       callback(error);
      //     } else if (stderr){
      //       callback(stderr);
      //     }else {
      //       callback(stdout); 
      //     }
      //   });
      // };
      
      // call the function
      // const ping = await exec('ping -c 4 10.19.0.1');
      // console.log(ping);

      return {
        ipAddress,
        gateway,
        SSID,
        siteTest,
        latency,
        netInterface,
        // speed,
        // ping,
      };
  } catch (err) {
    console.log(err);
  }
};

// Load main window when ready
app.on('ready', () => {
  let mainWindow = new BrowserWindow({
    width: 800,
    height: 800,
    // show: false,
    webPreferences: {
      nodeIntegration: true
    }
  });

  // and load the index.html of the app.
  mainWindow.loadFile('./app/index.html');

  const mainMenu = Menu.buildFromTemplate(mainMenuTemplate);
  Menu.setApplicationMenu(mainMenu);

  const data = 'We are trying to send this to the frontend';

  mainWindow.webContents.send('test', data);

  mainWindow.on('closed', ()=>{
    mainWindow = null;
  });

  // mainWindow.once('ready-to-show', ()=>{
  //   mainWindow.show();
  // });
});

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

const mainMenuTemplate = [
  {
    label: 'Help',
    role: 'help'
  },
  {
    role: 'reload'
  }
];

// If MacOS, add emplty object to shift the menu
if (process.platform == 'darwin') {
  mainMenuTemplate.unshift({});
}

// Add developer tools in development mode
if (process.env.NODE_ENV !== 'production') {
  mainMenuTemplate.push({
    label: 'Developer Tools',
    submenu: [
      {
        label: 'Toggle Developer Tools',
        accelerator: process.platform == 'darwim' ? 'Command+I' : 'Ctrl+I',
        click(item, focusedWindow) {
          focusedWindow.toggleDevTools();
        }
      }
    ]
  });
}

ipcMain.on('system-message', async (event, arg) => {
  console.log(await getSystemInformation());
  event.reply('getSystemDetails', await getSystemInformation());
});

ipcMain.on('netowrk-message', async (event, arg) => {
  console.log(await getNetworkInformation());
  event.reply('getNetworkDetails', await getNetworkInformation());
});

ipcMain.on('getPDF', async (event, arg) => {
    event.reply('generatePDF', await generatetPDF(arg));
});