import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router";
import { setPersistence, signInWithEmailAndPassword } from "firebase/auth";
import Login from "./Login.jsx";

vi.mock("firebase/auth", () => ({
  browserLocalPersistence: { type: "LOCAL" },
  browserSessionPersistence: { type: "SESSION" },
  setPersistence: vi.fn().mockResolvedValue(undefined),
  signInWithEmailAndPassword: vi.fn().mockResolvedValue({ user: { displayName: "Ayush" } }),
}));

vi.mock("../lib/firebase", () => ({
  auth: {},
}));

function renderLogin() {
  const user = userEvent.setup();

  render(
    <MemoryRouter>
      <Login />
    </MemoryRouter>
  );

  return user;
}

describe("Login form validation", () => {
  it("signs in with Firebase using the selected persistence", async () => {
    const user = renderLogin();

    await user.type(screen.getByRole("textbox"), "ayush@example.com");
    await user.type(screen.getByLabelText("Password"), "password123");
    await user.click(screen.getByRole("checkbox"));
    await user.click(screen.getByRole("button", { name: "Log in" }));

    expect(setPersistence).toHaveBeenCalledWith({}, { type: "LOCAL" });
    expect(signInWithEmailAndPassword).toHaveBeenCalledWith(
      {},
      "ayush@example.com",
      "password123"
    );
    expect(
      await screen.findByText("Welcome back, Ayush! Login successful.")
    ).toBeInTheDocument();
  });

  it("shows errors when the form is empty", async () => {
    const user = renderLogin();

    await user.click(screen.getByRole("button", { name: "Log in" }));

    expect(
      screen.getByText("Enter your email address or username.")
    ).toBeInTheDocument();
    expect(
      screen.getByText("Please enter your password.")
    ).toBeInTheDocument();
  });

  it("rejects username login because Firebase email/password auth requires an email", async () => {
    const user = renderLogin();

    await user.type(screen.getByRole("textbox"), "ayush");
    await user.type(screen.getByLabelText("Password"), "password123");
    await user.click(screen.getByRole("button", { name: "Log in" }));

    expect(
      screen.getByText("Enter a valid email address. Username login is not configured yet.")
    ).toBeInTheDocument();
    expect(signInWithEmailAndPassword).not.toHaveBeenCalled();
  });

  it("rejects an invalid email address", async () => {
    const user = renderLogin();

    await user.type(screen.getByRole("textbox"), "ayush@invalid");
    await user.type(screen.getByLabelText("Password"), "password123");
    await user.click(screen.getByRole("button", { name: "Log in" }));

    expect(
      screen.getByText("Enter a valid email address. Username login is not configured yet.")
    ).toBeInTheDocument();
  });
});
