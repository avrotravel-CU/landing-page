export type PaymentMilestoneId = "deposit" | "prearrival" | "balance" | "full";

export type PaymentMilestone = {
  id: PaymentMilestoneId;
  label: string;
  percent: number;
  timing: string;
};

export const PAYMENT_MILESTONES: PaymentMilestone[] = [
  {
    id: "deposit",
    label: "25% Deposit",
    percent: 0.25,
    timing: "At time of booking",
  },
  {
    id: "prearrival",
    label: "50% Pre-Arrival Payment",
    percent: 0.5,
    timing: "60 days before travel",
  },
  {
    id: "balance",
    label: "25% Balance",
    percent: 0.25,
    timing: "30 days before travel",
  },
  {
    id: "full",
    label: "Pay 100% Balance",
    percent: 1,
    timing: "Pay full amount now",
  },
];

export function formatUsd(amount: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
  }).format(amount);
}

export function getPaymentBreakdown(
  tourAmount: number,
  milestoneId: PaymentMilestoneId
) {
  const milestone = PAYMENT_MILESTONES.find((m) => m.id === milestoneId)!;
  const paymentAmount = tourAmount * milestone.percent;
  const remaining = Math.max(0, tourAmount - paymentAmount);

  return {
    milestone,
    paymentAmount,
    remaining,
    isFullyPaid: milestoneId === "full",
  };
}
