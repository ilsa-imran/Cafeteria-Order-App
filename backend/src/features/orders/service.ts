import { randomInt } from "node:crypto";
import QRCode from "qrcode";
import { Prisma } from "@prisma/client";
import type { OrderStatus, PaymentMethod, PickupTime } from "@prisma/client";
import { AppError } from "../../shared/lib/AppError.js";
import { prisma } from "../../shared/lib/prisma.js";

const NEXT_STATUS: Record<OrderStatus, OrderStatus | null> = {
  CONFIRMED: "PREPARING",
  PREPARING: "READY",
  READY: "PICKED_UP",
  PICKED_UP: null,
  CANCELLED: null,
};

function generateOrderNumber() {
  const timestampPart = Date.now().toString().slice(-6);
  const randomPart = randomInt(0, 1000).toString().padStart(3, "0");
  return `ORD-${timestampPart}${randomPart}`;
}

function isUniqueOrderNumberConflict(err: unknown): boolean {
  return (
    err instanceof Prisma.PrismaClientKnownRequestError &&
    err.code === "P2002" &&
    (err.meta?.target as string[] | undefined)?.includes("orderNumber") === true
  );
}

export async function createOrder(
  userId: string,
  items: { menuItemId: string; quantity: number }[],
  pickupTime: PickupTime,
  paymentMethod: PaymentMethod,
  pickupTimeMinutes?: number,
) {
  const menuItems = await prisma.menuItem.findMany({
    where: { id: { in: items.map((item) => item.menuItemId) } },
  });

  const orderItems = items.map((item) => {
    const menuItem = menuItems.find((m) => m.id === item.menuItemId);
    if (!menuItem) {
      throw new AppError(400, `Menu item ${item.menuItemId} does not exist`);
    }
    if (!menuItem.available) {
      throw new AppError(400, `${menuItem.name} is currently unavailable`);
    }
    return {
      menuItemId: menuItem.id,
      quantity: item.quantity,
      unitPrice: menuItem.price,
    };
  });

  const total = orderItems.reduce(
    (sum, item) => sum + item.unitPrice * item.quantity,
    0,
  );

  const orderData = (orderNumber: string) => ({
    orderNumber,
    userId,
    pickupTime,
    pickupTimeMinutes: pickupTime === "CUSTOM" ? pickupTimeMinutes : undefined,
    paymentMethod,
    total,
    items: { create: orderItems },
  });
  const include = { items: { include: { menuItem: true } } } as const;

  const maxAttempts = 5;
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      if (paymentMethod === "WALLET") {
        return await prisma.$transaction(async (tx) => {
          const debited = await tx.user.updateMany({
            where: { id: userId, walletBalance: { gte: total } },
            data: { walletBalance: { decrement: total } },
          });
          if (debited.count === 0) {
            const user = await tx.user.findUniqueOrThrow({ where: { id: userId } });
            throw new AppError(
              400,
              `Insufficient wallet balance (Rs. ${user.walletBalance} available, Rs. ${total} needed). Add funds or choose Cash.`,
            );
          }
          return tx.order.create({ data: orderData(generateOrderNumber()), include });
        });
      }

      return await prisma.order.create({ data: orderData(generateOrderNumber()), include });
    } catch (err) {
      if (isUniqueOrderNumberConflict(err) && attempt < maxAttempts) {
        continue;
      }
      throw err;
    }
  }
  throw new AppError(500, "Could not generate a unique order number, please retry");
}

async function findOrderOrThrow(id: string) {
  const order = await prisma.order.findUnique({
    where: { id },
    include: { items: { include: { menuItem: true } } },
  });
  if (!order) {
    throw new AppError(404, "Order not found");
  }
  return order;
}

export async function getOrder(id: string, requester: { id: string; role: string }) {
  const order = await findOrderOrThrow(id);
  const isOwner = order.userId === requester.id;
  const isStaff = requester.role === "STAFF" || requester.role === "ADMIN";
  if (!isOwner && !isStaff) {
    throw new AppError(403, "You do not have access to this order");
  }
  return order;
}

export function listOrders(
  status?: OrderStatus,
  orderNumber?: string,
  userId?: string,
) {
  return prisma.order.findMany({
    where: {
      ...(status ? { status } : {}),
      ...(orderNumber ? { orderNumber } : {}),
      ...(userId ? { userId } : {}),
    },
    include: { items: { include: { menuItem: true } } },
    orderBy: { createdAt: "desc" },
  });
}

export async function updateOrderStatus(id: string, status: OrderStatus) {
  const order = await findOrderOrThrow(id);
  if (NEXT_STATUS[order.status] !== status) {
    throw new AppError(
      400,
      `Cannot move order from ${order.status} to ${status}`,
    );
  }
  return prisma.order.update({
    where: { id },
    data: { status },
    include: { items: { include: { menuItem: true } } },
  });
}

const CANCELLABLE_STATUSES: OrderStatus[] = ["CONFIRMED", "PREPARING"];

export async function cancelOrder(id: string) {
  const include = { items: { include: { menuItem: true } } } as const;

  return prisma.$transaction(async (tx) => {
    const cancelled = await tx.order.updateMany({
      where: { id, status: { in: CANCELLABLE_STATUSES } },
      data: { status: "CANCELLED" },
    });

    if (cancelled.count === 0) {
      const order = await tx.order.findUnique({ where: { id } });
      if (!order) {
        throw new AppError(404, "Order not found");
      }
      throw new AppError(
        409,
        `Cannot cancel an order that is already ${order.status.toLowerCase()}`,
      );
    }

    const order = await tx.order.findUniqueOrThrow({ where: { id }, include });
    if (order.paymentMethod === "WALLET") {
      await tx.user.update({
        where: { id: order.userId },
        data: { walletBalance: { increment: order.total } },
      });
    }
    return order;
  });
}

export async function confirmPickup(id: string) {
  const order = await findOrderOrThrow(id);
  if (order.status === "PICKED_UP") {
    throw new AppError(409, "This order has already been picked up");
  }
  if (order.status !== "READY") {
    throw new AppError(409, "This order is not ready for pickup yet");
  }
  return prisma.order.update({
    where: { id },
    data: { status: "PICKED_UP" },
    include: { items: { include: { menuItem: true } } },
  });
}

export async function getOrderQrCode(id: string, requester: { id: string; role: string }) {
  const order = await getOrder(id, requester);
  return QRCode.toDataURL(order.orderNumber, { margin: 1, width: 240 });
}
