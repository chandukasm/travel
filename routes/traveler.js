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

// adding a new traveler
router.post("/", async (req, res) => {
  const schema = {
    first_name: Joi.string()
      .min(3)
      .required(),
    last_name: Joi.string()
      .min(2)
      .required(),
    group_number: Joi.number().required(),
    pp_number: Joi.number().required()
  };

  const result = Joi.validate(req.body, schema);
  //   console.log(result);
  if (result.error) {
    res.status(400).send(result.error.details[0].message);
    return;
  }

  const { first_name, last_name, pp_number, group_number } = req.body;
  const values = [first_name, last_name, group_number, pp_number];
  console.log("these are the values : " + values);
  pool.query(
    "INSERT INTO traveler (first_name,last_name,group_number,passport_number) VALUES($1,$2,$3,$4) RETURNING *",
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

//edit a traveller
router.post("/edit", async (req, res) => {
  const schema = {
    first_name: Joi.string()
      .min(3)
      .required(),
    last_name: Joi.string()
      .min(2)
      .required(),
    group_number: Joi.number().required(),
    pp_number: Joi.number().required(),
    id: Joi.number().required()
  };

  const result = Joi.validate(req.body, schema);
  //   console.log(result);
  if (result.error) {
    res.status(400).send(result.error.details[0].message);
    return;
  }

  const { first_name, last_name, pp_number, group_number, id } = req.body;
  const values = [first_name, last_name, group_number, pp_number, id];
  //   console.log("these are the values : " + values);
  pool.query(
    "update traveler set first_name=$1, last_name=$2,group_number=$3,passport_number=$4 where id =$5 returning *",
    //   "update traveler set first_name=$1 ,last_name = $2,group_number=$3,passport_number=$4 where id=$5 returning *",
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

// traveller by grp
router.get("/all", (req, res) => {
  pool.query("SELECT * from traveler", (err, result) => {
    if (err) {
      console.log(err.message);
    }
    res.send(result.rows);
    client.end();
  });
});

// function queryEngnine(requestBody) {
//   const { first_name, last_name, pp_number, group_number, id } = requestBody;
//   //   const data = [first_name, last_name, pp_number, group_number, id];
//   var query = "update traveler set ";
//   if (first_name != null) {
//     query += "first_name=$1 ";
//   }
//   if (last_name != null) {
//     query += ",last_name=$2 ";
//   }
//   if (pp_number != null) {
//     query += ",passport_number=$3 ";
//   }
//   if (group_number != null) {
//     query += ",group_number=$4 ";
//   }

//   query += "where id = $5 ";
//   query += "returning *";
//   console.log(query);
//   return query;
// }

module.exports = router;
