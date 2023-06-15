import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import { PrismaClient, User } from "@prisma/client";

const prisma = new PrismaClient();

interface JwtPayload {
    tokenId: string
}
export type AuthRequest = Request & { user?: User };
export const authMiddleware = async (req: AuthRequest, res: Response, next: NextFunction) => {
    const authorization = req.headers.authorization;
    const firstLetter = authorization?.split(" ")[0];
    const authToken = authorization?.split(" ")[1];
    try {
        if (!authToken || firstLetter !== "Bearer") {
            return res.status(401).json({ msg: "Unauthorized" });
        }
        const { tokenId } = jwt.verify(authToken, process.env.JWT_SECRET!) as JwtPayload;

        if (tokenId) {
            const foundToken = await prisma.token.findUnique({
                where: {
                    id: Number(tokenId)
                },
                include: {
                    user: true
                }
            });
            if (!foundToken?.valid || foundToken?.expiresAt < new Date())
                return res.status(400).json({ msg: "API Token is not valid" });
            if (foundToken) {
                req.user = foundToken.user;
                next();
            } else {
                return res.status(401).json({ msg: "Unauthorized" });
            }
        }
        else
            return res.status(401).json({ msg: "Unauthorized" });
    } catch (error) {
        return res.status(500).json({ msg: "Internal server error" });
    }
}
