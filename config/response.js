var error_msg = {	
	ALREADY_EXIST :{
		statusCode:400,
        message : 'Account with this user name or phone no. already exist.',
        responseType:'ALREADY_EXIST'
	},
	VERIFY_OTP :{
		statusCode:200,
        message : 'OTP verified successfully..',
        responseType:'VERIFY_OTP'
	},
	invalidToken:{
		message:"You are not authorized.",
		statusCode:401,
		responseType:''
	},
	INVALID_CREDENTIALS:{
		message: "Username or password is correct.",
		statusCode:400,
		responseType:'INVALID_CREDENTIALS'
	},
	PASSWORD_MATCH_ERR:{
		message: "Passwords do not match.",
		statusCode:400,
		responseType:'PASSWORD_MATCH_ERR'
	},
	INVALID_OTP:{
		message: "The OTP you have entered is incorrect.",
		statusCode:400,
		responseType:'INVALID_OTP'
	},
	NO_CONTACTS_FOUND:{
		message: "No Contacts Found",
		statusCode:400,
		responseType:'NO_CONTACTS_FOUND'
	},
	InvalidFileExtension:{
		message: "Media with ths extension is not allowed.",
		statusCode:400,
		responseType:'InvalidFileExtension'
	},
	deleted:{
		message:"Your account has been deleted. Please contact admin",
		statusCode:400,
		responseType:'DELETED'
	},
	blocked:{
		message:"Your account has been blocked. Please contact admin",
		statusCode:400,
		responseType:'BLOCKED'
	},
	notFound :{
		statusCode:400,
        message : 'Not Found.',
        responseType:'NOT_Found'
	},
	PHONE_NOT_REGISTERED: {
		statusCode:400,
        message : 'The mobile number is not registered.',
        responseType:'PHONE_NOT_REGISTERED'
	},
	implementationError :{
		statusCode:400,
        message : 'Implementation Error.',
        responseType:'IMPLEMENTATION_ERROR'
	},
	LINK_EXPIRED: {
		statusCode:400,
        message : 'This link has expired.',
        responseType:'LINK_EXPIRED'
	},
	ALREADY_ANSWERED: {
		statusCode:400,
        message : 'You have already answered this question',
        responseType:'ALREADY_ANSWERED'
	},
};

var sendSuccess = function(data){
	
	let success_msg={
		"statusCode": 200,
		"message":  data.message ||'Success',
		"data" :  data.data,
	}
	return success_msg;	
};

module.exports={
	error_msg:error_msg,
	sendSuccess:sendSuccess,
}