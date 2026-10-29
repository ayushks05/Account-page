import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter, Routes, Route } from "react-router";

import ProtectedRoute from "./ProtectedRoute";
import { useAuth } from "../context/AuthContext";

vi.mock("../context/AuthContext", () => ({
  useAuth: vi.fn(),
}));

function renderProtectedRoute() {
  return render(
    <MemoryRouter initialEntries={["/dashboard"]}>
      <Routes>
        <Route path="/login" element={<p>Login page</p>} />

        <Route path="/verify-email" element={<p>Verify email page</p>} />

        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<p>Dashboard page</p>} />
        </Route>
      </Routes>
    </MemoryRouter>,
  );
}

describe("ProtectedRoute", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("shows loading while checking authentication", () => {
    useAuth.mockReturnValue({
      user: null,
      loading: true,
    });

    renderProtectedRoute();

    expect(screen.getByText("Checking authentication...")).toBeInTheDocument();
  });

  it("redirects signed-out users to login", () => {
    useAuth.mockReturnValue({
      user: null,
      loading: false,
    });

    renderProtectedRoute();

    expect(screen.getByText("Login page")).toBeInTheDocument();
  });

  it("redirects unverified email users to verification", () => {
    useAuth.mockReturnValue({
      user: {
        email: "ayush@example.com",
        emailVerified: false,
        providerData: [{ providerId: "password" }],
      },
      loading: false,
    });

    renderProtectedRoute();

    expect(screen.getByText("Verify email page")).toBeInTheDocument();
  });

  it("allows verified users to access the dashboard", () => {
    useAuth.mockReturnValue({
      user: {
        email: "ayush@example.com",
        emailVerified: true,
        providerData: [{ providerId: "password" }],
      },
      loading: false,
    });

    renderProtectedRoute();

    expect(screen.getByText("Dashboard page")).toBeInTheDocument();
  });
});
