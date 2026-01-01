import bcrypt from 'bcrypt'

const SALT_ROUNDS = 10;

function hashPassword(password: string) {
    return bcrypt.hashSync(password, SALT_ROUNDS);
}

function checkPassword(password: string, correctPasswordHash: string) {
    return bcrypt.compareSync(password, correctPasswordHash);
}

export { hashPassword, checkPassword }