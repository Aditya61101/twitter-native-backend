import { PrismaClient } from '@prisma/client';
import { Request, Response } from 'express';
import { AuthRequest } from '../middleware';

const prisma = new PrismaClient();

export const getAllTweets = async (_: Request, res: Response) => {
    try {
        const tweets = await prisma.tweet.findMany({
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        username: true,
                        image: true
                    }
                }
            }
        });
        res.status(200).json(tweets);
    } catch (err) {
        res.status(500).json({ msg: "Internal Server Error" });
    }
}

export const getTweetById = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        const tweet = await prisma.tweet.findUnique({
            where: {
                id: Number(id)
            },
            include: {
                user: true
            }
        });
        if (tweet)
            res.status(200).json(tweet);
        else
            res.status(400).json({ msg: "Invalid tweet Id" });
    } catch (error) {
        res.status(500).json({ msg: "Internal Server Error" });
    }
}

export const createTweet = async (req: AuthRequest, res: Response) => {
    const { content, image } = req.body;
    const userId = req?.user?.id!;
    try {
        if (!content) {
            res.status(400).json({ msg: "Please send all required fields" });
            return;
        }
        const newTweet = await prisma.tweet.create({
            data: {
                content,
                image,
                userId
            }
        });
        res.status(201).json(newTweet);
    } catch (error) {
        res.status(500).json({ msg: "Internal Server Error" });
    }
}

export const deleteTweet = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        const tweet = await prisma.tweet.findUnique({
            where: {
                id: Number(id)
            }
        })
        if (!tweet) {
            res.status(400).json({ msg: "Invalid Id" });
            return;
        }
        await prisma.tweet.delete({
            where: {
                id: Number(id)
            }
        })
        res.sendStatus(204);
    } catch (error) {
        res.status(500).json({ msg: "Internal server error" });
    }
}