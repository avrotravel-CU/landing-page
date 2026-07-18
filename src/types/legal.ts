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
