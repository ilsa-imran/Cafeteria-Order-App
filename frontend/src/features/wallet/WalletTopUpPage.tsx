import { motion } from "framer-motion";
import { useState } from "react";
import { PageShell } from "../../shared/components/PageShell";
import { apiFetch, ApiError } from "../../shared/lib/api";
import { useAuth } from "../../shared/state/AuthContext";
import type { User } from "../../shared/types/order";

export function WalletTopUpPage() {
  const { token } = useAuth();
  const [email, setEmail] = useState("");
  const [student, setStudent] = useState<User | null>(null);
  const [amount, setAmount] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isBusy, setIsBusy] = useState(false);

  const lookUp = async () => {
    setError(null);
    setSuccess(null);
    setStudent(null);
    setIsBusy(true);
    try {
      const found = await apiFetch<User>(`/wallet/lookup?email=${encodeURIComponent(email.trim())}`, {
        token,
      });
      setStudent(found);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Could not find that student.");
    } finally {
      setIsBusy(false);
    }
  };

  const topUp = async () => {
    if (!student) return;
    const value = Number(amount);
    if (!value || value <= 0) return;

    setError(null);
    setSuccess(null);
    setIsBusy(true);
    try {
      const updated = await apiFetch<User>(`/wallet/${student.id}/topup`, {
        method: "POST",
        token,
        body: { amount: value },
      });
      setStudent(updated);
      setSuccess(`Added Rs. ${value} to ${updated.name}'s wallet.`);
      setAmount("");
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Could not add funds.");
    } finally {
      setIsBusy(false);
    }
  };

  return (
    <PageShell title="Wallet Top-up">
      <div className="flex max-w-md flex-col gap-3">
        <div className="flex gap-2">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && lookUp()}
            placeholder="Student email"
            className="flex-1 rounded-lg border border-[var(--color-dark-charcoal)]/20 p-3"
          />
          <button
            type="button"
            onClick={lookUp}
            disabled={email.trim().length === 0 || isBusy}
            className="rounded-full bg-[var(--color-blush-pink)] px-5 font-medium text-[var(--color-warm-cream)] disabled:cursor-not-allowed disabled:opacity-40"
          >
            Find
          </button>
        </div>

        {error && <p className="text-sm text-red-500">{error}</p>}
        {success && <p className="text-sm text-green-600">{success}</p>}

        {student && (
          <motion.div
            key={student.id + student.walletBalance}
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            className="rounded-2xl border border-[var(--color-blush-pink)] bg-white p-6"
          >
            <p className="font-heading text-lg font-semibold">{student.name}</p>
            <p className="text-sm text-[var(--color-dark-charcoal)]/60">{student.email}</p>
            <p className="mt-2 text-sm">
              Current balance:{" "}
              <span className="font-medium">Rs. {student.walletBalance}</span>
            </p>

            <div className="mt-4 flex gap-2">
              <input
                type="number"
                min={1}
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="Amount to add"
                className="flex-1 rounded-lg border border-[var(--color-dark-charcoal)]/20 p-3"
              />
              <motion.button
                type="button"
                whileTap={{ scale: 0.97 }}
                disabled={!amount || Number(amount) <= 0 || isBusy}
                onClick={topUp}
                className="rounded-full bg-[var(--color-blush-pink)] px-5 font-medium text-[var(--color-warm-cream)] disabled:cursor-not-allowed disabled:opacity-40"
              >
                Add Funds
              </motion.button>
            </div>
          </motion.div>
        )}
      </div>
    </PageShell>
  );
}
