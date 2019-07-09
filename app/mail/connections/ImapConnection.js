const Imap = require('imap')
const inspect = require('util').inspect

class ImapConnection{
    constructor(config){
        this.imap = new Imap(config)
        this.imap.once('end', () => {
            console.log('Connection ended');
        });
        this.imap.once('close', (e) => {
            console.log('disconnected')
        })
        this.imap.on('error',(e) => {
            console.log(e)
            console.log('connection closed')
        })
    }
    imapConnect(){  
        this.imap.connect()
    }
    fetchMailBox(box){
        this.imap.openBox(box, true, (err,box) =>{
            this.imap.search(['ALL'],(err, results) =>{
                var messageEmitter = this.imap.fetch(results, {
                    bodies: 'HEADER.FIELDS (FROM TO SUBJECT DATE)',
                    struct: true
                }) 
                messageEmitter.on('message', (msg,seqno) => {
                    msg.on('body', (stream, info) => {
                        var buffer = '';
                        stream.on('data', (chunk) => {
                            buffer+=chunk.toString('utf8') 
                        })
                        stream.once('end', () => {
                            console.log(inspect(Imap.parseHeader(buffer)))
                        })
                    })
                })
                messageEmitter.once('error', (err) => {
    
                })
                messageEmitter.once('end', () => {
                    this.imap.end()
                })
            })
        });
    }
}

module.exports = ImapConnection