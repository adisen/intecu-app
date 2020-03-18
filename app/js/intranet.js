import {setDownloadSpeed} from './download.js';
import {setBrowsingSpeed} from './browse.js';
import {mailReport} from './mail.js';
import {generateReport} from './report.js';

export async function getIntranetTest(){
    const b_speed = setBrowsingSpeed();
    const d_speed = setDownloadSpeed();
    
    const [browse,down] = await Promise.all([d_speed,b_speed]);

    console.log(browse,down);

    if(browse.success && down.success){
        console.log('down and browse speed done...');
        return({
            'completion'    :   true,
        });
    } else{
        console.log('Speed Test crashed...');
        return({
            'completion' :   false,
        });
    }
} 