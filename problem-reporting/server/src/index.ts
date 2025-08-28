import express, { Express } from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";

const app: Express = express();

dotenv.config();

app.use(express.json());
app.use(
  cors({
    origin: ["*"],
    credentials: true,
    methods: ["POST", "GET", "PUT", "PATCH", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(cookieParser());

app.get("/", (_req: any, res: { send: (arg0: string) => void }) => {
  res.send("<h1>Welcome to Problem Reports");
});

const port = process.env.PORT || 4300;
console.log(`App running on port ${port}`);
app.listen(port);
