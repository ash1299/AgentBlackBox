# AgentBlackBox Requirements

## Product Goal

AgentBlackBox is a platform for observing, controlling, auditing, and safely replaying actions requested by autonomous AI agents.

The first version will focus on a Customer Support Refund Agent.

---

## Functional Requirements

### FR-1: User Authentication

Users must be able to register, log in, log out, and access protected parts of the application.

### FR-2: Organization Isolation

Application data must belong to an organization.

A user from one organization must not be able to access another organization's agents, sessions, policies, approvals, or audit data.

### FR-3: Agent Registration

Authorized users must be able to register and view AI agents.

Each agent should have basic information such as name, environment, provider/model information, and status.

### FR-4: Agent Sessions

Every agent run must create a session that records which agent ran, when the session started, its current status, and relevant business context.

### FR-5: Event Recording

AgentBlackBox must record observable events such as session starts, tool requests, policy evaluations, approvals, tool results, errors, and session completion.

### FR-6: Tool Gateway

Sensitive tools must not be executed directly by the AI agent.

Tool requests must first pass through the AgentBlackBox tool gateway.

### FR-7: Policy Engine

The system must evaluate deterministic policies before sensitive actions are executed.

For the first refund policy:

- Refund <= $100 → ALLOW
- Refund > $100 and <= $500 → REQUIRE_APPROVAL
- Refund > $500 → BLOCK

### FR-8: Human Approval

Actions requiring approval must create an approval request.

An authorized reviewer must be able to approve or reject the request and optionally provide a comment.

### FR-9: Audit History

Important actions and decisions must generate audit records containing information about what happened, when it happened, and who or what initiated the action.

### FR-10: Safe Replay

The system must support a safe replay MVP that can reproduce recorded agent behavior without repeating dangerous real-world side effects.

---

## Non-Functional Requirements

### NFR-1: Security

Passwords, API keys, authentication tokens, and other secrets must not be stored in plain text or exposed in application logs.

### NFR-2: Tenant Isolation

Organization boundaries must be enforced on the backend, not only hidden in the user interface.

### NFR-3: Auditability

Important security and business decisions should leave a clear historical record for later investigation.

### NFR-4: Maintainability

The backend should begin as a well-structured modular monolith with clear separation of responsibilities.

### NFR-5: Reliability

Failures should produce meaningful error information and should not silently execute sensitive actions.

### NFR-6: Observability

The system should eventually provide structured logs, request/session identifiers, health checks, latency information, and useful error reporting.

### NFR-7: Performance

The system should respond efficiently for the expected development/demo workload.

Performance claims must be based on real measurements rather than invented scale numbers.

### NFR-8: Cost Awareness

Development and cloud infrastructure should avoid unnecessary paid services and excessive resource usage.

---

## Version 1 Scope

Version 1 will focus on one realistic Customer Support Refund Agent and a limited set of safe/mock tools.

The architecture should allow future expansion without attempting to support every AI agent or business workflow immediately.

---

## Out of Scope for Initial Version

The initial version will not require Kubernetes, Kafka, a microservices architecture, a universal policy language, real payment processing, or large-scale distributed event streaming.