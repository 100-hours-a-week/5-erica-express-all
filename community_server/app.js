import express from "express";
import userRouter from "./routes/user.js";
import postRouter from "./routes/post.js";
import commentRouter from "./routes/comment.js";
import profileImageRouter from "./routes/profileImage.js";
import postImageRouter from "./routes/postImage.js";
import * as Sentry from "@sentry/node";
import { nodeProfilingIntegration } from "@sentry/profiling-node";
import cors from "cors";
import cookieParser from "cookie-parser";
import session from "express-session";

const app = express();
const port = 8000;
const corsOptions = {
  origin: "http://localhost:3000",
  credentials: true,
  method: ["GET", "PUT", "POST", "PATCH", "DELETE"],
};
app.use(cors(corsOptions));
app.use(cookieParser());
app.use(
  session({
    secret: "pizzamandu",
    saveUninitialized: true,
    resave: false,
    cookie: {
      secure: false,
    },
  })
);

Sentry.init({
  dsn: "https://9fddd166b460c75bd5777c01ac66f668@o4507163352629248.ingest.us.sentry.io/4507163357020160",
  integrations: [
    // enable HTTP calls tracing
    new Sentry.Integrations.Http({ tracing: true }),
    // enable Express.js middleware tracing
    new Sentry.Integrations.Express({ app }),
    nodeProfilingIntegration(),
  ],
  // Performance Monitoring
  tracesSampleRate: 1.0, //  Capture 100% of the transactions
  // Set sampling rate for profiling - this is relative to tracesSampleRate
  profilesSampleRate: 1.0,
});

// The request handler must be the first middleware on the app
app.use(Sentry.Handlers.requestHandler());

// TracingHandler creates a trace for every incoming request
app.use(Sentry.Handlers.tracingHandler());

app.use(express.urlencoded({ extended: true }));
app.use(express.json({ limit: "50mb" }));
app.use(express.text());

// All your controllers should live here
app.get("/", function rootHandler(req, res) {
  res.end("Hello world!");
});

// Optional fallthrough error handler
app.use(function onError(err, req, res, next) {
  // The error id is attached to `res.sentry` to be returned
  // and optionally displayed to the user for support.
  res.statusCode = 500;
  res.end(res.sentry + "\n");
});

// /api 경로용 라우터
const apiRouter = express.Router();
apiRouter.use("/users", userRouter);
apiRouter.use("/posts", postRouter);
apiRouter.use("/posts", commentRouter);

// /imgaes 경로용 라우터
const imagesRouter = express.Router();
imagesRouter.use("/profile", profileImageRouter);
imagesRouter.use("/post", postImageRouter);

// 공통 라우터
app.use("/api", apiRouter);
app.use("/images", imagesRouter);

app.use("/api/test", (req, res) => {
  throw new Error("에러 테스트");
});

// The error handler must be registered before any other error middleware and after all controllers
app.use(Sentry.Handlers.errorHandler());

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
