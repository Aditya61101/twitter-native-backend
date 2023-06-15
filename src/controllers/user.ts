import { PrismaClient } from '@prisma/client';
import { Request, Response } from 'express';

const prisma = new PrismaClient();

export const getAllUsers = async (_: Request, res: Response) => {
    try {
        const users = await prisma.user.findMany();
        res.status(200).json(users);
    } catch (err) {
        res.status(500).json({ msg: "Internal Server Error" });
    }
}

export const getUserById = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        const user = await prisma.user.findUnique({
            where: {
                id: Number(id)
            },
            include: {
                tweets: true
            }
        });
        if (user)
            res.status(200).json(user);
        else
            res.status(400).json({ msg: "Invalid User Id" });
    } catch (error) {
        res.status(500).json({ msg: "Internal Server Error" });
    }
}

export const updateUser = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { image, bio, name } = req.body;
    try {
        const user = await prisma.user.findUnique({
            where: { id: Number(id) }
        })
        if (!user) {
            res.status(400).json({ msg: "Invalid Id" });
            return;
        }
        const updatedUser = await prisma.user.update({
            where: { id: Number(id) },
            data: { image, bio, name }
        })
        res.status(200).json(updatedUser);
    } catch (error) {
        res.status(500).json({ msg: "Internal server error" });
    }

}

export const deleteUser = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        const user = await prisma.user.findUnique({
            where: {
                id: Number(id)
            }
        })
        if (!user) {
            res.status(400).json({ msg: "Invalid Id" });
            return;
        }
        await prisma.user.delete({
            where: {
                id: Number(id)
            }
        })
        res.sendStatus(204);
    } catch (error) {
        res.status(500).json({ msg: "Internal server error" });
    }
}