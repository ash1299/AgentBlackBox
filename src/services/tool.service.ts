export type MockOrder = {
  id: string;
  customerId: string;
  total: number;
  status: "PAID" | "SHIPPED" | "DELIVERED";
  refundable: boolean;
};

const mockOrders: MockOrder[] = [
  {
    id: "ORDER-1001",
    customerId: "CUSTOMER-101",
    total: 249.99,
    status: "DELIVERED",
    refundable: true,
  },
  {
    id: "ORDER-1002",
    customerId: "CUSTOMER-102",
    total: 89.5,
    status: "SHIPPED",
    refundable: false,
  },
];

export const readOrder = (
  orderId: string
): MockOrder | undefined => {
  return mockOrders.find(
    (order) => order.id === orderId
  );
};