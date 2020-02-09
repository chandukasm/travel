const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const admin = require("./routes/admin");
const auth = require("./routes/auth");
const traveler = require("./routes/traveler");
const config = require("config");
const group = require("./routes/group");

//middleware
app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use("/api/admin", admin);
app.use("/api/auth", auth);
app.use("/api/traveler", traveler);
app.use("/api/group", group);

if (!config.get("jwtPrivateKey")) {
  console.error("FATEL ERROR: JWT PRIVATE KEY NOT DEFINED");
  process.exit(1);
}

app.get("/", (req, res) => {
  res.send("your request recieved");
});

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`listining on ${port}...`);
});
