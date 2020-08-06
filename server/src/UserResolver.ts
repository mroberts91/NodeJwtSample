import {Resolver, Query, Mutation, Arg, Ctx, UseMiddleware} from 'type-graphql'
import {User} from "./entity/User";
import { LoginResponse } from './LoginResponse';
import { RequestContext } from './RequestContext';
import { createRefreshToken, createAccessToken, hashString, isValidUserPassword, isUserAuthenticated } from './auth';

@Resolver()
export class UserResolver{
    @Query(() => String)
    hello(){
        return "hi!"
    }

    @Query(() => [User])
    users(){
        return User.find();
    }

    @Query(() => String)
    @UseMiddleware(isUserAuthenticated)
    checkAuth(
        @Ctx() { payload } : RequestContext
    ): string{
        console.log(payload);
        return `You are authenticated ${payload!.sub}`;
    }

    @Mutation(() => LoginResponse)
    async login(
        @Arg('email') email: string,
        @Arg('password') password: string,
        @Ctx() { res }: RequestContext
    ): Promise<LoginResponse> {
        const user = await User.findOne({ where: {email} });

        if (!user) {
            console.log(`Invalid login attempt for ${email}`)
            throw new Error('Incorrect email or password');
        }

        if (!isValidUserPassword(user, password)) {
            console.log(`Invalid login password attempt for ${email}`)
            throw new Error('Incorrect email or password');
        }

        res.cookie("refid", createRefreshToken(user),{ httpOnly: true });

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
            await User.insert({
                email,
                password: hashedPassword
            });
            
        } catch (error) {
            console.log(error);
            return false;
        }

        return true;
    }
}
