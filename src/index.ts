import express from "express";
import userRoutes from "./routes/user";
import tweetRoutes from "./routes/tweet";
import authRoutes from "./routes/auth";
import { authMiddleware } from "./middleware";

const app = express();
const PORT = 5000 || process.env.PORT;

//to parse data as json data
app.use(express.json());

//app.METHOD(PATH, HANDLER)
app.get("/", (_, res) => {
    res.send("Hello World");
});

//routes
app.use("/api/user", authMiddleware, userRoutes);
app.use("/api/tweet", authMiddleware, tweetRoutes);
app.use("/api/auth", authRoutes);

//listen to port
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));