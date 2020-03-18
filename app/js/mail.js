const nodemailer = require("nodemailer");

export async function mailReport(){
    return new Promise((resolve,reject) => {
        try{
            const path_to_report = './';

            let transport = nodemailer.createTransport({
                // ...
                host: 'smtp.gmail.com',
                port: 587,
                secure: false,
                auth: {
                user: 'aderinlokunoluwaseun@gmail.com',
                pass: 'gmail08@'
                }
            });
        
            const message = {
                from: 'aderinlokunoluwaseun@gmail.com',
                to: 'aderinlokunoluwaseun@gmail.com',
                subject: 'My first Node mail',
                html: '<h1>The First Node Mail</h1><p>I\'m doing <b>well</b> today!</p>',
                attachments: [
                    { // Use a URL as an attachment
                    filename: 'report.pdf',
                    path: path_to_report+'report.pdf'
                }
                ]
            };

            transport.sendMail(message, function (err, info) {
                // ...
                if (err) {
                    console.log(err)
                    console.log('mailing crashed...');
                    reject({
                        success :   false,
                    });
                } else {
                    console.log(info);
                    console.log('mailing was successful...');
                    return {
                        'path_to_report'    :   path_to_report+'report.pdf',
                        'success': true,
                    };
                }
            });
        } catch{
            console.log('mailing crashed...');
            reject({
                success :   false,
            });
        }
        
    });
    
}
  