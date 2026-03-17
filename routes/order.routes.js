import express from 'express'
import {
    createOrder,
    getOrders,
    getOrderById,
    getOrdersByUser,
    updateOrder,
    deleteOrder
} from '../controller/order.controller.js'

const router = express.Router()

router.post('/', createOrder)
router.get('/', getOrders)
router.get('/:id', getOrderById)
router.get('/user/:userId', getOrdersByUser)
router.put('/:id', updateOrder)
router.delete('/:id', deleteOrder)

export default router