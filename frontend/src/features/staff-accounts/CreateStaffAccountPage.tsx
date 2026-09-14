import { motion } from "framer-motion";
import { useState } from "react";
import { PageShell } from "../../shared/components/PageShell";
import { apiFetch, ApiError } from "../../shared/lib/api";
import { useAuth } from "../../shared/state/AuthContext";
import type { Role } from "../../shared/types/order";

type StaffRole = Extract<Role, "STAFF" | "ADMIN">;

export function CreateStaffAccountPage() {
  const { token } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<StaffRole>("STAFF");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const canSubmit =
    name.trim().length > 0 && email.trim().length > 0 && password.length >= 8;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;

    setError(null);
    setSuccess(null);
    setIsSubmitting(true);

    try {
      const created = await apiFetch<{ email: string; role: string }>("/auth/staff", {
        method: "POST",
        token,
        body: { name, email, password, role },
      });
      setSuccess(`Created ${created.role} account for ${created.email}.`);
      setName("");
      setEmail("");
      setPassword("");
      setRole("STAFF");
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Could not create the account.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <PageShell title="Create Staff Account">
      <form onSubmit={handleSubmit} className="flex max-w-md flex-col gap-3">
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Full name"
          className="rounded-lg border border-[var(--color-dark-charcoal)]/20 p-3"
        />
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          className="rounded-lg border border-[var(--color-dark-charcoal)]/20 p-3"
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Temporary password (min 8 characters)"
          className="rounded-lg border border-[var(--color-dark-charcoal)]/20 p-3"
        />

        <div className="flex rounded-full border border-[var(--color-blush-pink)] bg-white p-1">
          {(["STAFF", "ADMIN"] as StaffRole[]).map((r) => (
            <button
              key={r}
              type="button"
              onClick={() => setRole(r)}
              className={`relative flex-1 rounded-full py-2 text-sm font-medium ${
                role === r ? "bg-[var(--color-blush-pink)]" : ""
              }`}
            >
              {r === "STAFF" ? "Staff" : "Admin"}
            </button>
          ))}
        </div>

        {error && <p className="text-sm text-red-500">{error}</p>}
        {success && <p className="text-sm text-green-600">{success}</p>}

        <motion.button
          type="submit"
          disabled={!canSubmit || isSubmitting}
          whileTap={{ scale: 0.97 }}
          className="mt-2 rounded-full bg-[var(--color-blush-pink)] py-3 font-medium disabled:cursor-not-allowed disabled:opacity-40"
        >
          {isSubmitting ? "Creating..." : "Create Account"}
        </motion.button>
      </form>
    </PageShell>
  );
}
