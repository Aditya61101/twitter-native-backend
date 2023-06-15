import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { sendEmailToken } from "../services/emailServices";

const prisma = new PrismaClient();
const EMAIL_TOKEN_EXPIRATION_MINUTES = 10;
const API_TOKEN_EXPIRATION_HRS = 24;

function generateAuthToken(tokenId: number): string {
    return jwt.sign({ tokenId }, process.env.JWT_SECRET!, {
        algorithm: "HS256",
        noTimestamp: true,
    })
}
function generateEmailToken(): string {
    return Math.floor(10000000 + Math.random() * 90000000).toString();
}
//create a user, if it doesn't exists.
// generate the emailToken and send it to their email
export const authLogin = async (req: Request, res: Response) => {
    const { email } = req.body;
    const emailToken = generateEmailToken();
    const expiration = new Date(new Date().getTime() + EMAIL_TOKEN_EXPIRATION_MINUTES * 60000);
    try {
        await prisma.token.create({
            data: {
                type: "EMAIL",
                emailToken,
                expiresAt: expiration,
                user: {
                    connectOrCreate: {
                        where: {
                            email
                        },
                        create: {
                            email
                        }
                    }
                }
            }
        });
        await sendEmailToken(email, emailToken);
        res.sendStatus(201);
    } catch (error) {
        res.status(500).send({ msg: "Internal Server Error" });
    }

}

//validate the emailToken and generate a long lived token
export const authValidate = async (req: Request, res: Response) => {
    const { email, emailToken } = req.body;
    try {
        const token = await prisma.token.findUnique({
            where: {
                emailToken
            },
            include: {
                user: true
            }
        });
        if (!token || !token.valid || token.user.email !== email)
            return res.status(401).send({ msg: "Invalid Token" });
        if (token.expiresAt < new Date())
            return res.status(401).send({ msg: "Token Expired" });

        const expiration = new Date(new Date().getTime() + API_TOKEN_EXPIRATION_HRS * 3600000);
        const apiToken = await prisma.token.create({
            data: {
                type: "API",
                expiresAt: expiration,
                user: {
                    connect: {
                        email
                    }
                }
            }
        });
        //invalidate the emailToken
        await prisma.token.update({
            where: {
                id: token.id
            },
            data: {
                valid: false
            }
        });
        //generate the authToken, to be used for all protected api calls
        const authToken = generateAuthToken(apiToken.id);
        res.status(201).json({ authToken });
    } catch (error) {
        res.status(500).send({ msg: "Internal Server Error" });
    }
}