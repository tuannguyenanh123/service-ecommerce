"use strict";

const StatusCode = {
    OK: 200,
    CREATED: 201,
};
const ReasonStatusCode = {
    OK: "Success",
    CREATED: "Created!",
};

class SuccessResponse {
    constructor({
        message,
        statusCode = StatusCode.OK,
        reasonStatusCode = ReasonStatusCode.OK,
        metadata = {},
    }) {
        this.message = !message ? reasonStatusCode : message;
        this.status = statusCode;
        this.metadata = metadata;
    }

    send(res, headers = {}) {
        return res.status(this.status).json(this);
    }
}

class Ok extends SuccessResponse {
    constructor({ message, metadata }) {
        super({
            message, metadata
        });
    }
}

class Created extends SuccessResponse {
    constructor({
        options,
        message,
        statusCode = StatusCode.CREATED,
        reasonStatusCode = ReasonStatusCode.CREATED,
        metadata,
    }) {
        super({ message, statusCode, reasonStatusCode, metadata });
        this.options = options
    }
}

module.exports = {
    Ok,
    Created,
    SuccessResponse
};
