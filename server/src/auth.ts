import { User } from './entity/User';
import { sign } from 'jsonwebtoken';
import {hash, compare} from 'bcryptjs';
import { MiddlewareFn } from 'type-graphql';
import { verify } from 'jsonwebtoken'
import { RequestContext } from './RequestContext';

const validTokenType = "Bearer";

export const isUserAuthenticated: MiddlewareFn<RequestContext> = ({ context }, next) => {

    const authorization = context.req.headers['authorization'];
    if (!authorization)
        throw new Error("Not Autenticated");

    try {
        const [ type, token, ...foo]  = authorization!.split(' ');
        console.table(["Extra Authorization Header params"], foo);

        if (type !== validTokenType || !token === undefined)
            throw new Error("Not Autenticated");

        const payload = verify(token, process.env.ACCESS_SECRET!);
        context.payload = payload as any;

    } catch (error) {
        console.log(error);
    }
    return next();
}

export const createAccessToken = (user: User) => {
    return sign(
        { 
            userId: user.id,
            sub: user.email,
        },
        process.env.ACCESS_SECRET!,
        {
            expiresIn: "15m"
        }
    )
}

export const createRefreshToken = (user: User) => {
    return sign(
        { 
            userId: user.id,
            sub: user.email,
        },
        process.env.REFRESH_SECRET!,
        {
            expiresIn: "3d"
        })
}

export const hashString = async (input: string) => {
    return await hash(input, 15);
}

export const isValidUserPassword = async (user: User,password: string) => {
    return await compare(password, user.password);
}