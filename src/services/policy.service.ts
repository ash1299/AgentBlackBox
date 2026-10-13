export type PolicyDecision =
  | "ALLOW"
  | "REQUIRE_APPROVAL"
  | "BLOCK";

export type RiskLevel =
  | "LOW"
  | "MEDIUM"
  | "HIGH"
  | "CRITICAL";

export type PolicyResult = {
  decision: PolicyDecision;
  riskLevel: RiskLevel;
  reason: string;
};

export const evaluateToolPolicy = (
  tool: string,
  _input: Record<string, unknown>
): PolicyResult => {
  if (tool === "read_order") {
    return {
      decision: "ALLOW",
      riskLevel: "LOW",
      reason: "Reading order information is a low-risk read-only action.",
    };
  }

  return {
    decision: "BLOCK",
    riskLevel: "HIGH",
    reason: "No policy exists for this tool.",
  };
};