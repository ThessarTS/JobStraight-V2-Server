const User = require("../models/user")


class UserController {
    static async findUsers(req, res, next) {
        try {
            let users = await User.findAll()

            return res.json(users)

        } catch (error) {
            next(error)
        }
    }

    static async findUserById(req, res, next) {
        try {
            let user = await User.findByPk(req.params.id)

            return res.json(user)

        } catch (error) {
            next(error)
        }
    }

    static async deleteUser(req, res, next) {
        try {
            await User.destroy(req.params.id)

            return res.json({ message: 'Success delete user' })

        } catch (error) {
            next(error)
        }
    }

    static async addNewUser(req, res, next) {
        try {
            let { username, email, password, role, phoneNumber, address } = req.body

            if (!email) {
                throw { name: 'invalidInput', msg: 'Email required' }
            }
            if (!password) {
                throw { name: 'invalidInput', msg: 'Password required' }
            }
            if (password.length < 5) {
                throw { name: 'invalidInput', msg: 'Password must be at least 5 characters' }
            }
            if (!username) {
                throw { name: 'invalidInput', msg: 'Username required' }
            }

            await User.create({ username, email, password, role, phoneNumber, address })
            res.status(201).json({ message: 'Success create new user' })
        } catch (error) {
            next(error)
        }
    }
}

module.exports = UserController