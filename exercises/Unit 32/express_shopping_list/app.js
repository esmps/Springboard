const express = require('express');
const ExpressError = require("./expressError");
const itemRoutes = require("./itemRoutes")

const app = express();
app.use(express.json());

app.use('/items', itemRoutes)

// 404 Handler
app.use(function (req, res, next) {
    return next(new ExpressError("Not Found", 404));
  });

app.use((err, req, res) => {
    let status = err.status || 500;

    return res.status(status).json({
        error: {
          message: err.message,
          status: status
        }
      });
  });

module.exports = app;