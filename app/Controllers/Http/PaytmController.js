'use strict'

const PaytmChecksum = require('paytmchecksum');
//const PaytmChecksum = require("./PaytmChecksum");

const PaytmConfig = {
	mid: "EzQWfn65020607388331",
	key: "y4w9IIv#TtMIhs3a",
	website: "WEBSTAGGING"
}
const checksum_lib = require('./checksum.js');

class PaytmController {

	async checksum({request, response}) {
		let {customerId, amount, email, phone} = request.all()
		let orderId = 'ORDER_'+new Date().getTime()

			let body = {
				MID: PaytmConfig.mid,
				WEBSITE: PaytmConfig.website,
				CHANNEL_ID: 'WEB',
				INDUSTRY_TYPE_ID: 'Retail',
				ORDER_ID: orderId,
				CUST_ID: customerId,
				TXN_AMOUNT: amount,
				CALLBACK_URL: 'https://securegw-stage.paytm.in/theia/paytmCallback?ORDER_ID='+ orderId,
				EMAIL: email,
				MOBILE_NO: phone
			}

			/* try {
				let d = await checksum_lib.genchecksum(body, PaytmConfig.key, cb)
				return d
			} catch (error) {
				return error
			} */
			 checksum_lib.genchecksum(body, PaytmConfig.key, function (err, checksum) {
				if (err != null) {
					console.log('error is not null')
					return response.json({status: 'failed', err})
				} else {
				console.log('error is null')
				console.log(checksum)
				return response.json({
					status: 'success',
					checksum: checksum
				})
			}
			})

			return await this.cb(body)
	}
	async validate({request, response}) {

		//let {orderId} = request.all()

		let {checksum, orderId} = request.all()

		let body = {
			mid: 'YgtqSS65538729777928',
			orderId: orderId
		}

		try {
			if (await PaytmChecksum.verifySignature(JSON.stringify(body), apikey, checksum)) {
				return response.json({
					status: 'success',
					message: 'matched'
				})
			}
			throw 'checksum mismatched'

		} catch (error) {
			return response.status(403).json({
				status: 'failed',
				error
			})
		}

	}


}

module.exports = PaytmController
