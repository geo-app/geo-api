
module.exports = {
    /**
     * @param {String} message - The message
     * @param {JSON} body - The Json (optional)
     * @returns {JSON}
     */
    responseOK: function (message, body) {
        if (body) {
        return {
            success: true,
            message: message,
            body: body,
        };
        } else {
        return {
            success: true,
            message: message,
        };
        }
    },

    /**
     * @param {String} error - The error message
     * @param {JSON} body - The Json (optional)
     * @returns {JSON}
     */
    responseERROR: function (error, body) {
        return {
        success: false,
        error: error,
        body: body,
        };
    },

    returnType: Object.freeze({
        INVALID_FIELDS: "Invalid field(s)",
        ENTITY: Object.freeze({
            CREATED: "Entity created successfully",
            UPDATED: "Entity updated succesfully",
            DESTROY: "Entity removed succesfully",
            NOT_FOUND: "Entity not found",
            UNABLE_TO_VERIFY: "Unable to verify Entity",
            EXIST: "Entity already exist",
            NOEXIST:"Entity not exist",
            CANT_CREATE : "Cannot create Entity",
            CANT_DELETE: "Cannot delete Entity",
            CANT_UPDATE: "Cannot update Entity"
        }),
    })
};



