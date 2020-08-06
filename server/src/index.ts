import 'dotenv/config';
import "reflect-metadata";
import express from 'express';
import { ApolloServer } from 'apollo-server-express';
import { buildSchema } from 'type-graphql';
import { UserResolver } from "./UserResolver";
import { createConnection } from "typeorm";
import cookieParser from 'cookie-parser';
import { verify } from 'jsonwebtoken';
import { createAccessToken, createRefreshToken } from './auth';
import { sendRefreshTokenCookie } from './responseCookies';
import { findUserByIdAsync } from './repository/userRepository';



(async () => {
    const app = express();
    app.use(cookieParser());

    app.get('/', (_req, res) => {
        res.status(200);
        res.send('Hello');
    });

    app.post("/refresh_token", async (req, res) => {
        const refreshToken = req.cookies.refid;

        if (!refreshToken) {
            res.status(400);
            return res.send({ accessToken: ''});
        }

        let payload: any = null;
        try {
            payload = verify(refreshToken, process.env.REFRESH_SECRET!);
        } catch (error) {
            console.log(error);
            res.status(401);
            return res.send({ accessToken: ''});
        }

        const user = await findUserByIdAsync(payload.userId );

        if (!user){
            res.status(404)
            return res.send({ accessToken: ''});
        }

        sendRefreshTokenCookie(res, createRefreshToken(user));

        res.status(200);
        return res.send({ accessToken: createAccessToken(user) });
    });

    await createConnection();

    const apolloServer = new ApolloServer({
        schema: await buildSchema({
            resolvers: [UserResolver]
        }),
        context: ({ req, res }) => ({ req, res})
    });

    apolloServer.applyMiddleware({app});

    app.listen(4000, () => {
        console.log("Server has started...");
    });
})();
