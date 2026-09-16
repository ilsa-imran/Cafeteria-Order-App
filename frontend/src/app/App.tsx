import { AnimatePresence } from "framer-motion";
import { NavLink, Route, Routes, useLocation, useNavigate } from "react-router-dom";
import { LoginPage } from "../features/auth/LoginPage";
import { CartPage } from "../features/cart/CartPage";
import { KitchenDashboardPage } from "../features/kitchen-dashboard/KitchenDashboardPage";
import { FoodItemDetailsPage } from "../features/menu/FoodItemDetailsPage";
import { MenuPage } from "../features/menu/MenuPage";
import { MenuManagementPage } from "../features/menu-management/MenuManagementPage";
import { OrderConfirmationPage } from "../features/order-confirmation/OrderConfirmationPage";
import { OrderHistoryPage } from "../features/order-history/OrderHistoryPage";
import { OrderTrackingPage } from "../features/order-tracking/OrderTrackingPage";
import { PickupTimePage } from "../features/pickup/PickupTimePage";
import { PickupVerificationPage } from "../features/pickup-verification/PickupVerificationPage";
import { CreateStaffAccountPage } from "../features/staff-accounts/CreateStaffAccountPage";
import { WalletTopUpPage } from "../features/wallet/WalletTopUpPage";
import { ProtectedRoute } from "../shared/components/ProtectedRoute";
import { ReadyNotificationBanner } from "../shared/components/ReadyNotificationBanner";
import { useAuth } from "../shared/state/AuthContext";

const STUDENT_NAV_LINKS = [
  { to: "/menu", label: "Menu" },
  { to: "/cart", label: "Cart" },
  { to: "/pickup", label: "Pickup" },
  { to: "/tracking", label: "Tracking" },
  { to: "/orders", label: "Order History" },
];

const STAFF_NAV_LINKS = [
  { to: "/kitchen", label: "Kitchen" },
  { to: "/menu-management", label: "Menu Mgmt" },
  { to: "/pickup-verification", label: "Verify Pickup" },
  { to: "/wallet-topup", label: "Wallet Top-up" },
];

const ADMIN_ONLY_NAV_LINKS = [{ to: "/staff-accounts/new", label: "Create Staff Account" }];

export function App() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const navLinks = user
    ? user.role === "STUDENT"
      ? STUDENT_NAV_LINKS
      : user.role === "ADMIN"
        ? [...STAFF_NAV_LINKS, ...ADMIN_ONLY_NAV_LINKS]
        : STAFF_NAV_LINKS
    : [];

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div className="min-h-svh bg-[var(--color-warm-cream)]">
      <ReadyNotificationBanner />
      <nav className="flex h-16 items-center justify-between gap-1 overflow-x-auto border-b border-[var(--color-blush-pink)]/50 px-4">
        <div className="flex items-center gap-1">
          {navLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                `font-heading whitespace-nowrap rounded-full px-3 py-1.5 text-sm ${
                  isActive
                    ? "bg-[var(--color-blush-pink)] text-[var(--color-warm-cream)]"
                    : "text-[var(--color-dark-charcoal)]/70"
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </div>

        {user && (
          <div className="flex items-center gap-3 whitespace-nowrap">
            {user.role === "STUDENT" && (
              <span className="rounded-full bg-[var(--color-warm-cream)] px-3 py-1 text-sm font-medium text-[var(--color-dark-charcoal)]">
                Wallet: Rs. {user.walletBalance}
              </span>
            )}
            <span className="text-sm text-[var(--color-dark-charcoal)]/70">
              {user.name} ({user.role})
            </span>
            <button
              type="button"
              onClick={handleLogout}
              className="rounded-full border border-[var(--color-dark-charcoal)]/20 px-3 py-1.5 text-sm"
            >
              Log out
            </button>
          </div>
        )}
      </nav>

      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<LoginPage />} />

          <Route
            path="/menu"
            element={
              <ProtectedRoute roles={["STUDENT"]}>
                <MenuPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/menu/:itemId"
            element={
              <ProtectedRoute roles={["STUDENT"]}>
                <FoodItemDetailsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/cart"
            element={
              <ProtectedRoute roles={["STUDENT"]}>
                <CartPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/pickup"
            element={
              <ProtectedRoute roles={["STUDENT"]}>
                <PickupTimePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/confirmation"
            element={
              <ProtectedRoute roles={["STUDENT"]}>
                <OrderConfirmationPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/tracking"
            element={
              <ProtectedRoute roles={["STUDENT"]}>
                <OrderTrackingPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/tracking/:orderId"
            element={
              <ProtectedRoute roles={["STUDENT"]}>
                <OrderTrackingPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/orders"
            element={
              <ProtectedRoute roles={["STUDENT"]}>
                <OrderHistoryPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/kitchen"
            element={
              <ProtectedRoute roles={["STAFF", "ADMIN"]}>
                <KitchenDashboardPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/menu-management"
            element={
              <ProtectedRoute roles={["STAFF", "ADMIN"]}>
                <MenuManagementPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/pickup-verification"
            element={
              <ProtectedRoute roles={["STAFF", "ADMIN"]}>
                <PickupVerificationPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/staff-accounts/new"
            element={
              <ProtectedRoute roles={["ADMIN"]}>
                <CreateStaffAccountPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/wallet-topup"
            element={
              <ProtectedRoute roles={["STAFF", "ADMIN"]}>
                <WalletTopUpPage />
              </ProtectedRoute>
            }
          />
        </Routes>
      </AnimatePresence>
    </div>
  );
}
