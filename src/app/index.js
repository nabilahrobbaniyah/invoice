const express = require("express");
const session = require("express-session");
const env = require("../config/env");

const authRoutes = require("./routes/auth.routes");
const clientRoutes = require("./routes/clients.routes");
const invoiceRoutes = require("./routes/invoices.routes");
const dashboardRoutes = require("./routes/dashboard.routes");
const errorMiddleware = require("./middlewares/error.middleware");
const app = express();

app.use(express.json());

app.use(
  session({
    name: "invoice.sid",
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      sameSite: "lax",
      secure: false,
      maxAge: 1000 * 60 * 60 * 8
    }
  })
);

// Debug session
app.use((req, res, next) => {
  console.log("SESSION DEBUG:", req.session);
  next();
});

app.get("/ping", (req, res) => {
  res.json({ ok: true });
});

// Routes
app.use("/auth", authRoutes);
app.use("/clients", clientRoutes);
app.use("/invoices", invoiceRoutes);
app.use("/dashboard", dashboardRoutes);

// Error handler HARUS terakhir
app.use(errorMiddleware);

app.listen(env.PORT, () => {
  console.log("Server running on port", env.PORT);
});

module.exports = app;
