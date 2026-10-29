import { beforeEach, describe, it, expect, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router";
import Signup from "./Signup.jsx";
import { auth } from "../lib/firebase";

const firebaseMocks = vi.hoisted(() => ({
  createUserWithEmailAndPassword: vi.fn(),
  updateProfile: vi.fn(),
  sendEmailVerification: vi.fn(),
}));

vi.mock("firebase/auth", () => ({
  createUserWithEmailAndPassword:
    firebaseMocks.createUserWithEmailAndPassword,
  updateProfile: firebaseMocks.updateProfile,
  sendEmailVerification: firebaseMocks.sendEmailVerification,
}));

vi.mock("../lib/firebase", () => ({
  auth: {},
}));

function renderSignup() {
  return {
    user: userEvent.setup(),
    ...render(
      <MemoryRouter>
        <Signup />
      </MemoryRouter>
    ),
  };
}

async function fillSignupForm(user) {
  await user.type(
    screen.getByPlaceholderText(/profile name/i),
    "Ayush"
  );

  await user.type(
    screen.getByPlaceholderText(/email/i),
    "ayush@example.com"
  );

  await user.type(
    screen.getByPlaceholderText(/password/i),
    "Hello@123"
  );

  await user.click(screen.getByRole("checkbox"));
}

describe("Firebase Signup", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    firebaseMocks.createUserWithEmailAndPassword.mockResolvedValue({
      user: {
        uid: "test-user",
        email: "ayush@example.com",
      },
    });

    firebaseMocks.updateProfile.mockResolvedValue(undefined);
    firebaseMocks.sendEmailVerification.mockResolvedValue(undefined);
  });

  it("creates an account and requests email verification", async () => {
    const { user } = renderSignup();

    await fillSignupForm(user);

    await user.click(
      screen.getByRole("button", {
        name: /create an account/i,
      })
    );

    await waitFor(() => {
      expect(
        firebaseMocks.createUserWithEmailAndPassword
      ).toHaveBeenCalledWith(
        auth,
        "ayush@example.com",
        "Hello@123"
      );
    });

    const createdUser = (
      firebaseMocks.createUserWithEmailAndPassword.mock.results[0].value
    );

    expect(firebaseMocks.updateProfile).toHaveBeenCalledWith(
      (await createdUser).user,
      { displayName: "Ayush" }
    );

    expect(
      firebaseMocks.sendEmailVerification
    ).toHaveBeenCalled();
  });

  it("shows an error when the email is already registered", async () => {
    firebaseMocks.createUserWithEmailAndPassword.mockRejectedValue({
      code: "auth/email-already-in-use",
    });

    const { user } = renderSignup();

    await fillSignupForm(user);

    await user.click(
      screen.getByRole("button", {
        name: /create an account/i,
      })
    );

    expect(
      await screen.findByText(/already registered/i)
    ).toBeInTheDocument();
  });
});