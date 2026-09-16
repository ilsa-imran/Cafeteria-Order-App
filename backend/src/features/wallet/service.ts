import { AppError } from "../../shared/lib/AppError.js";
import { prisma } from "../../shared/lib/prisma.js";

function toWalletProfile(user: { id: string; name: string; email: string; role: string; walletBalance: number }) {
  return { id: user.id, name: user.name, email: user.email, role: user.role, walletBalance: user.walletBalance };
}

export async function findStudentByEmail(email: string) {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user || user.role !== "STUDENT") {
    throw new AppError(404, "No student account found with that email");
  }
  return toWalletProfile(user);
}

export async function topUpWallet(userId: string, amount: number) {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) {
    throw new AppError(404, "User not found");
  }
  if (user.role !== "STUDENT") {
    throw new AppError(400, "Only student wallets can be topped up");
  }

  const updated = await prisma.user.update({
    where: { id: userId },
    data: { walletBalance: { increment: amount } },
  });

  return toWalletProfile(updated);
}
