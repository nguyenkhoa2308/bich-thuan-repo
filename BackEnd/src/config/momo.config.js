require('dotenv').config()

module.exports = {
    partnerCode: 'MOMO',
    accessKey: 'F8BBA842ECF85',
    secretKey: 'K951B6PE1waDMi640xX08PD3vg6EkVlz',
    apiUrl: 'https://test-payment.momo.vn/v2/gateway/api/create',
    returnUrl: 'http://localhost:2308/payment-success',
    notifyUrl: 'https://3f5b-2405-4802-dbbb-f550-3df1-c477-71ae-948.ngrok-free.app/api/payment/webhook',
}
