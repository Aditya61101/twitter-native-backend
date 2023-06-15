"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const tweet_1 = require("../controllers/tweet");
const router = express_1.default.Router();
// creating tweet
router.post('/', tweet_1.createTweet);
//list tweets
router.get('/', tweet_1.getAllTweets);
//get one tweet
router.get('/:id', tweet_1.getTweetById);
//delete a tweet
router.delete('/:id', tweet_1.deleteTweet);
exports.default = router;
