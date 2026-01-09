import crypto from 'node:crypto'
import { prisma } from '../lib/prisma'

async function startSession(userId: number) : Promise<string> {
    const session = await prisma.session.create({
        data: {
            userId: userId,
            secret: crypto.randomBytes(32).toString("hex"),
            expireDate: new Date(Date.now() + parseInt(process.env.SESSION_EXPIRY_TIME ?? "2592000000"))
        }
    });

    return session.secret;
}

async function checkSession(userId: number, sessionSecret: string) : Promise<boolean> {
    const session = await prisma.session.findFirst({ where: { userId: userId, secret: sessionSecret } });
    
    if (!session) {
        return false;
    }

    if (session.expireDate < new Date()) {
        await prisma.session.delete({ where: {id: session.id} });
        return false;
    }

    prisma.session.update({ where: { id: session.id }, data: { expireDate: new Date(Date.now() + parseInt(process.env.SESSION_EXPIRY_TIME ?? "2592000000")) } });

    return true;
}

export { startSession, checkSession }