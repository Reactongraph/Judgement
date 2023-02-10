module.exports = { 
    verifyJoiSchema: async (data, schema) => {
        try {
            const value = await Joi.validate(data, schema);
            return value;
        } 
        catch (error) {
            throw error;
        }
    }
}