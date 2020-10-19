const fs = require('fs');
const opn = require('opn');
const express = require('express');
const session = require('express-session');

function checkAuth(req, res, next) {
  if (!req.session.username) {
    res.send('You are not authorized to view this page');
  } else {
    next();
  }
}

const main = async function() {

    const config = JSON.parse(fs.readFileSync('config.json'));

    const web = config['web'][0];
    opn('http://' + (web.host==='0.0.0.0' ? '127.0.0.1' : web.host) + ':' + web.port);    
    
    const app = express();
    app.use(express.static(config.static));
    app.use(express.urlencoded({extended: true})); // Parse URL-encoded bodies (as sent by HTML forms)
    app.use(express.json()); // Parse JSON bodies (as sent by API clients)
    app.set('json spaces', 2);
    if (config.cors) {
        let whitelist = config.origins||[];
        if (whitelist.length>0) {
          whitelist = [localhostOrigin].concat(whitelist);
        }
        console.log('whitelist', whitelist);
        app.use(cors({
            origin: function(origin, callback){
                if(!origin) return callback(null, true);
                if(whitelist.length>0 && whitelist.indexOf(origin) === -1){
                    const msg = 'origin not allowed ' + origin;
                    return callback(new Error(msg), false);
                }
                return callback(null, true);
            }
            ,credentials:true})
        );
    }
    
    app.use(session({secret: "dr56tfgy7"}));
    
    const server = app.listen(web.port, web.host, ()=>{
        const address = server.address();
        console.log("listen http://%s:%s", address.address, address.port);
    });
    
    app.get('/secret', checkAuth, function (req, res) {
        res.send('3.1415926535 is the secret');
    });
    
    app.post('/login', function (req, res) {
      var post = req.body;
      console.log(post);
      if (post.username === 'john' && post.password === 'johnpassword') {
        req.session.username = 'john';
        res.send('login ok');
      } else {
        res.send('Bad user/pass');
      }
    });
    
    app.get('/logout', function (req, res) {
        delete req.session.username;
        res.send('logout ok');
    });
}

if (require.main===module) {
    main()
}