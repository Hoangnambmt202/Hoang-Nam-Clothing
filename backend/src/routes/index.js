const userRouter = require('../routes/User')

const routes = (app) => {

   app.use('/api/user',userRouter)
}
module.exports = routes;