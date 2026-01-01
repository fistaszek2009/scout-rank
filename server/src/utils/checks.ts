type checkResult = {
    correct: boolean,
    statusCode: number,
    message: string
}

function nameCheck(name: any, allowDigits: boolean = false, allowSpaces: boolean = false) : checkResult {
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

function passwordCheck(password: any) : checkResult {
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

function dateCheck(date: any) {
    if (typeof date !== typeof (new Date)) {
        return {
            correct: false,
            statusCode: 400,
            message: "Given date must be date type!"
        }
    }

    return {
        correct: true,
        statusCode: 200,
        message: "OK"
    }
}


export { nameCheck, passwordCheck, dateCheck }