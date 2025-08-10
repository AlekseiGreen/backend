const https = require('node:https');

https.get('https://jsonplaceholder.typicode.com/users', (res)=>{
    console.log(res.statusCode);
    console.group("\r\nPayload:");

    let data = '';

    res.on('data', (chunk)=>{
        data += chunk;
    });

    res.on('end', ()=>{
        const usersArray = JSON.parse(data);
        console.log(usersArray?.[0]);
    });
}).on('error', (err)=>{
    console.error(`Error: ${err}`);
})