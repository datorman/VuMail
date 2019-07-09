const Imap = require('imap')
const inspect = require('util').inspect
var crypto = require('crypto')


class ImapConnection{
    constructor(config){
        this.imap = new Imap(config)
        //this.fetchTimeout = 0
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
    fetchMailBox(box, successCallback){
        var emails = []
        this.imap.openBox(box, true, (err,box) =>{
            this.imap.search(['ALL'],(err, results) =>{
                var messageEmitter = this.imap.fetch(results, {
                    bodies: ['HEADER.FIELDS (FROM TO SUBJECT DATE)','TEXT'],
                    struct: true
                })
                messageEmitter.on('message', (msg,seqno) => {
                    var headBuffer = ''
                    var bodyBuffer = ''
                    var mailSize = 0
                    var attributes 
                    var subject = ''
                    msg.on('body', (stream, info) => {
                        stream.on('data', (chunk) => {
                            if(info.which === 'TEXT'){
                                bodyBuffer+=chunk.toString('utf8') 
                                mailSize = info.size
                            } else {
                                headBuffer+=chunk.toString('utf8') 
                            }
                        })
                        stream.once('end', () => {
                        })
                    })
                    msg.once('attributes', function(attrs){
                        attributes = inspect(attrs, false, 8)
                    })
                    msg.once('end', function(){
                        var header = inspect(Imap.parseHeader(headBuffer)).replace(/'/g,'"').replace(/([a-z]+)(: ?[\[\n])/g, '"$1"$2')
                        header = JSON.parse(header)
                        var date = new Date(header.date[0]).getTime()
                        var remoteReference = crypto.createHash('md5').update(header.subject[0]+date+header.from[0]).digest("hex")
                        
                        emails.push({
                            remoteReference,
                            from: header.from,
                            to: header.to,
                            subject: header.subject[0],
                            date,
                            body:bodyBuffer,
                            bodysize: mailSize,
                            attributes: attributes,

                        })
                    })
                })
                messageEmitter.once('error', (err) => {
    
                })
                messageEmitter.once('end', () => {
                    if(successCallback){
                        successCallback(emails)
                    }
                    this.imap.end()
                })
            })
        });
    }
}

module.exports = ImapConnection