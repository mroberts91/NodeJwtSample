import {Resolver, Query, Mutation, Arg, Ctx, UseMiddleware} from 'type-graphql'
import {User} from "./entity/User";
import { LoginResponse } from './LoginResponse';
import { RequestContext } from './RequestContext';
import { createRefreshToken, createAccessToken, hashString, isValidUserPassword, isUserAuthenticated } from './auth';
import { sendRefreshTokenCookie } from './responseCookies';
import { userListAsync, findUserByEmailAsync, addUserAsync } from './repository/userRepository';

@Resolver()
export class UserResolver{
    @Query(() => String)
    hello(){
        return "hi!"
    }

    @Query(() => [User])
    async users(){
        return await userListAsync();
    }

    @Query(() => String)
    @UseMiddleware(isUserAuthenticated)
    checkAuth(
        @Ctx() { payload } : RequestContext
    ): string{
        return `You are authenticated ${payload!.sub}`;
    }

    @Mutation(() => LoginResponse)
    async login(
        @Arg('email') email: string,
        @Arg('password') password: string,
        @Ctx() { res }: RequestContext
    ): Promise<LoginResponse> {
        const user = await findUserByEmailAsync(email);

        if (!user) 
            throw new Error('Incorrect email or password');

        if (!isValidUserPassword(user, password)) 
            throw new Error('Incorrect email or password');

        sendRefreshTokenCookie(res, createRefreshToken(user));

        return {
            accessToken: createAccessToken(user)
        }
    }

    @Mutation(() => Boolean)
    async register(
        @Arg('email') email: string,
        @Arg('password') password: string
    ){
        const hashedPassword = await hashString(password);
        try {
            await addUserAsync(email, hashedPassword );
        } catch (error) {
            console.log(error);
            return false;
        }

        return true;
    }
}
