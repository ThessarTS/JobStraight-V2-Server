const express = require('express')
const app = express()
const port = process.env.PORT || 4001
const cors = require('cors')
const UserController = require('./controllers/userController')
const { connect } = require('./config/mongo')
const errorHandler = require('./middlewares/errorHandler')

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.post('/users', UserController.addNewUser)
app.get('/users', UserController.findUsers)
app.get('/users/:id', UserController.findUserById)
app.delete('/users/:id', UserController.deleteUser)

app.use(errorHandler)

connect()
    .then(() => {
        app.listen(port, () => {
            console.log(`This app running on port ${port}`)
        })
    })