const ports = 3001;
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();

app.use(cors());

app.use(function (req, res, next) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  res.setHeader("Access-Control-Allow-Credentials", true);
  next();
});

app.use(
  bodyParser.json({
    limit: "50mb",
    extended: true,
  })
);

app.use(
  bodyParser.urlencoded({
    limit: "50mb",
    extended: true,
  })
);

app.use(({ method, body }, res, next) => {
  if (method === "GET") next();
  if (method === "POST") {
    if (Object.keys(body).length) {
      next();
    } else {
      res.status(400).json({
        status: "error",
        currentDateTime: new Date(),
        message: "400 parameter not found",
      });
    }
  }
});

app.use("/contract", require("./routes/contract.route"));
app.use("/settings", require("./routes/settings.route"));
app.use("/reports", require("./routes/reports.route"));
app.use("/property", require("./routes/property.route"));
app.use("/query", require("./routes/query.route"));
// app.use("/apps", require("./routes/apps.route"));
app.use("/pdf", require("./routes/pdf.route"));

app.get("*", function (req, res) {
  res.status(404).json({
    status: "error",
    currentDateTime: new Date(),
    message: "404 route not found",
  });
});

app.get("/status", function (req, res) {
  res.status(200).json({
    error: false,
    message: "contract api server is running",
  });
});

app.listen(ports, () => {
  console.log("server is up and running on port number " + ports);
});
