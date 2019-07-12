var Store = require('../data/db/store')


var Account = new Store('account')

function getAccount(){
    // Fetch account information and create connection from it
    var account;
    Account.findRecord({}, (doc) => {
        return account = doc
    })
}

function getAccounts(){

}
function addAccount(){
    var account = {
        accountName: "Connection Name",
        connectionType:"Imap",
        settings:{
            "host": "imap-mail.outlook.com",
            "port": 993,
            "tls": true,
            "authTimeout": 5000,
            "tlsOptions": { 
                "rejectUnauthorized": false 
            },
            "keepalive": {
                "interval": 9000,
                "idleInterval": 200000,
                "forceNoop": true
            }
        }
    }
    Account.insertRecord()
}
module.exports ={

}
