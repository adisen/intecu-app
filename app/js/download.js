const request = require('request');
const fs = require('fs');

async function downloadFile(configuration){
    return new Promise(function(resolve, reject){
        var received_bytes;
        var total_bytes;

        var req = request({
            method: 'GET',
            uri: configuration.remoteFile
        },(error)=>{
            if(error){
            reject(error.code);
        }});

        var out = fs.createWriteStream(configuration.localFile);
        req.pipe(out);

        let start_date = (new Date()).getTime();
        req.on('response', function ( data ) {
            // Change the total bytes value to get progress later.
            total_bytes = parseInt(data.headers['content-length']);
        });

        let current_bytes;

        // Get progress if callback exists
        if(configuration.hasOwnProperty("onProgress")){
            // let raw_date = new Date();
            // let start_seconds = raw_date.getSeconds();
            req.on('data', function(chunk) {
                // Update the received bytes
                // current_bytes = chunk.length;
                // received_bytes += current_bytes;
                // raw_date = new Date;
                // let end_seconds = raw_date.getSeconds();

                // let timeDiff = end_seconds - start_seconds;

                // configuration.onProgress(received_bytes, total_bytes, timeDiff, current_bytes);
            });
        }else{
            req.on('data', function(chunk) {
                // Update the received bytes
                received_bytes += chunk.length;
            });
        }

        req.on('end', function() {
            let end_date = (new Date()).getTime();
            console.log(total_bytes);
            console.log((end_date - start_date)/1000);
            configuration.getdownloadSpeed(((total_bytes/1024)/((end_date - start_date)/1000)).toFixed(1)+'KBps');
            // console.log('time difference is: '+time_diff);
            // configuration.getdownloadSpeed(total_bytes/time_diff);
            resolve();
        });
    });
}


export async function setDownloadSpeed(){
    return new Promise((resolve,reject) => {
        try{
            console.log('download speed started...');

            let downloadSpeed;
            downloadFile({
                remoteFile: "https://upload.wikimedia.org/wikipedia/commons/f/f0/Black_Holes_-_Monsters_in_Space.jpg",
                localFile: "download.jpeg",
                // onProgress: function (received,total,timeDiff,current){
                //     var percentage = (received * 100) / total;
                //     console.log(percentage + "% | " + received + " bytes out of " + total + " bytes.");
                //     console.log(timeDiff);
                //     console.log(current);
                // },
                getdownloadSpeed: function(speed){
                    downloadSpeed = speed;
                },
            }).then(() => {
                console.log("Download speed successful");
                resolve({
                    'success'   :   true,
                    'downloadSpeed' :   downloadSpeed,
                });
            }).catch(() => {
                console.log('download speed crashed...');
                reject({
                    'success'   :   false,
                });
            });
        } catch {
            console.log('download speed crashed...');
            reject({
                'success'   :   false,
            });
        }
    });
}