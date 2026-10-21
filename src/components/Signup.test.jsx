import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router";
import Signup from "./Signup.jsx";

function renderSignup() {
  const user = userEvent.setup();

  render(
    <MemoryRouter>
      <Signup />
    </MemoryRouter>
  );

  return user;
}

describe("Signup form validation", () => {
  it("shows errors when the form is empty", async () => {
    const user = renderSignup();

    await user.click(
      screen.getByRole("button", {
        name: /create an account/i,
      })
    );

    expect(
      screen.getByText("Please enter your name.")
    ).toBeInTheDocument();

    expect(
      screen.getByText("Please enter a valid email address.")
    ).toBeInTheDocument();

    expect(
      screen.getByText(
        "Use at least 8 characters with a letter, number, and symbol."
      )
    ).toBeInTheDocument();

    expect(
      screen.getByText("Please accept the terms.")
    ).toBeInTheDocument();
  });

  it("rejects an invalid email", async () => {
    const user = renderSignup();

    await user.type(
      screen.getByPlaceholderText("Enter your profile name"),
      "Ayush"
    );

    await user.type(
      screen.getByPlaceholderText("Enter your email address"),
      "ayush@invalid"
    );

    await user.type(
      screen.getByPlaceholderText("Enter your password"),
      "Hello@123"
    );

    await user.click(screen.getByRole("checkbox"));

    await user.click(
      screen.getByRole("button", {
        name: /create an account/i,
      })
    );

    expect(
      screen.getByText("Please enter a valid email address.")
    ).toBeInTheDocument();
  });

  it("accepts valid input", async () => {
    const user = renderSignup();

    await user.type(
      screen.getByPlaceholderText("Enter your profile name"),
      "Ayush"
    );

    await user.type(
      screen.getByPlaceholderText("Enter your email address"),
      "ayush@example.com"
    );

    await user.type(
      screen.getByPlaceholderText("Enter your password"),
      "Hello@123"
    );

    await user.click(screen.getByRole("checkbox"));

    await user.click(
      screen.getByRole("button", {
        name: /create an account/i,
      })
    );

    expect(
      screen.getByText(
        "Validation passed! Authentication is not connected yet."
      )
    ).toBeInTheDocument();
  });
});