const env = require('../config/env')();

module.exports = {
    randomIntegerOtp: function () {
        return Math.floor(1000 + Math.random() * 9000);
    },
    verifyJoiSchema: async (data, schema) => {
        try {
            const value = await Joi.validate(data, schema);
            return value;
        }
        catch (error) {
            throw error;
        }
    },
}