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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authValidate = exports.authLogin = void 0;
const client_1 = require("@prisma/client");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const emailServices_1 = require("../services/emailServices");
const prisma = new client_1.PrismaClient();
const EMAIL_TOKEN_EXPIRATION_MINUTES = 10;
const API_TOKEN_EXPIRATION_HRS = 24;
function generateAuthToken(tokenId) {
    return jsonwebtoken_1.default.sign({ tokenId }, process.env.JWT_SECRET, {
        algorithm: "HS256",
        noTimestamp: true,
    });
}
function generateEmailToken() {
    return Math.floor(10000000 + Math.random() * 90000000).toString();
}
//create a user, if it doesn't exists.
// generate the emailToken and send it to their email
const authLogin = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email } = req.body;
    const emailToken = generateEmailToken();
    const expiration = new Date(new Date().getTime() + EMAIL_TOKEN_EXPIRATION_MINUTES * 60000);
    try {
        yield prisma.token.create({
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
        yield (0, emailServices_1.sendEmailToken)(email, emailToken);
        res.sendStatus(201);
    }
    catch (error) {
        res.status(500).send({ msg: "Internal Server Error" });
    }
});
exports.authLogin = authLogin;
//validate the emailToken and generate a long lived token
const authValidate = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, emailToken } = req.body;
    try {
        const token = yield prisma.token.findUnique({
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
        const apiToken = yield prisma.token.create({
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
        yield prisma.token.update({
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
    }
    catch (error) {
        res.status(500).send({ msg: "Internal Server Error" });
    }
});
exports.authValidate = authValidate;
