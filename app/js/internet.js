import {setDownloadSpeed} from './download.js';
import {setBrowsingSpeed} from './browse.js';
import {mailReport} from './mail.js';
import {generateReport} from './report.js';

export async function getInternetTest(){
    const b_speed = setBrowsingSpeed().then(
        (result) => {
            console.log(result);
        }
    )

    const d_speed = setDownloadSpeed().then(
        (result) => {
            console.log(result);
        }
    )

    generateReport().then(
        (result) => {
            console.log(result);
        }
    )

    mailReport().then(
        (result) => {
            console.log(result);
        }
    )
} 