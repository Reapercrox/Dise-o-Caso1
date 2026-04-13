import { can } from "@/security/rbac/accessGuard";

describe("RBAC", () => {
  it("allows USER_AGENT to generate DUA", () => {
    expect(can("USER_AGENT", "GENERATE_DUA")).toBe(true);
  });
});
