import type { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../state/AuthContext";
import type { Role } from "../types/order";
import { PageShell } from "./PageShell";

interface ProtectedRouteProps {
  roles: Role[];
  children: ReactNode;
}

export function ProtectedRoute({ roles, children }: ProtectedRouteProps) {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return null;
  }

  if (!user) {
    return <Navigate to="/" replace />;
  }

  if (!roles.includes(user.role)) {
    return (
      <PageShell title="Unauthorized">
        <p className="font-body text-sm text-[var(--color-dark-charcoal)]/70">
          Your account does not have access to this page.
        </p>
      </PageShell>
    );
  }

  return <>{children}</>;
}
