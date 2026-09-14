import { afterAll, beforeAll, describe, expect, it } from "vitest";
import request from "supertest";
import { createApp } from "../../app.js";
import { prisma } from "../../shared/lib/prisma.js";
import { signAuthToken } from "../../shared/lib/jwt.js";

const app = createApp();

describe("menu API", () => {
  let staffId: string;
  let studentId: string;

  beforeAll(async () => {
    const staff = await prisma.user.create({
      data: {
        name: "Test Staff",
        email: "test-staff@cafeteria.test",
        passwordHash: "unused",
        role: "STAFF",
      },
    });
    staffId = staff.id;

    const student = await prisma.user.create({
      data: {
        name: "Test Student",
        email: "test-student@university.test",
        passwordHash: "unused",
        role: "STUDENT",
      },
    });
    studentId = student.id;
  });

  afterAll(async () => {
    await prisma.user.deleteMany({ where: { id: { in: [staffId, studentId] } } });
    await prisma.$disconnect();
  });

  it("allows anyone to list menu items", async () => {
    const res = await request(app).get("/menu");
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it("rejects menu item creation without authentication", async () => {
    const res = await request(app).post("/menu").send({ name: "Test Item", price: 100 });
    expect(res.status).toBe(401);
  });

  it("rejects menu item creation from a student", async () => {
    const token = signAuthToken({ sub: studentId, role: "STUDENT" });
    const res = await request(app)
      .post("/menu")
      .set("Authorization", `Bearer ${token}`)
      .send({ name: "Test Item", price: 100 });
    expect(res.status).toBe(403);
  });

  it("allows staff to create, update, and delete a menu item", async () => {
    const token = signAuthToken({ sub: staffId, role: "STAFF" });

    const created = await request(app)
      .post("/menu")
      .set("Authorization", `Bearer ${token}`)
      .send({ name: "Test Item", price: 100 });
    expect(created.status).toBe(201);
    expect(created.body.available).toBe(true);

    const updated = await request(app)
      .patch(`/menu/${created.body.id}`)
      .set("Authorization", `Bearer ${token}`)
      .send({ available: false });
    expect(updated.status).toBe(200);
    expect(updated.body.available).toBe(false);

    const deleted = await request(app)
      .delete(`/menu/${created.body.id}`)
      .set("Authorization", `Bearer ${token}`);
    expect(deleted.status).toBe(204);
  });
});
