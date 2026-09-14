import { afterAll, beforeAll, describe, expect, it } from "vitest";
import request from "supertest";
import { createApp } from "../../app.js";
import { prisma } from "../../shared/lib/prisma.js";
import { signAuthToken } from "../../shared/lib/jwt.js";

const app = createApp();

describe("orders API", () => {
  let studentId: string;
  let otherStudentId: string;
  let staffId: string;
  let menuItemId: string;
  let unavailableMenuItemId: string;

  beforeAll(async () => {
    const student = await prisma.user.create({
      data: {
        name: "Order Test Student",
        email: "order-test-student@university.test",
        passwordHash: "unused",
        role: "STUDENT",
      },
    });
    studentId = student.id;

    const otherStudent = await prisma.user.create({
      data: {
        name: "Other Student",
        email: "other-student@university.test",
        passwordHash: "unused",
        role: "STUDENT",
      },
    });
    otherStudentId = otherStudent.id;

    const staff = await prisma.user.create({
      data: {
        name: "Order Test Staff",
        email: "order-test-staff@cafeteria.test",
        passwordHash: "unused",
        role: "STAFF",
      },
    });
    staffId = staff.id;

    const menuItem = await prisma.menuItem.create({
      data: { name: "Test Biryani", price: 200, available: true },
    });
    menuItemId = menuItem.id;

    const unavailableItem = await prisma.menuItem.create({
      data: { name: "Test Sandwich", price: 150, available: false },
    });
    unavailableMenuItemId = unavailableItem.id;
  });

  afterAll(async () => {
    await prisma.orderItem.deleteMany({ where: { order: { userId: studentId } } });
    await prisma.order.deleteMany({ where: { userId: studentId } });
    await prisma.menuItem.deleteMany({
      where: { id: { in: [menuItemId, unavailableMenuItemId] } },
    });
    await prisma.user.deleteMany({
      where: { id: { in: [studentId, otherStudentId, staffId] } },
    });
    await prisma.$disconnect();
  });

  it("generates unique order numbers even when many orders are created at the same instant", async () => {
    const token = signAuthToken({ sub: studentId, role: "STUDENT" });

    const responses = await Promise.all(
      Array.from({ length: 20 }, () =>
        request(app)
          .post("/orders")
          .set("Authorization", `Bearer ${token}`)
          .send({ items: [{ menuItemId, quantity: 1 }], pickupTime: "IMMEDIATELY" }),
      ),
    );

    for (const res of responses) {
      expect(res.status).toBe(201);
    }
    const orderNumbers = responses.map((res) => res.body.orderNumber);
    expect(new Set(orderNumbers).size).toBe(orderNumbers.length);
  });

  it("calculates the total server-side, ignoring any client-supplied price", async () => {
    const token = signAuthToken({ sub: studentId, role: "STUDENT" });
    const res = await request(app)
      .post("/orders")
      .set("Authorization", `Bearer ${token}`)
      .send({ items: [{ menuItemId, quantity: 2 }], pickupTime: "WITHIN_30_MIN" });

    expect(res.status).toBe(201);
    expect(res.body.total).toBe(400);
  });

  it("rejects an order containing an unavailable item", async () => {
    const token = signAuthToken({ sub: studentId, role: "STUDENT" });
    const res = await request(app)
      .post("/orders")
      .set("Authorization", `Bearer ${token}`)
      .send({
        items: [{ menuItemId: unavailableMenuItemId, quantity: 1 }],
        pickupTime: "IMMEDIATELY",
      });

    expect(res.status).toBe(400);
  });

  it("prevents a student from reading another student's order", async () => {
    const token = signAuthToken({ sub: studentId, role: "STUDENT" });
    const created = await request(app)
      .post("/orders")
      .set("Authorization", `Bearer ${token}`)
      .send({ items: [{ menuItemId, quantity: 1 }], pickupTime: "IMMEDIATELY" });

    const otherToken = signAuthToken({ sub: otherStudentId, role: "STUDENT" });
    const res = await request(app)
      .get(`/orders/${created.body.id}`)
      .set("Authorization", `Bearer ${otherToken}`);

    expect(res.status).toBe(403);
  });

  it("lets a student list only their own orders, never another student's", async () => {
    const studentToken = signAuthToken({ sub: studentId, role: "STUDENT" });
    await request(app)
      .post("/orders")
      .set("Authorization", `Bearer ${studentToken}`)
      .send({ items: [{ menuItemId, quantity: 1 }], pickupTime: "IMMEDIATELY" });

    const res = await request(app)
      .get("/orders")
      .set("Authorization", `Bearer ${studentToken}`);

    expect(res.status).toBe(200);
    expect(res.body.every((order: { userId: string }) => order.userId === studentId)).toBe(
      true,
    );
  });

  it("rejects a student trying to use staff-only list filters", async () => {
    const studentToken = signAuthToken({ sub: studentId, role: "STUDENT" });
    const res = await request(app)
      .get("/orders?status=READY")
      .set("Authorization", `Bearer ${studentToken}`);

    expect(res.status).toBe(403);
  });

  it("only allows the controlled status transition sequence", async () => {
    const studentToken = signAuthToken({ sub: studentId, role: "STUDENT" });
    const created = await request(app)
      .post("/orders")
      .set("Authorization", `Bearer ${studentToken}`)
      .send({ items: [{ menuItemId, quantity: 1 }], pickupTime: "IMMEDIATELY" });

    const staffToken = signAuthToken({ sub: staffId, role: "STAFF" });

    const skipped = await request(app)
      .patch(`/orders/${created.body.id}/status`)
      .set("Authorization", `Bearer ${staffToken}`)
      .send({ status: "READY" });
    expect(skipped.status).toBe(400);

    const correct = await request(app)
      .patch(`/orders/${created.body.id}/status`)
      .set("Authorization", `Bearer ${staffToken}`)
      .send({ status: "PREPARING" });
    expect(correct.status).toBe(200);
    expect(correct.body.status).toBe("PREPARING");
  });

  it("rejects pickup confirmation until the order is ready", async () => {
    const studentToken = signAuthToken({ sub: studentId, role: "STUDENT" });
    const created = await request(app)
      .post("/orders")
      .set("Authorization", `Bearer ${studentToken}`)
      .send({ items: [{ menuItemId, quantity: 1 }], pickupTime: "IMMEDIATELY" });

    const staffToken = signAuthToken({ sub: staffId, role: "STAFF" });
    const res = await request(app)
      .post(`/orders/${created.body.id}/pickup`)
      .set("Authorization", `Bearer ${staffToken}`);

    expect(res.status).toBe(409);
  });
});
