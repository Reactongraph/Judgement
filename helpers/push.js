var FCM = require('fcm-node');
const env = require("../config/env")();
var serverKey = env.FCM_SERVER_KEY; 
var fcm = new FCM(serverKey);

var sendNotification =(data,deviceTokensArr,deviceType) => {
    if (deviceType == 'ios') {
        console.log("ios");
        sendNotificationIos(data,deviceTokensArr)
    }
    else {
        console.log("android");
        sendNotificationAndroid(data,deviceTokensArr)
    }
};

/*******
* @function sendPushNotificationAndroid
* @description Used to send the push notifications to the device 
********/
async function sendNotificationAndroid(data, deviceTokensArr)  {
    // var message = {
    //     registration_ids: deviceTokensArr,                                                 // either DeviceRegistrationToken or topic1
    //     data: data
    // };
    var message = { 
        to: deviceTokensArr, 
        collapse_key: 'your_collapse_key',
         priority: 'high',
        //  notification: {
        //     title: data.title, 
        //     message: data.message, 
        //     message: data.message, 
        //     id: data.id, 
        //     type: data.type, 
        //     body: data 
        // },
        notification: {
            title: data.title,
            body: data.message,
            sound: 'default',
            badge: 1,
            id: data.id
            },  
        
        data: data
    };

    fcm.send(message, function (err, response) {
        if (err) {
            console.log('push error',err);
            // callback(err);
        } else {
            console.log("Successfully sent with response: backend ", response);
            // callback(null, response)
        }
    });
}

/*******
* @function sendPushNotificationIos
* @description Used to send the push notifications to the device 
********/
async function sendNotificationIos(data, deviceTokensArr)  {
     var message = { 
        to: deviceTokensArr, 
        collapse_key: 'your_collapse_key',
         priority: 'high',
        // notification: {
        //     title: data.title, 
        //     message: data.message, 
        //     message: data.message, 
        //     id: data.id, 
        //     type: data.type, 
        //     body: data 
        // },
        notification: {
            title: data.title,
            body: data.message,
            sound: 'default',
            badge: 1,
            id: data.id
            },
        
        data: data
    };
    fcm.send(message, function (err, response) {
        if (err) {
            console.log(err);
            // callback(err);
        } else {
            console.log("Successfully sent with response: backend ", response);
            // callback(null, response)
        }
    });
}

module.exports = {
    sendNotification: sendNotification,
}