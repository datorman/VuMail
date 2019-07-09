var datastore = require('nedb')
const path = require('path')

// Common Store Object custom processing before insert/update/find
class Store{
    constructor(name){
        this.name = name
        this.db = new datastore({
            filename: path.resolve(__dirname,'files/'+this.name+'.dat'),
            autoload: true           
        })
    }
    findRecord(queryObject, successCallback, errorCallback){
        var database = this.db
        var preparedQuery = queryObject
        try{
            database.findOne(preparedQuery, (err,doc) => {
                if(err){
                    throw new Error('Error occured while searching for record.')
                }
                if(successCallback){
                    successCallback(doc)
                }   
            })
        }catch(err){
            if(errorCallback){
                errorCallback(err)
            }  
        }
    }
    findRecords(queryObject, successCallback, errorCallback){
        var database = this.db
        var preparedQuery = {
        }
        try{
            database.find(preparedQuery,(err,docs) => {
                if(err){
                    throw new Error('Error occured while searching for records.')
                }
                if(successCallback){
                    successCallback(docs)
                }    
            })
        }catch(err){
            if(errorCallback){
                errorCallback(err)
            } 
        }
    }
    insertRecord(record, successCallback, errorCallback){
        var database = this.db
        try{
            database.insert(record, (err,doc) => {
                if(err){
                    throw new Error('Error occured while inserting record/s.')
                }
                if(successCallback){
                    successCallback(doc)
                }
            })
        }catch(err){
            if(errorCallback){
                errorCallback(err)
            } 
        }
    }
    updateRecord(record, updates, successCallback, errorCallback){
        var database = this.db
        try{
            database.update(record, (err,doc) => {
                if(err){
                    throw new Error('Error occured while updating record/s.')
                }
                if(successCallback){
                    successCallback(doc)
                }  
            })
        }catch(err){
            if(errorCallback){
                errorCallback(err)
            } 
        }
    }
    removeRecords(queryObject, successCallback, errorCallback){
        var database = this.db
        var options = {
            multi:true
        }
        try{
            database.remove(queryObject,options, (err,numRemoved) => {
                if(err){
                    throw new Error('Error occured while removing record.')
                }
            })  
            if(successCallback){
                successCallback(numRemoved)
            }        
        }catch(err){
            if(errorCallback){
                errorCallback(err)
            }               
        }
    }
}

module.exports = Store