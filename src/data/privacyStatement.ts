import type { TermsSection } from "./paymentTerms";

export const PRIVACY_STATEMENT_TITLE = "Privacy Statement";

export const PRIVACY_INTRO =
  "Ceylon Unscripted respects your privacy and is committed to protecting your personal information. This Privacy Statement explains how we collect, use, store, and safeguard your data when you visit our website, interact with our content, or use our services.";

export const PRIVACY_SECTIONS: TermsSection[] = [
  {
    title: "1. Information We Collect",
    intro: "We may collect the following types of information:",
    listItems: [
      "Personal details you provide voluntarily, such as your name, email address, or contact number when you subscribe, submit a form, or communicate with us.",
      "Usage data, including pages visited, links clicked, time spent on the site, and general browsing behaviour.",
      "Technical information, such as IP address, device type, browser type, and operating system.",
      "Cookies and similar technologies to improve your browsing experience and understand how visitors use our site.",
    ],
    closingParagraph:
      "We do not collect sensitive personal information unless you choose to provide it.",
    dividerAfter: true,
  },
  {
    title: "2. How We Use Your Information",
    intro: "We use your information to:",
    listItems: [
      "Improve the Ceylon Unscripted website and user experience",
      "Respond to inquiries and provide customer support",
      "Send updates, newsletters, or promotional content (only if you opt in)",
      "Analyse website performance and visitor behaviour",
      "Maintain security and prevent misuse of our platform",
    ],
    closingParagraph: "We do not sell, rent, or trade your personal information.",
    dividerAfter: true,
  },
  {
    title: "3. Sharing Your Information",
    intro: "We may share your information only with:",
    listItems: [
      "Service providers who support website hosting, analytics, email delivery, or security",
      "Legal authorities, if required by law or to protect our rights and users",
      "Payment processors, only when you make a purchase or booking (these providers follow their own strict privacy and security standards)",
    ],
    closingParagraph:
      "We do not share your information with third parties for advertising or unrelated commercial purposes.",
    dividerAfter: true,
  },
  {
    title: "4. Data Security",
    paragraphs: [
      "We take reasonable technical and organizational measures to protect your information from unauthorized access, alteration, disclosure, or loss. While no system is completely secure, we follow industry-standard practices to safeguard your data.",
    ],
    dividerAfter: true,
  },
  {
    title: "5. Your Choices",
    intro: "You may:",
    listItems: [
      "Opt out of marketing emails at any time",
      "Request access to the personal information we hold about you",
      "Ask for corrections or deletion of your data, where applicable",
      "Disable cookies through your browser settings",
    ],
    dividerAfter: true,
  },
  {
    title: "6. External Links",
    paragraphs: [
      "Our website may contain links to external sites. We are not responsible for the privacy practices or content of those websites. We encourage you to review their privacy policies separately.",
    ],
    dividerAfter: true,
  },
  {
    title: "7. Children's Privacy",
    paragraphs: [
      "Ceylon Unscripted does not knowingly collect personal information from individuals under the age of 16. If such information is inadvertently collected, we will delete it promptly upon discovery.",
    ],
    dividerAfter: true,
  },
  {
    title: "8. Updates to This Privacy Statement",
    paragraphs: [
      "We may update this Privacy Statement from time to time to reflect changes in our services or legal requirements. The latest version will always be available on this page.",
    ],
    dividerAfter: true,
  },
  {
    title: "9. Contact Us",
    intro:
      "If you have questions about this Privacy Statement or how your information is handled, you may contact us at:",
    listItems: ["Ceylon Unscripted", "Email: support@ceylonunscripted.com"],
  },
];
