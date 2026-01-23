const express = require("express");
const session = require("express-session");
const env = require("../config/env");

const authRoutes = require("./routes/auth.routes");
const clientRoutes = require("./routes/clients.routes");
const invoiceRoutes = require("./routes/invoices.routes");
const errorMiddleware = require("./middlewares/error.middleware");

const app = express();

app.use(express.json());

app.use(session({
  name: "sid",
  secret: env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    sameSite: "lax"
  }
}));

// DEBUG WAJIB, JANGAN DIHAPUS DULU
app.use((req, res, next) => {
  console.log("SESSION DEBUG:", req.session);
  next();
});

// ROUTES HARUS SETELAH SESSION
app.use("/auth", authRoutes);
app.use("/clients", clientRoutes);
app.use("/invoices", invoiceRoutes);

app.use(errorMiddleware);

app.listen(env.PORT, () => {
  console.log("Server running on port", env.PORT);
});
