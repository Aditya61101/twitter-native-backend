"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const user_1 = require("../controllers/user");
const router = express_1.default.Router();
//list users
router.get('/', user_1.getAllUsers);
//get one user
router.get('/:id', user_1.getUserById);
//update a user
router.put('/:id', user_1.updateUser);
//delete a user
router.delete('/:id', user_1.deleteUser);
exports.default = router;
