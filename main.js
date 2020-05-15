const fs = require('fs');
const opn = require('opn');
const express = require('express');
const protobuf = require("protobufjs");

const configJson = JSON.parse(fs.readFileSync('config.json'));

const main = async function() {
    const web = configJson['Web'][0];
    opn('http://' + (web.host==='0.0.0.0' ? '127.0.0.1' : web.host) + ':' + web.port);    
    
    const app = express();
    app.use(express.static('templates'));
    app.use(express.urlencoded({extended: true})); // Parse URL-encoded bodies (as sent by HTML forms)
    app.use(express.json()); // Parse JSON bodies (as sent by API clients)
    app.set('json spaces', 2);
    
    const server = app.listen(web.port, web.host, ()=>{
        const address = server.address();
        console.log("listen http://%s:%s", address.address, address.port);
    });
}

if (require.main===module) {
    main()
}