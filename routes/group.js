const express = require("express");
const router = express.Router();
const { Pool, Client } = require("pg");
const connectionString = "postgresql://eleos:eleos@localhost:5432/travel";
const bc = require("bcrypt");
const Joi = require("joi");
const jwt = require("jsonwebtoken");
const config = require("config");
const auth = require("../middleware/authenticate");

const pool = new Pool({
  connectionString: connectionString
});

const client = new Client({
  connectionString: connectionString
});
client.connect();

// adding a new grp
router.post("/add", async (req, res) => {
  const schema = {
    destination: Joi.string()
      .min(3)
      .required(),
    grp_name: Joi.string()
      .min(2)
      .required(),
    tag: Joi.string()
      .min(2)
      .required()
  };

  const result = Joi.validate(req.body, schema);
  //   console.log(result);
  if (result.error) {
    res.status(400).send(result.error.details[0].message);
    return;
  }

  const { destination, grp_name, tag } = req.body;
  const values = [destination, grp_name, tag];
  //   console.log("these are the values : " + values);
  pool.query(
    "INSERT INTO grp (destination,grp_name,tag) VALUES($1,$2,$3) RETURNING *",
    values,
    (err, result) => {
      if (err) {
        res.status(400).send(err.message);
      } else {
        res.send(result.rows);
      }
      client.end();
    }
  );
});

// traveller by grp
router.get("/", (req, res) => {
  pool.query("SELECT * from traveler where group_number=1", (err, result) => {
    if (err) {
      console.log(err.message);
    }
    res.send(result.rows);
    client.end();
  });
});

router.get("/all", (req, res) => {
  pool.query("SELECT * from grp", (err, result) => {
    if (err) {
      console.log(err.message);
    }
    res.send(result.rows);
    client.end();
  });
});

//getAlltags
router.get("/tags", (req, res) => {
  pool.query("SELECT DISTINCT tag from grp ORDER BY tag", (err, result) => {
    if (err) {
      console.log(err.message);
    }
    res.send(result.rows);
    client.end();
  });
});

module.exports = router;
