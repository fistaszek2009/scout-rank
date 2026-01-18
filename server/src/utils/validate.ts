type validateResult = {
    correct: boolean,
    statusCode: number,
    message: string
}

function validatePayload(payload: any) : validateResult {
    if (typeof payload !== typeof {}) {
        return {
            correct: false,
            statusCode: 400,
            message: "Invalid request!"
        }
    }

    return {
        correct: true,
        statusCode: 200,
        message: "OK"
    }
}

function validateName(name: any, allowDigits: boolean = false, allowSpaces: boolean = false) : validateResult {
    if (typeof name !== typeof "") {
        return {
            correct: false,
            statusCode: 400,
            message: "Given name must be a string!"
        }
    }
    if (!name) {
        return {
            correct: false,
            statusCode: 400,
            message: "Given name must not be empty!"
        }
    }
    if (name.length > 50) {
        return {
            correct: false,
            statusCode: 400,
            message: "Given name must be at most 50 characters long!"
        }
    }
    
    let regexCheck = /^[\p{L}-]+$/u;
    if (allowDigits) {
        regexCheck = /^[\p{L}\d-]+$/u;
        if (allowSpaces) {
            regexCheck = /^[\p{L}\d\s-]+$/u;
        }
    } else if (allowSpaces) {
        regexCheck = /^[\p{L}\s-]+$/u;
    }

    if (!regexCheck.test(name)) {
        return {
            correct: false,
            statusCode: 400,
            message: "Given name must not use special characters or spaces!"
        }
    }

    return {
        correct: true,
        statusCode: 200,
        message: "OK"
    }
}

function validateDescription(description: any) : validateResult {
    if (typeof description !== typeof "") {
        return {
            correct: false,
            statusCode: 400,
            message: "Given description must be a string!"
        }
    }
    if (description.length > 1000) {
        return {
            correct: false,
            statusCode: 400,
            message: "Given description must be at most 1000 characters long!"
        }
    }

    return {
        correct: true,
        statusCode: 200,
        message: "OK"
    }
}

function validatePassword(password: any) : validateResult {
    if (typeof password !== typeof "") {
        return {
            correct: false,
            statusCode: 400,
            message: "Given password must be a string!"
        }
    }

    if (!password) {
        return {
            correct: false,
            statusCode: 400,
            message: "Given password must not be empty!"
        }
    }
    
    if (password.length > 300) {
        return {
            correct: false,
            statusCode: 400,
            message: "Given password must be at most 300 characters long!"
        }
    }

    if (password.length < 8) {
        return {
            correct: false,
            statusCode: 400,
            message: "Given password must be at least 8 characters long!"
        }
    }

    return {
        correct: true,
        statusCode: 200,
        message: "OK"
    }
}

function parseAndValidateDate(date_str: any) : { date: Date, result: validateResult } {
    const date = new Date(Date.parse(date_str))

    if (!date || isNaN(date.getTime())) {
        return {
            date: date,
            result: {
                correct: false,
                statusCode: 400,
                message: "Given date must be date type!"
            }
        }
    }

    if (!(date instanceof Date)) {
         return {
            date: date,
            result: {
                correct: false,
                statusCode: 400,
                message: "Given date must be date type!"
            }
        }
    }

    return {
        date: date,
        result: {
            correct: true,
            statusCode: 200,
            message: "OK"
        }
    }
}

function validateId(id: any) : validateResult {
    if (typeof id !== typeof 1) {
        return {
            correct: false,
            statusCode: 400,
            message: "Given id must be number type!"
        }
    }

    if (!Number.isInteger(id)) {
        return {
            correct: false,
            statusCode: 400,
            message: "Given id must be integer!"
        }
    }

    if (id < 0) {
        return {
            correct: false,
            statusCode: 400,
            message: "Given id must non-negative!"
        }
    }

    return {
        correct: true,
        statusCode: 200,
        message: "OK"
    }
}

function validatePositiveInteger(value: any) : validateResult {
    if (typeof value !== typeof 1) {
        return {
            correct: false,
            statusCode: 400,
            message: "Given value must be number type!"
        }
    }

    if (!Number.isInteger(value)) {
        return {
            correct: false,
            statusCode: 400,
            message: "Given number must be integer!"
        }
    }

    if (value < 1) {
        return {
            correct: false,
            statusCode: 400,
            message: "Given number must positive!"
        }
    }

    return {
        correct: true,
        statusCode: 200,
        message: "OK"
    }
}

function validateNonnegativeInteger(value: any) : validateResult {
    if (typeof value !== typeof 1) {
        return {
            correct: false,
            statusCode: 400,
            message: "Given value must be number type!"
        }
    }

    if (!Number.isInteger(value)) {
        return {
            correct: false,
            statusCode: 400,
            message: "Given number must be integer!"
        }
    }

    if (value < 0) {
        return {
            correct: false,
            statusCode: 400,
            message: "Given number must non-negative!"
        }
    }

    return {
        correct: true,
        statusCode: 200,
        message: "OK"
    }
}

function validateBoolean(bool: any) : validateResult {
    if (typeof bool !== typeof true) {
        return {
            correct: false,
            statusCode: 400,
            message: "Given value must be boolean type!"
        }
    }

    return {
        correct: true,
        statusCode: 200,
        message: "OK"
    }
}


export {
    validatePayload,
    validateName,
    validatePassword,
    parseAndValidateDate,
    validateId,
    validateBoolean,
    validatePositiveInteger,
    validateDescription,
    validateNonnegativeInteger
}