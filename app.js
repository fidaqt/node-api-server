const express = require('express');
const bodyParser = require('body-parser');
const ActiveDirectory = require('activedirectory2');
const hostname = 'localhost';
const port = 2255;
const app = express();

app.use(bodyParser.json())

app.all('*', function (req, res, next) {
    if (!req.get('Origin')) return next();
    res.set('Access-Control-Allow-Origin', '*');
    res.set('Access-Control-Allow-Methods', 'GET,POST');
    res.set('Access-Control-Allow-Headers', 'X-Requested-With,Content-Type');
    if ('OPTIONS' == req.method) return res.send(200);
    next();
});
app.post('/login', async (req, res) => {
    const config = {
        url: 'ldap://18.212.1.30',
        baseDN: 'dc=fida,dc=qt,dc=com',
        username: 'Administrator@fida.qt.com',
        password: 'DSPxd4Uq?!s!!Nx5h$y%7evYtGU%Q?;A'
    }
    const ad = new ActiveDirectory(config);
    const username = req.body.username;
    const password = req.body.password;

    ad.authenticate(username, password, (err, auth) => {
        if (err) {
            console.log('ERROR: ' + JSON.stringify(err));
            return res.status(400).send({ error: 'Authentication failed!' });
        }

        if (auth) {
            console.log('Authenticated!');
            return res.status(200).send({ success: 'Authenticated!' });

        }
        else {
            console.log('Authentication failed!');
            return res.status(400).send({ error: 'Authentication failed!' });
        }
    });
    // res.status(200).send(true);
});

app.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
});