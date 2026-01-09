type validateResult = {
    correct: boolean,
    statusCode: number,
    message: string
}

function validatePayload(payload: any) : validateResult {
    if (typeof payload != typeof {}) {
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
    const normalizedName = name.normalize('NFD');
    
    let regexCheck = /^[\w-]+$/g;
    if (allowDigits) {
        regexCheck = /^[\w\d-]+$/g;
        if (allowSpaces) {
            regexCheck = /^[\w\d\s-]+$/g;
        }
    } else if (allowSpaces) {
        regexCheck = /^[\w\s-]+$/g;
    }

    if (!regexCheck.test(normalizedName)) {
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

    if (!date) {
        return {
            date: date,
            result: {
                correct: false,
                statusCode: 400,
                message: "Given date must be date type!"
            }
        }
    }

    if (typeof date !== typeof (new Date)) {
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


export { validatePayload, validateName, validatePassword, parseAndValidateDate, validateId }