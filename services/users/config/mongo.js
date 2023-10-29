const { MongoClient } = require("mongodb");

const uri = process.env.MONGO_URI

const client = new MongoClient(uri);

let database = {}

async function connect() {
    try {
        await client.connect()

        database = client.db('P3_NoSql');

    } catch (error) {
        console.log(error);
    }
}

const getDb = () => {
    return database
}

module.exports = {
    connect,
    getDb
}