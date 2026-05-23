import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { StatCards } from "@/components/dashboard/stat-cards";
import { RoleBadge } from "@/components/users/role-badge";

describe("StatCards", () => {
  it("renders totals, average age and gender split", () => {
    render(
      <StatCards
        stats={{
          total: 208,
          byRole: { admin: 12, moderator: 8, user: 188 },
          byGender: { female: 100, male: 108 },
          averageAge: 34,
        }}
      />,
    );

    expect(screen.getByText("Total users")).toBeInTheDocument();
    // Numbers render via an animated CSS counter; the value is on aria-label.
    expect(screen.getByLabelText("208")).toBeInTheDocument();
    expect(screen.getByLabelText("34")).toBeInTheDocument();
    expect(screen.getByLabelText("100")).toBeInTheDocument();
    expect(screen.getByLabelText("108")).toBeInTheDocument();
  });
});

describe("RoleBadge", () => {
  it("renders the capitalised role", () => {
    render(<RoleBadge role="admin" />);
    expect(screen.getByText("Admin")).toBeInTheDocument();
  });
});
