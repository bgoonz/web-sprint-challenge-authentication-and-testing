const db = require("../data/dbConfig");
const server = require("./server");
const request = require("supertest");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("./secrets");
const jokes = require("../api/jokes/jokes-data");

// Write your tests here

const user1 = { username: "user", password: "pass1234" };

test("sanity", () => {
  expect(true).toBe(true);
});

beforeAll(async () => {
  await db.migrate.rollback();
  await db.migrate.latest();
});
beforeEach(async () => {
  await db("users").truncate();
});

afterAll(async () => {
  await db.destroy();
});
describe("Verify Endpoints are working", () => {
  describe("/api/auth/register", () => {
    it("[POST] creates new User", async () => {
      const newUser = await request(server)
        .post("/api/auth/register")
        .send(user1)
        .expect(201)
        .then((res) => res.body);
      const user = await db("users").where({ id: newUser.id }).first();
      expect(user);
    });
    it("[POST] updates database", async () => {
      const newUser = await request(server)
        .post("/api/auth/register")
        .send(user1)
        .expect(201)
        .then((res) => res.body);
      const user = await db("users").where({ id: newUser.id }).first();
      expect(bcrypt.compareSync(user1.password, user.password)).toBe(true);
      expect(user.username).toBe(user1.username);
    });
  });
  describe("/api/auth/login", () => {
    it("[POST] returns valid token", async () => {
      await request(server) // ADD user1 FOR LOGIN
        .post("/api/auth/register")
        .send(user1)
        .expect(201);

      const token = await request(server)
        .post("/api/auth/login")
        .send(user1)
        .expect(200)
        .then((res) => res.body.token);
      expect(jwt.verify(token, JWT_SECRET)).toBeDefined();
    });
    it("[POST] fails without password", async () => {
      const response = await request(server)
        .post("/api/auth/login")
        .send({ username: "yes" })
        .expect(400);
      expect(response.body.message).toBe("username and password required");
    });
  });
  describe("/api/jokes", () => {
    it("[GET] returns jokes with proper token.", async () => {
      await request(server) // ADD user1 FOR LOGIN
        .post("/api/auth/register")
        .send(user1)
        .expect(201);

      const token = await request(server) // GET TOKEN FOR AUTH HEADER.
        .post("/api/auth/login")
        .send(user1)
        .expect(200)
        .then((res) => res.body.token);

      const rjokes = await request(server)
        .get("/api/jokes")
        .set("Authorization", token) // Use Token in Authorization header.
        .expect(200)
        .then((res) => res.body);
      expect(rjokes).toStrictEqual(jokes);
    });
    it("[GET] returns a 403 error without a token", async () => {
      await request(server).get("/api/jokes").expect(403);
    });
  });
});
