const studentRouter = require('./student-route/index')


const router = require('express').Router()


router.use('/student', studentRouter)


module.exports = router