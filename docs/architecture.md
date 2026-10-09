# AgentBlackBox Architecture

## Version 1 Architecture

AgentBlackBox will begin as a modular monolith.

The first version will focus on one Customer Support Refund Agent and a small set of safe/mock tools.

## High-Level Flow

```text
User / Customer
      |
      v
Customer Support AI Agent
      |
      | requests a tool action
      v
AgentBlackBox Tool Gateway
      |
      v
Policy Engine
      |
      +------------------------+
      |            |           |
      v            v           v
    ALLOW     REQUIRE_APPROVAL BLOCK
      |            |           
      |            v
      |      Human Reviewer
      |            |
      |       Approve / Reject
      |            |
      +------------+
            |
            v
       Tool Executor
            |
            v
       Event Recorder
            |
            v
        PostgreSQL
            |
            v
       REST API
            |
            v
     React Dashboard