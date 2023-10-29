const express = require('express')
const app = express()
const port = 4000
const cors = require('cors')
const UserController = require('./controllers/userController')
const JobController = require('./controllers/jobController')

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.get('/users', UserController.findAllUser)
app.post('/users', UserController.addNewUSer)
app.get('/users/:id', UserController.findUserById)
app.delete('/users/:id', UserController.deleteUser)

app.get('/jobs', JobController.findAllJob)
app.post('/jobs', JobController.addNewJob)
app.get('/jobs/:id', JobController.findJobById)
app.put('/jobs/:id', JobController.editJob)
app.delete('/jobs/:id', JobController.deleteJob)

app.listen(port, () => {
    console.log(`Orchestrator Express listening on port ${port}`)
})
