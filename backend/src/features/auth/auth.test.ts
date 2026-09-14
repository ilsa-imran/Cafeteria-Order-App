import { afterAll, beforeAll, describe, expect, it } from "vitest";
import request from "supertest";
import { createApp } from "../../app.js";
import { prisma } from "../../shared/lib/prisma.js";
import { signAuthToken } from "../../shared/lib/jwt.js";

const app = createApp();

describe("auth API — /auth/staff", () => {
  let adminId: string;
  let staffId: string;
  let studentId: string;
  const createdEmails: string[] = [];

  beforeAll(async () => {
    const admin = await prisma.user.create({
      data: {
        name: "Test Admin",
        email: "auth-test-admin@cafeteria.test",
        passwordHash: "unused",
        role: "ADMIN",
      },
    });
    adminId = admin.id;

    const staff = await prisma.user.create({
      data: {
        name: "Test Staff",
        email: "auth-test-staff@cafeteria.test",
        passwordHash: "unused",
        role: "STAFF",
      },
    });
    staffId = staff.id;

    const student = await prisma.user.create({
      data: {
        name: "Test Student",
        email: "auth-test-student@university.test",
        passwordHash: "unused",
        role: "STUDENT",
      },
    });
    studentId = student.id;
  });

  afterAll(async () => {
    await prisma.user.deleteMany({
      where: { id: { in: [adminId, staffId, studentId] } },
    });
    await prisma.user.deleteMany({ where: { email: { in: createdEmails } } });
    await prisma.$disconnect();
  });

  it("rejects an unauthenticated request", async () => {
    const res = await request(app)
      .post("/auth/staff")
      .send({ name: "New Staff", email: "x@cafeteria.test", password: "password123", role: "STAFF" });
    expect(res.status).toBe(401);
  });

  it("rejects a student trying to create a staff account", async () => {
    const token = signAuthToken({ sub: studentId, role: "STUDENT" });
    const res = await request(app)
      .post("/auth/staff")
      .set("Authorization", `Bearer ${token}`)
      .send({ name: "New Staff", email: "x@cafeteria.test", password: "password123", role: "STAFF" });
    expect(res.status).toBe(403);
  });

  it("rejects a staff member trying to create another staff account", async () => {
    const token = signAuthToken({ sub: staffId, role: "STAFF" });
    const res = await request(app)
      .post("/auth/staff")
      .set("Authorization", `Bearer ${token}`)
      .send({ name: "New Staff", email: "x@cafeteria.test", password: "password123", role: "STAFF" });
    expect(res.status).toBe(403);
  });

  it("lets an admin create a staff account, and that account can log in as STAFF", async () => {
    const token = signAuthToken({ sub: adminId, role: "ADMIN" });
    const email = "auth-test-new-staff@cafeteria.test";
    createdEmails.push(email);

    const created = await request(app)
      .post("/auth/staff")
      .set("Authorization", `Bearer ${token}`)
      .send({ name: "New Staff Member", email, password: "password123", role: "STAFF" });

    expect(created.status).toBe(201);
    expect(created.body.role).toBe("STAFF");
    expect(created.body).not.toHaveProperty("passwordHash");

    const loggedIn = await request(app)
      .post("/auth/login")
      .send({ email, password: "password123" });

    expect(loggedIn.status).toBe(200);
    expect(loggedIn.body.user.role).toBe("STAFF");
  });

  it("lets an admin create another admin account", async () => {
    const token = signAuthToken({ sub: adminId, role: "ADMIN" });
    const email = "auth-test-new-admin@cafeteria.test";
    createdEmails.push(email);

    const res = await request(app)
      .post("/auth/staff")
      .set("Authorization", `Bearer ${token}`)
      .send({ name: "New Admin", email, password: "password123", role: "ADMIN" });

    expect(res.status).toBe(201);
    expect(res.body.role).toBe("ADMIN");
  });

  it("rejects an invalid role value", async () => {
    const token = signAuthToken({ sub: adminId, role: "ADMIN" });
    const res = await request(app)
      .post("/auth/staff")
      .set("Authorization", `Bearer ${token}`)
      .send({ name: "Bad Role", email: "bad-role@cafeteria.test", password: "password123", role: "STUDENT" });
    expect(res.status).toBe(400);
  });

  it("rejects a duplicate email", async () => {
    const token = signAuthToken({ sub: adminId, role: "ADMIN" });
    const email = "auth-test-duplicate@cafeteria.test";
    createdEmails.push(email);

    await request(app)
      .post("/auth/staff")
      .set("Authorization", `Bearer ${token}`)
      .send({ name: "First", email, password: "password123", role: "STAFF" });

    const res = await request(app)
      .post("/auth/staff")
      .set("Authorization", `Bearer ${token}`)
      .send({ name: "Second", email, password: "password123", role: "STAFF" });

    expect(res.status).toBe(409);
  });
});
