const Imap = require('imap')
const inspect = require('util').inspect
const fs = require('fs')
const path = require('path')

var Store = require('../data/db/store')

var Mail = new Store('mail')

let config = JSON.parse(fs.readFileSync(path.resolve(__dirname,'./settings.json')))

var imap = new Imap(config)

function openInbox(cb) {
    imap.openBox('INBOX', true, cb);
}
imap.once('ready', function() {
    console.log('connected')
    openInbox(function(err, box) {
        if (err){ 
            console.log(err)
            throw err;
        }
      var f = imap.seq.fetch('1:3', {
        bodies: 'HEADER.FIELDS (FROM TO SUBJECT DATE)',
        struct: true
      });
      f.on('message', function(msg, seqno) {
        var prefix = '(#' + seqno + ') ';
        msg.on('body', function(stream, info) {
          var buffer = '';
          stream.on('data', function(chunk) {
            buffer += chunk.toString('utf8');
          });
          stream.once('end', function() {
            //fs.appendFileSync('./myfile.txt',prefix + 'Parsed header: %s'+ inspect(Imap.parseHeader(buffer)))
          });
        });
        msg.once('attributes', function(attrs) {
          //fs.appendFileSync('./myfile.txt',prefix + 'Attributes: %s' + inspect(attrs, false, 8))
        });
        msg.once('end', function() {
          //fs.appendFileSync('./myfile.txt',prefix + 'Finished')
        });
      });
      f.once('error', function(err) {
        console.log('Fetch error: ' + err);
      });
      f.once('end', function() {
        console.log('Done fetching all messages!');
        imap.end();
      });
    });
  });
  
  
  imap.once('end', function() {
    console.log('Connection ended');
  });
  imap.once('close', (e) => {
    console.log('disconnected')
  })
  imap.on('error',(e) => {
      console.log(e)
    console.log('connection closed')
})


function imapConnect(callback){
    try{
        console.log('connected')
        imap.connect()
    } catch (e){
        console.log(e)
    }
    if(callback){
        callback()
    }
}
module.exports = {
    imapConnect
}