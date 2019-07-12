const Imap = require('imap')
const inspect = require('util').inspect
const fs = require('fs')
const path = require('path')
// Importing Classes
var Store = require('../data/db/store')

var ImapConnection = require('./connections/ImapConnection')
var {getAccount} = require('./../accounts/accounts')


let config = JSON.parse(fs.readFileSync(path.resolve(__dirname,'./settings.json')))

var Account = new Store('account')
var Mail = new Store('mail')
var Connection = new ImapConnection(config)

// Function used to load mail into the active mailbox
function initMailboxes(){
    Mail.findRecords({}, (docs) => {
        global.sharedObj.mail = docs
        global.sharedObj.mail.filter(mail => {
            console.log(mail.remoteReference)
        })
    })
    
}

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
    imapConnect,
    initMailboxes
}