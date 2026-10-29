import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router";

import ForgotPassword from "./ForgotPassword.jsx";

const firebaseMocks = vi.hoisted(() => ({
  sendPasswordResetEmail: vi.fn(),
}));

vi.mock("firebase/auth", () => ({
  sendPasswordResetEmail: firebaseMocks.sendPasswordResetEmail,
}));

vi.mock("../lib/firebase", () => ({
  auth: {},
}));

function renderForgotPassword() {
  return render(
    <MemoryRouter>
      <ForgotPassword />
    </MemoryRouter>,
  );
}

describe("ForgotPassword", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    firebaseMocks.sendPasswordResetEmail.mockResolvedValue(undefined);
  });

  it("shows an error for an invalid email", async () => {
    const user = userEvent.setup();

    renderForgotPassword();

    await user.type(screen.getByLabelText(/email address/i), "invalid-email");

    await user.click(screen.getByRole("button", { name: /send reset link/i }));

    expect(
      screen.getByText("Please enter a valid email address."),
    ).toBeInTheDocument();

    expect(firebaseMocks.sendPasswordResetEmail).not.toHaveBeenCalled();
  });

  it("requests a password reset for a valid email", async () => {
    const user = userEvent.setup();

    renderForgotPassword();

    await user.type(
      screen.getByLabelText(/email address/i),
      "ayush@example.com",
    );

    await user.click(screen.getByRole("button", { name: /send reset link/i }));

    await waitFor(() => {
      expect(firebaseMocks.sendPasswordResetEmail).toHaveBeenCalledWith(
        {},
        "ayush@example.com",
      );
    });

    expect(await screen.findByRole("status")).toHaveTextContent(
      /check your inbox/i,
    );
  });

  it("handles Firebase errors", async () => {
    const user = userEvent.setup();

    firebaseMocks.sendPasswordResetEmail.mockRejectedValue({
      code: "auth/too-many-requests",
    });

    renderForgotPassword();

    await user.type(
      screen.getByLabelText(/email address/i),
      "ayush@example.com",
    );

    await user.click(screen.getByRole("button", { name: /send reset link/i }));

    expect(await screen.findByRole("alert")).toHaveTextContent(
      /too many requests/i,
    );
  });
});
