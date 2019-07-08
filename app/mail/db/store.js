var datastore = require('nedb')
const path = require('path')

const dblist = require('./dblist')
var dbs = []

// Common Store Object
class Store{
    constructor(name){
        this.name = name
        this.db = new datastore({
            filename: path.resolve(__dirname,'data/'+this.name+'.dat'),
            autoload: true           
        })
    }
    insertRecord(record, successCallback, errorCallback){
        var database = this.db
        database.insert(record, (err,doc) => {
            if(err){
                if(errorCallback){
                    errorCallback()
                }
            }
            if(successCallback){
                successCallback(doc)
            }
        })
    }
}


for(index in dblist){
    dbs[dblist[index]] = new Store(dblist[index])
}

// TODO: Create store object with methods to handle storing data return this store object 
// Format of calls will be db/store.collection('').search db/store.collection('').searchOne, db/store.collection('').insert, db/store.collection('').update
// these methods will have custom validation depending on what we are inserting
module.exports = {
    dbs
}





