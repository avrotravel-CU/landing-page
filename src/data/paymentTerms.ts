export type TermsBullet = {
  label: string;
  text: string;
};

export type TermsSection = {
  title: string;
  intro?: string;
  bullets?: TermsBullet[];
  paragraphs?: string[];
  listItems?: string[];
  introAfterList?: string;
  listItemsAfter?: string[];
  closingParagraph?: string;
  dividerAfter?: boolean;
};

export const PAYMENT_TERMS_TITLE = "Terms and Conditions for Payments";

export const PAYMENT_TERMS_SECTIONS: TermsSection[] = [
  {
    title: "1. Payment Structure",
    intro:
      "All tour bookings with Ceylon Unscripted follow a simple three-step payment schedule.",
    bullets: [
      {
        label: "25% Deposit at Booking",
        text: "This deposit secures your dates and confirms all arrangements.",
      },
      {
        label: "50% Payment 60 Days Before Travel",
        text: "This covers accommodation bookings and transport.",
      },
      {
        label: "25% Final Payment 30 Days Before Travel",
        text: "This settles all remaining tour costs.",
      },
    ],
    paragraphs: [
      "For bookings made less than 90 days before travel, full payment is required at the time of booking. Custom payment schedules are available for tours over USD 5,000.",
    ],
  },
  {
    title: "2. Accepted Currencies",
    paragraphs: [
      "Payments can be made in USD, EUR, or GBP. All tour packages are quoted in USD. Rates in other currencies can be provided upon request.",
    ],
  },
  {
    title: "3. Payment Confirmation",
    paragraphs: [
      "You will receive an automated confirmation email immediately after your payment is processed. A detailed receipt will follow within 24 hours from our team.",
    ],
  },
  {
    title: "4. Cancellation and Refund Policy",
    intro: "Refunds are issued according to the timeline below.",
    bullets: [
      {
        label: "90+ days before travel",
        text: "Full refund minus a 10% admin fee.",
      },
      {
        label: "60 to 89 days before travel",
        text: "50% refund.",
      },
      {
        label: "30 to 59 days before travel",
        text: "25% refund.",
      },
      {
        label: "Less than 30 days before travel",
        text: "No refund.",
      },
    ],
    paragraphs: [
      "We strongly recommend travel insurance for additional protection.",
    ],
  },
  {
    title: "5. No Hidden Fees",
    paragraphs: [
      "The price you see is the price you pay. International transaction fees may apply depending on your bank or payment method.",
    ],
  },
  {
    title: "6. Split Payments",
    paragraphs: [
      "Split payments across multiple cards can be arranged. Contact us and we will send separate payment links.",
    ],
  },
  {
    title: "7. Liability and Third-Party Services",
    intro:
      "Ceylon Unscripted provides curated travel experiences through trusted partners. However, we do not control or manage any personal or commercial activities you may choose to engage in outside your confirmed itinerary.",
    paragraphs: ["By booking with us, you agree to the following:"],
    listItems: [
      "Ceylon Unscripted is not responsible for any extra services, purchases, or agreements made directly with your driver, guide, hotel staff, or any other individual or business in Sri Lanka.",
      "Any additional activities, upgrades, purchases, or side arrangements made outside your official tour plan are done at your own risk.",
      "Ceylon Unscripted holds no liability for losses, disputes, damages, or issues arising from third-party interactions or personal agreements not booked through our platform.",
    ],
    introAfterList: "This includes but is not limited to:",
    listItemsAfter: [
      "Personal shopping or commissions",
      "Extra excursions or transport",
      "Hotel upgrades or add-ons",
      "Any private business dealings with individuals or companies",
    ],
    closingParagraph:
      "Your official itinerary and payments made through Ceylon Unscripted remain fully protected and secure.",
    dividerAfter: true,
  },
  {
    title: "8. Changes to Your Booking",
    paragraphs: [
      "Any changes to your itinerary must be requested through Ceylon Unscripted. Adjustments depend on availability and may involve additional costs.",
    ],
    dividerAfter: true,
  },
  {
    title: "9. Governing Law",
    paragraphs: ["All bookings are governed by the laws of Sri Lanka."],
  },
];
