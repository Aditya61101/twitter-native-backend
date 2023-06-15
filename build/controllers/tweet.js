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
exports.deleteTweet = exports.createTweet = exports.getTweetById = exports.getAllTweets = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const getAllTweets = (_, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const tweets = yield prisma.tweet.findMany({
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
    }
    catch (err) {
        res.status(500).json({ msg: "Internal Server Error" });
    }
});
exports.getAllTweets = getAllTweets;
const getTweetById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const tweet = yield prisma.tweet.findUnique({
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
    }
    catch (error) {
        res.status(500).json({ msg: "Internal Server Error" });
    }
});
exports.getTweetById = getTweetById;
const createTweet = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { content, image } = req.body;
    const userId = (_a = req === null || req === void 0 ? void 0 : req.user) === null || _a === void 0 ? void 0 : _a.id;
    try {
        if (!content) {
            res.status(400).json({ msg: "Please send all required fields" });
            return;
        }
        const newTweet = yield prisma.tweet.create({
            data: {
                content,
                image,
                userId
            }
        });
        res.status(201).json(newTweet);
    }
    catch (error) {
        res.status(500).json({ msg: "Internal Server Error" });
    }
});
exports.createTweet = createTweet;
const deleteTweet = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const tweet = yield prisma.tweet.findUnique({
            where: {
                id: Number(id)
            }
        });
        if (!tweet) {
            res.status(400).json({ msg: "Invalid Id" });
            return;
        }
        yield prisma.tweet.delete({
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
exports.deleteTweet = deleteTweet;
