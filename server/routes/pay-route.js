const router = require("express").Router();
const connection = require("../db");

const { v4: uuidv4 } = require('uuid')
const orderModel = require('../models/order.js')

require('dotenv').config()

const createLinePayClient = require('line-pay-merchant').createLinePayClient

const linePayClient = createLinePayClient({
  channelId: process.env.LINE_PAY_CHANNEL_ID,
  channelSecretKey: process.env.LINE_PAY_CHANNEL_SECRET,
  env: process.env.NODE_ENV,
})

// 建立order
router.post('/create-order', async (req, res) => {
    // const orderId = uuidv4()
    const pId = uuidv4()
  
    const order = {
      orderId: req.body.oid,
      currency: 'TWD',
      amount: req.body.amount,
      packages: [
        {
          id: pId,
          amount: req.body.amount,
          products: req.body.products,
        },
      ],
      options: { display: { locale: 'zh_TW' } },
    }
  
    // console.log(order);
    // Save order information
    // cache.put(orderId, order)
  
    // insert new order to database
    const newOrder = await orderModel.create({
      total_amount: req.body.amount,
      order_info: JSON.stringify(order), // request to line pay
      status_id: 5,
      oid:req.body.oid,
      created_at: req.body.created_at,
      coupon_id:req.body.coupon_id,
      user_id:req.body.user_id,
      order_price:req.body.order_price,
      sale:req.body.sale,
      freight:req.body.freight,
      order_payment:req.body.order_payment,
      order_shipment:req.body.order_shipment,
      buyer_name:req.body.buyer_name,
      buyer_phone:req.body.buyer_phone,
      buyer_address:req.body.buyer_address,
    })
  
    //console.log(newOrder)
  
    res.json(order)
  })


router.get('/check-transaction', async (req, res) => {
  const transactionId = req.query.transactionId

  try {
    const linePayResponse = await linePayClient.checkPaymentStatus.send({
      transactionId: transactionId,
      params: {},
    })

    res.json(linePayResponse.body)
  } catch (e) {
    res.json({ error: e })
  }
})

router.get('/confirm', async (req, res) => {
  const transactionId = req.query.transactionId

  // get transaction from db
  const record = await orderModel.findOne({ transaction_id: transactionId })
  console.log('L83-record', record)

  //transaction
  // let transaction = cache.get(transactionId)
  const transaction = JSON.parse(record.reservation)

  const amount = transaction.amount

  // console.log('L48-', transactionId, transaction, amount)

  try {
    // do final confirm
    const linePayResponse = await linePayClient.confirm.send({
      transactionId: transactionId,
      body: {
        currency: 'TWD',
        amount: amount,
      },
    })

    console.log('L102-', linePayResponse)

    transaction.confirmBody = linePayResponse.body

    //status: 'pending' | 'paid' | 'cancel' | 'fail' | 'error'
    let status = 'paid'

    if (linePayResponse.body.returnCode !== '0000') {
      status = 'fail'
    }

    // update db status
    const result = await orderModel.update({
      order_id: record.order_id,
      status: status,
      return_code: linePayResponse.body.returnCode,
      confirm: JSON.stringify(linePayResponse.body),
    })

    res.json(linePayResponse.body)
  } catch (e) {
    res.json({ error: e })
  }
})

// 進行line-pay交易
router.get('/reserve', async (req, res) => {
  const redirectUrls = {
    confirmUrl: process.env.REACT_REDIRECT_CONFIRM_URL,
    cancelUrl: process.env.REACT_REDIRECT_CANCEL_URL,
  }

  if (!req.query.orderId) {
    throw new Error('orderId not exist.')
  }

  const orderId = req.query.orderId

  // find order from db
  const orderRecord = await orderModel.findById(orderId)
  console.log(orderRecord);
  const order = JSON.parse(orderRecord.order_info)

  //const order = cache.get(orderId)
  console.log(`Order got. Detail is following.`)

  try {
    const linePayResponse = await linePayClient.request.send({
      body: { ...order, redirectUrls },
    })

    //console.log('L140-', linePayResponse)

    // deep copy from order
    const reservation = JSON.parse(JSON.stringify(order))

    reservation.returnCode = linePayResponse.body.returnCode
    reservation.returnMessage = linePayResponse.body.returnMessage
    reservation.transactionId = linePayResponse.body.info.transactionId
    reservation.paymentAccessToken =
      linePayResponse.body.info.paymentAccessToken

    console.log(`Reservation was made. Detail is following.`)
    console.log(reservation)

    // 在db儲存reservation資料
    const newRecord = await orderModel.update({
      order_id: orderId,
      reservation: JSON.stringify(reservation),
      transaction_id: reservation.transactionId,
    })

    console.log(newRecord)

    // Save transaction to cache
    //cache.put(reservation.transactionId, reservation)

    res.redirect(linePayResponse.body.info.paymentUrl.web)
  } catch (e) {
    console.log('error', e)
  }
})

module.exports = router