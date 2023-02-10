exports.sendSuccessMessage = (message, data, res) => {
	
	let success_msg = {
		"statusCode": 200,
		"message":  message,
		"data" :  data|| {}
    };
    return res.status(200).send(success_msg);
}

exports.sendErrorMessage = (message, data, res) => {
	
	let error_message={
		"statusCode": 400,
		"message":  message,
		"responseType" :  data
    }
    return res.status(400).send(error_message);
}