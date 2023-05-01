const express = require('express');

const app = express();

app.use(express.static(__dirname + '/dist'))

app.get('/', function(req, res){
    res.sendFile(__dirname + '/dist/index.html');
})

let server = app.listen(8888, function(){
    console.log('App server is running on port 8888');
});