import request from "supertest";
import app from "../server.js";
import mongoose from "mongoose";
import User from "../models/user.js";
import Sweet from "../models/sweet.js";

let userToken;
let adminToken;
let sweetId;

beforeAll(async () => {
  await mongoose.connect("mongodb://127.0.0.1:27017/sweetshop_test");

  await User.deleteMany();
  await Sweet.deleteMany();

  // Register a normal user
  await request(app).post("/api/auth/register").send({
    name: "Normal User",
    email: "normal@example.com",
    password: "123456"
  });

  // Login normal user
  const userLogin = await request(app).post("/api/auth/login").send({
    email: "normal@example.com",
    password: "123456"
  });

  userToken = userLogin.body.token;

  // Register admin
  await request(app).post("/api/auth/register").send({
    name: "Admin User",
    email: process.env.ADMIN_EMAILS,  // admin email
    password: "admin123"
  });

  const adminLogin = await request(app).post("/api/auth/login").send({
    email: process.env.ADMIN_EMAILS,
    password: "admin123"
  });

  adminToken = adminLogin.body.token;
});

afterAll(async () => {
  await mongoose.connection.db.dropDatabase();
  await mongoose.connection.close();
});

describe("Sweet Tests", () => {

  test("admin should add a sweet", async () => {
    const res = await request(app)
      .post("/api/sweets")
      .set("Authorization", `Bearer ${adminToken}`)
      .send({
        name: "Gulab Jamun",
        category: "Indian",
        price: 20,
        quantity: 5
      });

    expect(res.statusCode).toBe(201);
    sweetId = res.body.sweet._id;
  });

  test("user should fetch all sweets", async () => {
    const res = await request(app)
      .get("/api/sweets")
      .set("Authorization", `Bearer ${userToken}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.sweets.length).toBeGreaterThan(0);
  });

  test("user should purchase a sweet (quantity - 1)", async () => {
    const res = await request(app)
      .post(`/api/sweets/${sweetId}/purchase`)
      .set("Authorization", `Bearer ${userToken}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.sweet.quantity).toBe(4); // 5 → 4
  });

  test("admin should restock a sweet", async () => {
    const res = await request(app)
      .post(`/api/sweets/${sweetId}/restock`)
      .set("Authorization", `Bearer ${adminToken}`)
      .send({ amount: 3 });

    expect(res.statusCode).toBe(200);
    expect(res.body.sweet.quantity).toBe(7); // 4 → +3 = 7
  });

  test("admin should delete a sweet", async () => {
    const res = await request(app)
      .delete(`/api/sweets/${sweetId}`)
      .set("Authorization", `Bearer ${adminToken}`);

    expect(res.statusCode).toBe(200);
  });

});
