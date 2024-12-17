import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db.config.js";
import config from "./config/env.config.js";
import authRoutes from "./routes/auth.routes.js";
import categoryRoutes from "./routes/category.routes.js";
import subCategoryRoutes from "./routes/sucategory.routes.js";
import skillsRoutes from "./routes/skills.routes.js";
import userRoutes from "./routes/user.routes.js";
import mentorRoutes from "./routes/mentor.routes.js";
import passport from "passport";
import configurePassport from "./utils/passport.utils.js";
import session from "express-session";
import helmet from "helmet";
import cors from "cors";
dotenv.config();
const app = express();
// Connect to DB
connectDB();
// Middleware
app.use(express.json());
app.use(helmet());
app.use(cors());
// Session configuration
app.use(session({
    secret: config.sessionsecret,
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: process.env.NODE_ENV === "production", // Only secure cookies in production
        maxAge: 24 * 60 * 60 * 1000, // 1 day
    },
}));
// Passport Configuration
app.use(passport.initialize());
configurePassport();
// Routes
app.use("/api/auth", authRoutes);
app.use("/api/category", categoryRoutes);
app.use("/api/subcategory", subCategoryRoutes);
app.use("/api/skills", skillsRoutes);
app.use("/api/users", userRoutes);
app.use("/api/mentors", mentorRoutes);
// Placeholder route
app.get("/", (_req, res) => {
    res.send("Connect Sphere Backend is running!");
});
// Error Handling Middleware (for unhandled errors)
app.use((err, _req, res, _next) => {
    console.error(err.stack);
    res.status(500).send({ error: "Something went wrong!" });
});
// Start server
app.listen(config.port, () => {
    console.log(`Server is running on http://localhost:${config.port}`);
});
//# sourceMappingURL=index.js.map