import { formatUsd } from "../data/paymentMilestones";

export type PaymentOptionId =
  | "deposit"
  | "prearrival"
  | "balance"
  | "full"
  | "combined75"
  | "catchup";

export type PaymentOption = {
  id: PaymentOptionId;
  label: string;
  timing: string;
  paymentAmount: number;
  remaining: number;
  isFullyPaid: boolean;
};

export type PaymentScheduleResult = {
  options: PaymentOption[];
  scheduleNote: string;
  daysTillArrival: number;
  totalPaid: number;
  amountOwed: number;
};

function roundMoney(value: number) {
  return Math.round(value * 100) / 100;
}

function approxEqual(a: number, b: number, tolerance = 0.02) {
  return Math.abs(a - b) <= tolerance;
}

export function computeDaysTillArrival(arrivalDate: string): number | null {
  const arrival = new Date(arrivalDate);
  if (Number.isNaN(arrival.getTime())) return null;

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  arrival.setHours(0, 0, 0, 0);

  return Math.round((arrival.getTime() - today.getTime()) / 86400000);
}

export function getPaymentSchedule(
  daysTillArrival: number,
  tourAmount: number,
  totalPaid = 0
): PaymentScheduleResult {
  const amountOwed = roundMoney(Math.max(0, tourAmount - totalPaid));
  const depositAmount = roundMoney(tourAmount * 0.25);
  const prearrivalAmount = roundMoney(tourAmount * 0.5);
  const balanceAmount = roundMoney(tourAmount * 0.25);
  const combined75 = roundMoney(depositAmount + prearrivalAmount);

  if (amountOwed <= 0) {
    return {
      options: [],
      scheduleNote: "This booking is fully paid.",
      daysTillArrival,
      totalPaid,
      amountOwed: 0,
    };
  }

  if (daysTillArrival < 30) {
    return {
      options: [
        {
          id: "full",
          label: "Full Payment Required",
          timing: "Less than 30 days before travel",
          paymentAmount: amountOwed,
          remaining: 0,
          isFullyPaid: true,
        },
      ],
      scheduleNote:
        "Your trip is less than 30 days away. Full payment of the remaining balance is required.",
      daysTillArrival,
      totalPaid,
      amountOwed,
    };
  }

  if (daysTillArrival >= 90) {
    if (approxEqual(totalPaid, 0)) {
      return {
        options: [
          {
            id: "deposit",
            label: "25% Deposit",
            timing: "At time of booking",
            paymentAmount: depositAmount,
            remaining: roundMoney(tourAmount - depositAmount),
            isFullyPaid: false,
          },
          {
            id: "full",
            label: "Pay 100% Balance",
            timing: "Pay full amount now",
            paymentAmount: tourAmount,
            remaining: 0,
            isFullyPaid: true,
          },
        ],
        scheduleNote:
          "You qualify for our 3-step plan: 25% now, 50% at 60 days, and 25% at 30 days before travel.",
        daysTillArrival,
        totalPaid,
        amountOwed,
      };
    }

    if (totalPaid < combined75 - 0.01) {
      if (daysTillArrival <= 60) {
        const paymentAmount =
          totalPaid > 0
            ? roundMoney(prearrivalAmount)
            : prearrivalAmount;

        return {
          options: [
            {
              id: "prearrival",
              label: "50% Pre-Arrival Payment",
              timing: "60 days before travel",
              paymentAmount,
              remaining: roundMoney(tourAmount - totalPaid - paymentAmount),
              isFullyPaid: false,
            },
          ],
          scheduleNote: "Your 50% pre-arrival payment is due now.",
          daysTillArrival,
          totalPaid,
          amountOwed,
        };
      }

      return {
        options: [],
        scheduleNote:
          "Your deposit is recorded. Your next payment of 50% is due 60 days before travel.",
        daysTillArrival,
        totalPaid,
        amountOwed,
      };
    }

    if (totalPaid < tourAmount - 0.01) {
      if (daysTillArrival <= 30) {
        return {
          options: [
            {
              id: "balance",
              label: "25% Final Balance",
              timing: "30 days before travel",
              paymentAmount: amountOwed,
              remaining: 0,
              isFullyPaid: true,
            },
          ],
          scheduleNote: "Your final 25% balance is due now.",
          daysTillArrival,
          totalPaid,
          amountOwed,
        };
      }

      return {
        options: [],
        scheduleNote:
          "Your pre-arrival payment is recorded. The final 25% is due 30 days before travel.",
        daysTillArrival,
        totalPaid,
        amountOwed,
      };
    }
  }

  if (approxEqual(totalPaid, 0)) {
    return {
      options: [
        {
          id: "combined75",
          label: "75% Combined Payment",
          timing: "Deposit + pre-arrival (required now)",
          paymentAmount: combined75,
          remaining: balanceAmount,
          isFullyPaid: false,
        },
        {
          id: "full",
          label: "Pay 100% Balance",
          timing: "Pay full amount now",
          paymentAmount: tourAmount,
          remaining: 0,
          isFullyPaid: true,
        },
      ],
      scheduleNote:
        "Bookings within 90 days of travel require 75% now, with the final 25% due 30 days before travel.",
      daysTillArrival,
      totalPaid,
      amountOwed,
    };
  }

  if (totalPaid >= combined75 - 0.01) {
    if (daysTillArrival <= 30) {
      return {
        options: [
          {
            id: "balance",
            label: "25% Final Balance",
            timing: "30 days before travel",
            paymentAmount: amountOwed,
            remaining: 0,
            isFullyPaid: true,
          },
        ],
        scheduleNote: "Your final 25% balance is due now.",
        daysTillArrival,
        totalPaid,
        amountOwed,
      };
    }

    return {
      options: [],
      scheduleNote:
        "Your 75% payment is recorded. The final 25% is due 30 days before travel.",
      daysTillArrival,
      totalPaid,
      amountOwed,
    };
  }

  const catchupAmount = roundMoney(combined75 - totalPaid);
  return {
    options: [
      {
        id: "catchup",
        label: "Catch-Up Payment",
        timing: "Bring balance to 75% required",
        paymentAmount: catchupAmount,
        remaining: balanceAmount,
        isFullyPaid: false,
      },
    ],
    scheduleNote: `You're within 90 days of travel. ${formatUsd(catchupAmount)} is due now to reach the required 75%.`,
    daysTillArrival,
    totalPaid,
    amountOwed,
  };
}

export function findPaymentOption(
  schedule: PaymentScheduleResult,
  optionId: PaymentOptionId | null
) {
  if (!optionId) return null;
  return schedule.options.find((option) => option.id === optionId) ?? null;
}

export function isValidPaymentOption(
  daysTillArrival: number,
  tourAmount: number,
  totalPaid: number,
  optionId: PaymentOptionId,
  paymentAmount: number
) {
  const schedule = getPaymentSchedule(daysTillArrival, tourAmount, totalPaid);
  const option = findPaymentOption(schedule, optionId);
  if (!option) return false;
  return approxEqual(option.paymentAmount, paymentAmount);
}
