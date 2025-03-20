const { app, BrowserWindow, ipcMain } = require('electron/main')
const path = require('node:path')
const { spawn } = require('child_process');
const fs = require('node:fs');

const createWindow = () => {
    const win = new BrowserWindow({
        width: 800,
        height: 600,
        frame: false,
        webPreferences: {
            nodeIntegration: true, // 启用 Node.js 集成
            preload: path.join(__dirname, 'preload.js')
        }
    })

    // win.autoHideMenuBar(true)

    win.loadFile('index.html')

    // win.webContents.openDevTools();
}

let devices = []
let apkPaths = []
let fileData
let fileName = ""

app.whenReady().then(() => {
    ipcMain.handle('ping', () => 'pong')

    ipcMain.handle('devices', async () => {
        const p = new Promise((resolve, reject) => {
            // 执行adb
            const child = spawn("tools/platform-tools/adb", ["devices"], { stdio: ['pipe', 'pipe', 'pipe'] })
            child.stdout.on('data', (data) => {
                console.log(`stdout: ${data}`);
                const deviceList = []
                data.toString().split('\n').forEach(element => {
                    if (element.includes('device') && !element.includes('List of devices attached')) {
                        deviceList.push(element.split('\t')[0])
                    }
                })
                resolve(deviceList)
            });
        })
        devices = await p
        return devices
    })

    ipcMain.handle('install', async () => {
        if (fileData && fileName) {
            const p = new Promise((resolve, reject) => {
                const file = apkPaths[0]
                fs.writeFileSync(__dirname + "/temp/" + fileName, Buffer.from(fileData))

                // 执行adb
                const child = spawn("tools/platform-tools/adb", ["install", "temp/" + fileName], { stdio: ['pipe', 'pipe', 'pipe'] })
                child.stdout.on('data', (data) => {
                    console.log(`stdout: ${data}`);
                    resolve(data.toString())
                });
                child.stderr.on('data', (data) => {
                    console.log(`stderr: ${data}`);
                    reject(new Error(data.toString()))
                });
            })
            const logs = await p
            return logs
        }

    })

    ipcMain.on("drag-file", (event, data, name) => {
        fileData = data
        fileName = name
    })



    createWindow()

    app.on('window-all-closed', () => {
        if (process.platform !== 'darwin') app.quit()
    })
})