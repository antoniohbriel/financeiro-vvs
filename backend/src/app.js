import express from "express";
import cors from "cors";

import transactionRoutes from "./routes/transactionRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import categoryRoutes from "./routes/categoryRoutes.js";
import budgetRoutes from "./routes/budgetRoutes.js";
import profilePictureRoutes from "./routes/profilePictureRoutes.js";
import notificationRoutes from "./routes/notificationRoutes.js";

const app = express();

app.use(cors());
app.use(express.json());

// --- Rotas ---
app.use("/api/transactions", transactionRoutes);
app.use("/api/users", userRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/budgets", budgetRoutes);
app.use("/api/profile-pictures", profilePictureRoutes);
app.use("/api/notifications", notificationRoutes);

export default app;     // <-- ESSENCIAL PARA O SUPERTEST
