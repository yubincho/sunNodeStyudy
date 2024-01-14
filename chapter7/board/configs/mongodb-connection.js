const { MongoClient } = require("mongodb")

const uri = "mongodb+srv://admin:admin@cluster0.gyfnark.mongodb.net/board"

module.exports = function (callback) {
    return MongoClient.connect(uri, callback)
}