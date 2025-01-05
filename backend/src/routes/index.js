const userRouter = require('../routes/User')
const productRouter = require('../routes/Product')

const routes = (app) => {

   app.use('/api/user',userRouter)
   app.use('/api/product',productRouter)
}
module.exports = routes;