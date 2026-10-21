import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router";
import Login from "./Login.jsx";

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

  it("accepts a valid email and password", async () => {
    const user = renderLogin();

    await user.type(screen.getByRole("textbox"), "ayush@example.com");
    await user.type(screen.getByLabelText("Password"), "password123");
    await user.click(screen.getByRole("button", { name: "Log in" }));

    expect(
      screen.getByText(
        "Validation passed! Authentication is not connected yet."
      )
    ).toBeInTheDocument();
  });

  it("accepts a username and password", async () => {
    const user = renderLogin();

    await user.type(screen.getByRole("textbox"), "ayush");
    await user.type(screen.getByLabelText("Password"), "password123");
    await user.click(screen.getByRole("button", { name: "Log in" }));

    expect(
      screen.getByText(
        "Validation passed! Authentication is not connected yet."
      )
    ).toBeInTheDocument();
  });

  it("rejects an invalid email address", async () => {
    const user = renderLogin();

    await user.type(screen.getByRole("textbox"), "ayush@invalid");
    await user.type(screen.getByLabelText("Password"), "password123");
    await user.click(screen.getByRole("button", { name: "Log in" }));

    expect(screen.getByText("Enter a valid email address.")).toBeInTheDocument();
  });
});
