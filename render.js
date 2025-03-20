

const dropzone = document.getElementById("drop_zone")


dropzone.addEventListener('dragover', (ev) => {

    // Prevent default behavior (Prevent file from being opened)
    ev.preventDefault();
    ev.stopPropagation();


})

dropzone.addEventListener('drop', async (ev) => {
    ev.preventDefault();
    ev.stopPropagation();
    if (ev.dataTransfer.items) {
        // Use DataTransferItemList interface to access the file(s)
        for (var i = 0; i < ev.dataTransfer.items.length; i++) {
            // If dropped items aren't files, reject them
            if (ev.dataTransfer.items[i].kind === "file") {
                if (i === 0) {
                    var file = ev.dataTransfer.items[i].getAsFile();
                    dropzone.innerText = file.name
                    const buffer = await file.arrayBuffer()
                    window.electron.send('drag-file', buffer, file.name)
                }
            }
        }
    } else {

        // // Use DataTransfer interface to access the file(s)
        // for (var i = 0; i < ev.dataTransfer.files.length; i++) {
        //     if (i === 0) {
        //         const apkpath = ev.dataTransfer.files[i].path
        //         dropzone.innerText = apkpath
        //         apkPaths.push(file)
        //     }
        // }

    }

})

const installButton = document.getElementById("install")



installButton.addEventListener('click', install)



async function install() {
    try {
        const response = await window.adb.devices()
        document.getElementById('device').innerText = "当前设备列表:" + response.join(",")
        const logs = await window.adb.install()
        document.getElementById('log').innerText = logs
    } catch (e) {
        console.log(e)
    }

}
