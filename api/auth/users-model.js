const db = require("../../data/dbConfig");

const getById = (id) => {
  return db("users").where({ id }).first();
};

const create = (user) => {
  return db("users")
    .insert(user)
    .then((id) => getById(id[0]));
};

const get = (user) => {
  return db("users").where({ username: user.username }).first();
};

module.exports = { create, get };
