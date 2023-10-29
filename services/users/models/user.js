const { ObjectId } = require("mongodb")
const { getDb } = require("../config/mongo")
const bcrypt = require('bcryptjs')

class User {
    static get collection() {
        return getDb().collection('users')
    }

    static async findAll() {


        let users = await this.collection.find({}, { projection: { password: 0 } }).toArray()

        return users
    }

    static async findByPk(id) {

        let user = await this.collection.findOne({ _id: new ObjectId(id) }, { projection: { password: 0 } })

        return user
    }

    static async create(obj) {
        obj.password = bcrypt.hashSync(obj.password)

        let result = await this.collection.insertOne(obj)


        return result
    }

    static async destroy(id) {
        let result = await this.collection.deleteOne({ _id: new ObjectId(id) })

        return result
    }
}

module.exports = User