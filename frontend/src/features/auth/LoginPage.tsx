import { motion } from "framer-motion";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { PageShell } from "../../shared/components/PageShell";
import { PasswordInput } from "../../shared/components/PasswordInput";
import { ApiError } from "../../shared/lib/api";
import { PASSWORD_HINT, validatePassword } from "../../shared/lib/passwordStrength";
import { useAuth } from "../../shared/state/AuthContext";

type Mode = "signin" | "register";

export function LoginPage() {
  const [mode, setMode] = useState<Mode>("signin");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { login, register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (mode === "register") {
      const passwordError = validatePassword(password);
      if (passwordError) {
        setError(passwordError);
        return;
      }
    }

    setIsSubmitting(true);

    try {
      if (mode === "signin") {
        const user = await login(email, password);
        navigate(user.role === "STUDENT" ? "/menu" : "/kitchen");
      } else {
        await register(name, email, password);
        const user = await login(email, password);
        navigate(user.role === "STUDENT" ? "/menu" : "/kitchen");
      }
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Something went wrong");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <PageShell title={mode === "signin" ? "Sign In" : "Create Account"}>
      <div className="relative flex rounded-full border border-[var(--color-blush-pink)] bg-white p-1">
        {(["signin", "register"] as Mode[]).map((m) => (
          <button
            key={m}
            type="button"
            onClick={() => {
              setMode(m);
              setError(null);
            }}
            className={`relative z-10 flex-1 rounded-full py-2 text-sm font-medium ${
              mode === m ? "text-[var(--color-warm-cream)]" : ""
            }`}
          >
            {mode === m && (
              <motion.div
                layoutId="mode-pill"
                className="absolute inset-0 -z-10 rounded-full bg-[var(--color-blush-pink)]"
                transition={{ type: "spring", bounce: 0.2, duration: 0.4 }}
              />
            )}
            {m === "signin" ? "Sign In" : "Create Account"}
          </button>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-3">
        {mode === "register" && (
          <input
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Full name"
            className="rounded-lg border border-[var(--color-dark-charcoal)]/20 p-3"
          />
        )}
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          className="rounded-lg border border-[var(--color-dark-charcoal)]/20 p-3"
        />
        <PasswordInput
          required
          minLength={mode === "register" ? 8 : undefined}
          value={password}
          onChange={setPassword}
          placeholder="Password"
        />
        {mode === "register" && !error && (
          <p className="text-xs text-[var(--color-dark-charcoal)]/60">{PASSWORD_HINT}</p>
        )}

        {error && <p className="text-sm text-red-500">{error}</p>}

        <motion.button
          type="submit"
          disabled={isSubmitting}
          whileTap={{ scale: 0.97 }}
          className="mt-2 rounded-full bg-[var(--color-blush-pink)] py-3 font-medium text-[var(--color-warm-cream)] disabled:cursor-not-allowed disabled:opacity-40"
        >
          {isSubmitting
            ? "Please wait..."
            : mode === "signin"
              ? "Sign In"
              : "Create Account"}
        </motion.button>
      </form>

      {mode === "register" && (
        <p className="mt-3 text-xs text-[var(--color-dark-charcoal)]/60">
          New accounts are created as students. Staff accounts are set up by
          the cafeteria administrator.
        </p>
      )}
    </PageShell>
  );
}
