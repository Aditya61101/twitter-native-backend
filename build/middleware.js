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
exports.authMiddleware = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const authMiddleware = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const authorization = req.headers.authorization;
    const firstLetter = authorization === null || authorization === void 0 ? void 0 : authorization.split(" ")[0];
    const authToken = authorization === null || authorization === void 0 ? void 0 : authorization.split(" ")[1];
    try {
        if (!authToken || firstLetter !== "Bearer") {
            return res.status(401).json({ msg: "Unauthorized" });
        }
        const { tokenId } = jsonwebtoken_1.default.verify(authToken, process.env.JWT_SECRET);
        if (tokenId) {
            const foundToken = yield prisma.token.findUnique({
                where: {
                    id: Number(tokenId)
                },
                include: {
                    user: true
                }
            });
            if (!(foundToken === null || foundToken === void 0 ? void 0 : foundToken.valid) || (foundToken === null || foundToken === void 0 ? void 0 : foundToken.expiresAt) < new Date())
                return res.status(400).json({ msg: "API Token is not valid" });
            if (foundToken) {
                req.user = foundToken.user;
                next();
            }
            else {
                return res.status(401).json({ msg: "Unauthorized" });
            }
        }
        else
            return res.status(401).json({ msg: "Unauthorized" });
    }
    catch (error) {
        return res.status(500).json({ msg: "Internal server error" });
    }
});
exports.authMiddleware = authMiddleware;
