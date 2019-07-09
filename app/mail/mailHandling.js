const Imap = require('imap')
const inspect = require('util').inspect
const fs = require('fs')
const path = require('path')
// Importing Classes
var Store = require('../data/db/store')
var ImapConnection = require('./connections/ImapConnection')
let config = JSON.parse(fs.readFileSync(path.resolve(__dirname,'./settings.json')))

var Mail = new Store('mail')
var Connection = new ImapConnection(config)



function imapConnect(){
    Connection.imapConnect()
    Connection.imap.on('ready', () => {
        Connection.fetchMailBox('INBOX', function(emails){
            emails.map((email) => {
                Mail.findRecord({remoteReference:email.remoteReference}, (doc) => {
                    if(!doc){
                        Mail.insertRecord(email)
                    }
                })
            })
            
        })
    })
}
module.exports = {
    imapConnect
}