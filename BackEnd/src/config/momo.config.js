require('dotenv').config()

module.exports = {
    partnerCode: 'MOMO',
    accessKey: 'F8BBA842ECF85',
    secretKey: 'K951B6PE1waDMi640xX08PD3vg6EkVlz',
    apiUrl: 'https://test-payment.momo.vn/v2/gateway/api/create',
    returnUrl: 'http://localhost:2308/payment-success',
    notifyUrl: 'https://c6d2-2001-ee0-1ae3-1eab-a91d-a4f4-edc7-7bca.ngrok-free.app/api/payment/webhook',
}
