const XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;

export function setBrowsingSpeed(){
    return new Promise((resolve,reject)=>{

        try{
            console.log('browsing speed started...')
            let browsingSpeed;
            var xhr = new XMLHttpRequest();

            xhr.onreadystatechange = () => {

                if (xhr.readyState === 4 && xhr.status === 200) {
                    console.log('Browsing responded...');
                    const endTime = (new Date()).getTime();
        
                    const fileSize = xhr.responseText.length;

                    var speed = (fileSize/1024) / ((endTime - startTime)/1000);
                    console.log(fileSize / ((endTime - startTime)/1000) / 1024);

                    browsingSpeed = speed.toFixed(1)+'KBps';
                    // returnSpeed(speed.toFixed(1)+'KBps');
                    // Report the result, or have fries with it...
                    // console.log(((endTime - startTime)/1000));
                    // console.log(speed + " kBps\n");
                    console.log('browsing speed successful...');
                    resolve({
                        'success'   :   true,
                        'browsingSpeed' :   browsingSpeed,
                    });
                }
            }
        
            const startTime = (new Date()).getTime();
        
            xhr.open("GET", 'https://edition.cnn.com/', true);
            xhr.send();
        } catch {
            console.log('browsing speed crashed...');
            reject({
                'success'   :   false,
            });
        }
    });
}
  