"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteUser = exports.updateUser = exports.getUserById = exports.getAllUsers = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const getAllUsers = (_, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const users = yield prisma.user.findMany();
        res.status(200).json(users);
    }
    catch (err) {
        res.status(500).json({ msg: "Internal Server Error" });
    }
});
exports.getAllUsers = getAllUsers;
const getUserById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const user = yield prisma.user.findUnique({
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
    }
    catch (error) {
        res.status(500).json({ msg: "Internal Server Error" });
    }
});
exports.getUserById = getUserById;
const updateUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { image, bio, name } = req.body;
    try {
        const user = yield prisma.user.findUnique({
            where: { id: Number(id) }
        });
        if (!user) {
            res.status(400).json({ msg: "Invalid Id" });
            return;
        }
        const updatedUser = yield prisma.user.update({
            where: { id: Number(id) },
            data: { image, bio, name }
        });
        res.status(200).json(updatedUser);
    }
    catch (error) {
        res.status(500).json({ msg: "Internal server error" });
    }
});
exports.updateUser = updateUser;
const deleteUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const user = yield prisma.user.findUnique({
            where: {
                id: Number(id)
            }
        });
        if (!user) {
            res.status(400).json({ msg: "Invalid Id" });
            return;
        }
        yield prisma.user.delete({
            where: {
                id: Number(id)
            }
        });
        res.sendStatus(204);
    }
    catch (error) {
        res.status(500).json({ msg: "Internal server error" });
    }
});
exports.deleteUser = deleteUser;
