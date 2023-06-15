import express from 'express';
import { createTweet, deleteTweet, getAllTweets, getTweetById } from '../controllers/tweet';

const router = express.Router();

// creating tweet
router.post('/', createTweet);

//list tweets
router.get('/', getAllTweets);

//get one tweet
router.get('/:id', getTweetById);

//delete a tweet
router.delete('/:id', deleteTweet);

export default router;