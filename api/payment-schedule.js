function roundMoney(value) {
  return Math.round(Number(value) * 100) / 100;
}

function approxEqual(a, b, tolerance = 0.02) {
  return Math.abs(a - b) <= tolerance;
}

function getPaymentSchedule(daysTillArrival, tourAmount, totalPaid = 0) {
  const amountOwed = roundMoney(Math.max(0, tourAmount - totalPaid));
  const depositAmount = roundMoney(tourAmount * 0.25);
  const prearrivalAmount = roundMoney(tourAmount * 0.5);
  const balanceAmount = roundMoney(tourAmount * 0.25);
  const combined75 = roundMoney(depositAmount + prearrivalAmount);

  if (amountOwed <= 0) {
    return { options: [], scheduleNote: "This booking is fully paid.", amountOwed: 0 };
  }

  if (daysTillArrival < 30) {
    return {
      options: [
        {
          id: "full",
          label: "Full Payment Required",
          paymentAmount: amountOwed,
        },
      ],
      scheduleNote: "Full payment required.",
      amountOwed,
    };
  }

  if (daysTillArrival >= 90) {
    if (approxEqual(totalPaid, 0)) {
      return {
        options: [
          { id: "deposit", label: "25% Deposit", paymentAmount: depositAmount },
          { id: "full", label: "Pay 100% Balance", paymentAmount: tourAmount },
        ],
        scheduleNote: "Installment plan available.",
        amountOwed,
      };
    }

    if (totalPaid < combined75 - 0.01) {
      if (daysTillArrival <= 60) {
        return {
          options: [
            {
              id: "prearrival",
              label: "50% Pre-Arrival Payment",
              paymentAmount: prearrivalAmount,
            },
          ],
          scheduleNote: "Pre-arrival payment due.",
          amountOwed,
        };
      }

      return { options: [], scheduleNote: "Deposit recorded.", amountOwed };
    }

    if (totalPaid < tourAmount - 0.01 && daysTillArrival <= 30) {
      return {
        options: [
          {
            id: "balance",
            label: "25% Final Balance",
            paymentAmount: amountOwed,
          },
        ],
        scheduleNote: "Final balance due.",
        amountOwed,
      };
    }

    return { options: [], scheduleNote: "No payment due yet.", amountOwed };
  }

  if (approxEqual(totalPaid, 0)) {
    return {
      options: [
        {
          id: "combined75",
          label: "75% Combined Payment",
          paymentAmount: combined75,
        },
        { id: "full", label: "Pay 100% Balance", paymentAmount: tourAmount },
      ],
      scheduleNote: "75% required now.",
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
            paymentAmount: amountOwed,
          },
        ],
        scheduleNote: "Final balance due.",
        amountOwed,
      };
    }

    return { options: [], scheduleNote: "Final payment due later.", amountOwed };
  }

  return {
    options: [
      {
        id: "catchup",
        label: "Catch-Up Payment",
        paymentAmount: roundMoney(combined75 - totalPaid),
      },
    ],
    scheduleNote: "Catch-up payment required.",
    amountOwed,
  };
}

function findPaymentOption(schedule, optionId) {
  if (!optionId) return null;
  return schedule.options.find((option) => option.id === optionId) ?? null;
}

function isValidPaymentOption(
  daysTillArrival,
  tourAmount,
  totalPaid,
  optionId,
  paymentAmount
) {
  const schedule = getPaymentSchedule(daysTillArrival, tourAmount, totalPaid);
  const option = findPaymentOption(schedule, optionId);
  if (!option) return false;
  return approxEqual(option.paymentAmount, paymentAmount);
}

module.exports = {
  getPaymentSchedule,
  findPaymentOption,
  isValidPaymentOption,
};
