import request from "supertest";
import app from "../server.js";
import mongoose from "mongoose";
import User from "../models/user.js";

beforeAll(async () => {
  await mongoose.connect("mongodb://127.0.0.1:27017/sweetshop_test");
  await User.deleteMany();
});

afterAll(async () => {
  await mongoose.connection.db.dropDatabase();
  await mongoose.connection.close();
});

describe("Auth Tests", () => {
  
  test("should register a user", async () => {
    const res = await request(app)
      .post("/api/auth/register")
      .send({
        name: "Test User",
        email: "testuser@example.com",
        password: "123456"
      });

    expect(res.statusCode).toBe(201);
    expect(res.body.role).toBe("user");
  });

  test("should login the user and return a token", async () => {
    const res = await request(app)
      .post("/api/auth/login")
      .send({
        email: "testuser@example.com",
        password: "123456"
      });

    expect(res.statusCode).toBe(200);
    expect(res.body.token).toBeDefined();
  });

});
