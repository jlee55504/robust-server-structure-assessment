const express = require("express");
const app = express();
const urlsRouter = require("./urls/urls.router");
const usesRouter = require("./uses/uses.router");
app.use(express.json());

// TODO: Add code to meet the requirements and make the tests pass.
// Note: app.use on 'paths'
app.use("/urls", urlsRouter);
app.use("/uses", usesRouter);

// Not found handler
app.use((req, res, next) => {
  next({
    status: 404,
    message:`Not found: ${req.originalUrl}`
  });
});

// Error handler
app.use((error, req, res, next) => {
  const {status = 500, message = "Something went wrong!" } = error;
  console.log(error);
  res.status(status).json({ error: message });
});

module.exports = app;
