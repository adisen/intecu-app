/** @format */

// Main Process
const electron = require('electron');
const si = require('systeminformation');

const { app, BrowserWindow, Menu, ipcMain, ipcRenderer } = require('electron');

// Get system details
const getSystemInformation = async () => {
  // Processor type, IP Address, RAM, System Model, OS,
  try {
    const systemData = await si.system();
    const manufacturer = systemData.manufacturer;
    const model = systemData.model;

    const cpuData = await si.cpu();
    const cpuName = cpuData.manufacturer + ' ' + cpuData.brand;
    const cpuSpeed = cpuData.speed;

    return {
      manufacturer,
      model,
      cpuName,
      cpuSpeed
    };
  } catch (err) {
    console.log(err);
  }
};

// Function to get the network details
const getNetworkInformation = async () => {
  // IP Address, SSID, Network Speed,
  try {
    const networkData = await si.networkInterfaces();
    const ipAddress = networkData[1].ip4;
    const gateway = await si.networkGatewayDefault();
    const SSID = networkData[1].ifaceName;
    const speed = networkData[1].speed;

    return {
      ipAddress,
      gateway,
      SSID,
      speed
    };
  } catch (err) {
    console.log(err);
  }
};

// Load main window when ready
app.on('ready', () => {
  const mainWindow = new BrowserWindow({
    width: 1024,
    height: 800,
    webPreferences: {
      nodeIntegration: true
    }
  });

  // and load the index.html of the app.
  mainWindow.loadFile('app/index.html');

  const mainMenu = Menu.buildFromTemplate(mainMenuTemplate);
  Menu.setApplicationMenu(mainMenu);

  const data = 'We are trying to send this to the frontend';

  mainWindow.webContents.send('test', data);
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
