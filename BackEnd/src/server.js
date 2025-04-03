/* eslint-disable no-console */

import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import mongoose from 'mongoose'
import { app, server } from '~/sockets/socket'

dotenv.config()

//route
import categoryRoute from '~/routes/category.route'
import cartRoute from '~/routes/cart.route'
import productRoute from '~/routes/product.route'
import userRoute from '~/routes/user.route'
import orderRoute from '~/routes/order.route'
import paymentRoute from '~/routes/payment.route'
import addressRoute from '~/routes/address.route'
import messageRoute from '~/routes/message.route'
import adminRoute from '~/routes/admin.route'
import cancelExpiredOrders from './services/cancelExpiredOrders'

const port = process.env.PORT || 3001
const dbUrl = process.env.MONGODB_URI

if (!dbUrl) {
    console.error('Missing MONGODB_URI in .env file')
    process.exit(1)
}

//config req.body
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

//config cors
const corsOpts = {
    origin: '*',
    exposedHeaders: ['Authorization'],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Origin', 'Content-Type', 'Accept', 'Authorization', 'X-Request-With'],
}
app.use(cors(corsOpts))

app.use('/api/products', productRoute)
app.use('/api/categories', categoryRoute)
app.use('/api/cart', cartRoute)
app.use('/api/user', userRoute)
app.use('/api/order', orderRoute)
app.use('/api/payment', paymentRoute)
app.use('/api/address', addressRoute)
app.use('/api/messages', messageRoute)
app.use('/api/admin', adminRoute)

app.get('/', (req, res) => {
    res.send('Hello World!')
})

setInterval(cancelExpiredOrders, 10 * 60000)

mongoose
    .connect(dbUrl)
    .then(() => {
        console.log('Connected to database!')
        server.listen(port, () => {
            console.log('Server is running at port ' + port)
        })
    })
    .catch(() => {
        console.log('Connection failed!')
    })
