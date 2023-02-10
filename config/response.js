var error_msg = {	
	ALREADY_EXIST :{
		statusCode:400,
        message : 'Account with this user name already exist.',
        responseType:'ALREADY_EXIST'
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
	InvalidRequest:{
		message: "Invalid Request.",
		statusCode:400,
		responseType:'InvalidRequest'
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
	FollowError: {
		statusCode:400,
        message : 'You cannot follow your own hangout.',
        responseType:'FollowError'
	},
	implementationError :{
		statusCode:400,
        message : 'Implementation Error.',
        responseType:'IMPLEMENTATION_ERROR'
	},
	SettingsError:{
		message: "Default Settings does not exist",
		statusCode:400,
		responseType:'SettingsError'
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