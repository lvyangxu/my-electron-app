const { contextBridge, ipcRenderer } = require('electron')

// window.adb = {
//     devices: () => ipcRenderer.invoke('devices'),
//     install: () => ipcRenderer.invoke('install')
//     // 除函数之外，我们也可以暴露变量
// }



// window.electron = {
//     send: (channel, ...args) => ipcRenderer.send(channel, ...args)
// }

contextBridge.exposeInMainWorld('adb', {
    devices: () => ipcRenderer.invoke('devices'),
    install: () => ipcRenderer.invoke('install')
    // 除函数之外，我们也可以暴露变量
})

contextBridge.exposeInMainWorld('electron', {
    send: (channel, ...args) => ipcRenderer.send(channel, ...args)
})