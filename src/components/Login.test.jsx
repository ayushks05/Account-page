import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Routes, Route } from "react-router";

import Login from "./Login.jsx";
import { auth } from "../lib/firebase";

const firebaseMocks = vi.hoisted(() => ({
  signInWithEmailAndPassword: vi.fn(),
  setPersistence: vi.fn(),
  browserLocalPersistence: { name: "local" },
  browserSessionPersistence: { name: "session" },
}));

vi.mock("firebase/auth", () => ({
  signInWithEmailAndPassword:
    firebaseMocks.signInWithEmailAndPassword,
  setPersistence: firebaseMocks.setPersistence,
  browserLocalPersistence: firebaseMocks.browserLocalPersistence,
  browserSessionPersistence: firebaseMocks.browserSessionPersistence,
}));

vi.mock("../lib/firebase", () => ({
  auth: {},
}));

function renderLogin() {
  return {
    user: userEvent.setup(),
    ...render(
      <MemoryRouter initialEntries={["/login"]}>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route
            path="/dashboard"
            element={<p>Dashboard page</p>}
          />
        </Routes>
      </MemoryRouter>
    ),
  };
}

async function fillLoginForm(user) {
  await user.type(
    screen.getByLabelText(/email address or user name/i),
    "ayush@example.com"
  );

  await user.type(
    screen.getByLabelText("Password"),
    "Hello@123"
  );
}

describe("Firebase Login", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    firebaseMocks.setPersistence.mockResolvedValue(undefined);

    firebaseMocks.signInWithEmailAndPassword.mockResolvedValue({
      user: {
        uid: "test-user",
        email: "ayush@example.com",
      },
    });
  });

  it("signs in and navigates to the dashboard", async () => {
    const { user } = renderLogin();

    await fillLoginForm(user);

    // Enable Remember me.
    await user.click(screen.getByRole("checkbox"));

    await user.click(
      screen.getByRole("button", { name: /log in/i })
    );

    await waitFor(() => {
      expect(
        firebaseMocks.setPersistence
      ).toHaveBeenCalledWith(
        auth,
        firebaseMocks.browserLocalPersistence
      );

      expect(
        firebaseMocks.signInWithEmailAndPassword
      ).toHaveBeenCalledWith(
        auth,
        "ayush@example.com",
        "Hello@123"
      );

      expect(
        screen.getByText("Dashboard page")
      ).toBeInTheDocument();
    });
  });

  it("displays an error when login fails", async () => {
    firebaseMocks.signInWithEmailAndPassword.mockRejectedValue({
      code: "auth/invalid-credential",
    });

    const { user } = renderLogin();

    await fillLoginForm(user);

    await user.click(
      screen.getByRole("button", { name: /log in/i })
    );

    expect(
      await screen.findByText(/incorrect email or password/i)
    ).toBeInTheDocument();
  });
});