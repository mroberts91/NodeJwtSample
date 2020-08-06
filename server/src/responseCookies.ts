import { Response } from 'express'

export const sendRefreshTokenCookie = (res: Response, token: string) => {
    res.cookie("refid", token,{ httpOnly: true });
}