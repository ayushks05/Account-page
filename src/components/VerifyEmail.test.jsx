import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Routes, Route } from "react-router";

import VerifyEmail from "./VerifyEmail.jsx";
import { useAuth } from "../context/AuthContext";
import { reload, sendEmailVerification } from "firebase/auth";

vi.mock("../context/AuthContext", () => ({
  useAuth: vi.fn(),
}));

vi.mock("firebase/auth", () => ({
  reload: vi.fn(),
  sendEmailVerification: vi.fn(),
}));

const mockUser = {
  uid: "test-user",
  email: "ayush@example.com",
  emailVerified: false,
  providerData: [{ providerId: "password" }],
};

function renderVerifyEmail() {
  return render(
    <MemoryRouter initialEntries={["/verify-email"]}>
      <Routes>
        <Route path="/verify-email" element={<VerifyEmail />} />

        <Route path="/dashboard" element={<p>Dashboard page</p>} />

        <Route path="/login" element={<p>Login page</p>} />
      </Routes>
    </MemoryRouter>,
  );
}

describe("VerifyEmail", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockUser.emailVerified = false;

    useAuth.mockReturnValue({
      user: mockUser,
      loading: false,
    });

    sendEmailVerification.mockResolvedValue(undefined);
    reload.mockResolvedValue(undefined);
  });

  it("displays the user's email and verification actions", () => {
    renderVerifyEmail();

    expect(screen.getByText("ayush@example.com")).toBeInTheDocument();

    expect(
      screen.getByRole("button", {
        name: /resend verification email/i,
      }),
    ).toBeInTheDocument();

    expect(
      screen.getByRole("button", {
        name: /i've verified my email/i,
      }),
    ).toBeInTheDocument();
  });

  it("resends the verification email", async () => {
    const user = userEvent.setup();

    renderVerifyEmail();

    await user.click(
      screen.getByRole("button", {
        name: /resend verification email/i,
      }),
    );

    expect(sendEmailVerification).toHaveBeenCalledWith(mockUser);

    expect(await screen.findByRole("status")).toHaveTextContent(
      /verification email sent/i,
    );
  });

  it("opens the dashboard when email verification is confirmed", async () => {
    const user = userEvent.setup();

    reload.mockImplementation(async (user) => {
      user.emailVerified = true;
    });

    renderVerifyEmail();

    await user.click(
      screen.getByRole("button", {
        name: /i've verified my email/i,
      }),
    );

    expect(await screen.findByText("Dashboard page")).toBeInTheDocument();

    expect(reload).toHaveBeenCalledWith(mockUser);
  });

  it("shows a message when the email is still unverified", async () => {
    const user = userEvent.setup();

    renderVerifyEmail();

    await user.click(
      screen.getByRole("button", {
        name: /i've verified my email/i,
      }),
    );

    expect(await screen.findByRole("status")).toHaveTextContent(
      /not verified yet/i,
    );
  });

  it("redirects a signed-out user to login", () => {
    useAuth.mockReturnValue({
      user: null,
      loading: false,
    });

    renderVerifyEmail();

    expect(screen.getByText("Login page")).toBeInTheDocument();
  });
});
