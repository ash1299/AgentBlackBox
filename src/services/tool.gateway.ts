import {
  recordEvent,
} from "./event.service";

import {
  readOrder,
} from "./tool.service";

export type ToolExecutionResult =
  | {
      success: true;
      tool: string;
      result: unknown;
    }
  | {
      success: false;
      tool: string;
      error:
        | "INVALID_INPUT"
        | "ORDER_NOT_FOUND"
        | "UNSUPPORTED_TOOL";
    };

export const executeTool = (
  sessionId: string,
  tool: string,
  input: Record<string, unknown>
): ToolExecutionResult => {
  recordEvent(
    sessionId,
    "TOOL_REQUESTED",
    {
      tool,
      input,
    }
  );

  if (tool === "read_order") {
    const orderId = input.orderId;

    if (typeof orderId !== "string") {
      recordEvent(
        sessionId,
        "TOOL_FAILED",
        {
          tool,
          reason: "INVALID_INPUT",
        }
      );

      return {
        success: false,
        tool,
        error: "INVALID_INPUT",
      };
    }

    const order = readOrder(orderId);

    if (!order) {
      recordEvent(
        sessionId,
        "TOOL_FAILED",
        {
          tool,
          orderId,
          reason: "ORDER_NOT_FOUND",
        }
      );

      return {
        success: false,
        tool,
        error: "ORDER_NOT_FOUND",
      };
    }

    recordEvent(
      sessionId,
      "TOOL_EXECUTED",
      {
        tool,
        orderId,
        result: {
          status: order.status,
          total: order.total,
          refundable: order.refundable,
        },
      }
    );

    return {
      success: true,
      tool,
      result: order,
    };
  }

  recordEvent(
    sessionId,
    "TOOL_FAILED",
    {
      tool,
      reason: "UNSUPPORTED_TOOL",
    }
  );

  return {
    success: false,
    tool,
    error: "UNSUPPORTED_TOOL",
  };
};