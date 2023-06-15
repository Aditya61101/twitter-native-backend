"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const user_1 = __importDefault(require("./routes/user"));
const tweet_1 = __importDefault(require("./routes/tweet"));
const auth_1 = __importDefault(require("./routes/auth"));
const middleware_1 = require("./middleware");
const app = (0, express_1.default)();
const PORT = 5000 || process.env.PORT;
//to parse data as json data
app.use(express_1.default.json());
//app.METHOD(PATH, HANDLER)
app.get("/", (_, res) => {
    res.send("Hello World");
});
//routes
app.use("/api/user", middleware_1.authMiddleware, user_1.default);
app.use("/api/tweet", middleware_1.authMiddleware, tweet_1.default);
app.use("/api/auth", auth_1.default);
//listen to port
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
