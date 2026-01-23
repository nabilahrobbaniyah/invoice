const express = require("express");
const session = require("express-session");
const env = require("../config/env");

const authRoutes = require("./routes/auth.routes");
const clientRoutes = require("./routes/clients.routes");
const errorMiddleware = require("./middlewares/error.middleware");
const invoiceRoutes = require("./routes/invoices.routes");

const app = express();

app.use(express.json());


app.use(session({
  secret: env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false
}));

app.use("/auth", authRoutes);
app.use("/clients", clientRoutes);
app.use("/invoices", invoiceRoutes);

app.use(errorMiddleware);

app.listen(env.PORT, () => {
  console.log("Server running on port", env.PORT);
});