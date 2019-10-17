var express = require('express');
var app = express();
var ms=require('mediaserver');
var path = require('path');
const fs = require('fs');
var bodyParser = require('body-parser');
const testFolder = './songs';
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');
app.use(bodyParser.urlencoded({ extended: true })); 
app.get("/",function(req,res){
  res.sendFile(path.join(__dirname + '/songlist.html'));
  
  var ret=new Array();
  fs.readdirSync(testFolder).forEach(file => {
    ret.push(file);
  });
  res.render('songlist.ejs',{arr:ret});
});
var playlistfiles=new Array();
var playlistnumber=new Array();
app.post("/songlist",function(req,res){
  
  var ret=new Array();
  fs.readdirSync('./songs').forEach(file => {
    ret.push(file);
  });
  playlistfiles=Array.from(ret);
  playlistnumber=Array.from(req.body.songlist);
  res.render('playlist.ejs',{playlistfiles:playlistfiles,length:playlistnumber.length});
});
app.get("/song/:songno",function(req,res){
  var i=req.params.songno;
  if(i>=playlistfiles.length)
    i=0;
    else if(i<0)
    i=playlistfiles.length-1;
  res.writeHead(200);
  fs.createReadStream('./songs/'+playlistfiles[playlistnumber[i]]).pipe(res);
});
app.listen(3000);