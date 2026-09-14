import { AppError } from "../../shared/lib/AppError.js";
import { prisma } from "../../shared/lib/prisma.js";
import type { createMenuItemSchema, updateMenuItemSchema } from "./schema.js";
import type { z } from "zod";

export function listMenuItems() {
  return prisma.menuItem.findMany({ orderBy: { createdAt: "asc" } });
}

export function createMenuItem(data: z.infer<typeof createMenuItemSchema>) {
  return prisma.menuItem.create({ data });
}

export async function updateMenuItem(
  id: string,
  data: z.infer<typeof updateMenuItemSchema>,
) {
  const existing = await prisma.menuItem.findUnique({ where: { id } });
  if (!existing) {
    throw new AppError(404, "Menu item not found");
  }
  return prisma.menuItem.update({ where: { id }, data });
}

export async function deleteMenuItem(id: string) {
  const existing = await prisma.menuItem.findUnique({ where: { id } });
  if (!existing) {
    throw new AppError(404, "Menu item not found");
  }
  await prisma.menuItem.delete({ where: { id } });
}
