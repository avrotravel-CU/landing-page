import type { TermsSection } from "../data/paymentTerms";

function renderListItem(item: string) {
  if (item.startsWith("Email: ")) {
    const email = item.slice(7);
    return (
      <>
        Email:{" "}
        <a
          href={`mailto:${email}`}
          className="font-semibold text-gold-600 hover:underline"
        >
          {email}
        </a>
      </>
    );
  }

  return item;
}

export default function LegalSectionsContent({
  sections,
  compact = false,
}: {
  sections: TermsSection[];
  compact?: boolean;
}) {
  const textClass = compact
    ? "text-xs leading-relaxed text-forest-950/70"
    : "text-sm leading-relaxed text-forest-950/70";

  return (
    <div className={`space-y-4 ${textClass}`}>
      {sections.map((section) => (
        <div key={section.title}>
          <p className="font-semibold text-forest-900">{section.title}</p>
          {section.intro && <p className="mt-1">{section.intro}</p>}
          {section.bullets && (
            <ul className="mt-2 space-y-2">
              {section.bullets.map((bullet) => (
                <li key={bullet.label}>
                  <span className="font-medium text-forest-900">
                    • {bullet.label}
                  </span>
                  <br />
                  {bullet.text}
                </li>
              ))}
            </ul>
          )}
          {section.listItems && (
            <ul className="mt-2 list-disc space-y-1 pl-5">
              {section.listItems.map((item) => (
                <li key={item}>{renderListItem(item)}</li>
              ))}
            </ul>
          )}
          {section.paragraphs?.map((paragraph) => (
            <p key={paragraph} className="mt-1">
              {paragraph}
            </p>
          ))}
          {section.introAfterList && (
            <p className="mt-2">{section.introAfterList}</p>
          )}
          {section.listItemsAfter && (
            <ul className="mt-2 list-disc space-y-1 pl-5">
              {section.listItemsAfter.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          )}
          {section.closingParagraph && (
            <p className="mt-2">{section.closingParagraph}</p>
          )}
          {section.dividerAfter && (
            <hr className="mt-4 border-forest-900/10" />
          )}
        </div>
      ))}
    </div>
  );
}
