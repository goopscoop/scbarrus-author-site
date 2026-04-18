export type Book = {
  slug: string;
  title: string;
  subtitle?: string;
  year?: string;
  /** Archive identifier for terminal-style metadata. */
  archiveId: string;
  /** One or two sentences; avoid hype. */
  description: string;
  /** Replace with your retailer URLs when ready. */
  amazonUrl: string;
  audibleUrl: string;
};

export const books: Book[] = [
  {
    slug: 'discovering-aberration',
    title: 'Discovering Aberration',
    archiveId: '001',
    year: '2014',
    description:
      'A maritime expedition uncovers forces better left unmapped. The novel follows obsession, consequence, and the cost of pushing past safe boundaries.',
    amazonUrl: 'https://www.amazon.com/s?k=Discovering+Aberration',
    audibleUrl: 'https://www.audible.com/search?keywords=Discovering+Aberration',
  },
  {
    slug: 'the-peculiar-case-of-the-luminous-eye',
    title: 'The Peculiar Case of the Luminous Eye',
    archiveId: '002',
    year: '2016',
    description:
      'A contained mystery with an uncanny center: evidence that refuses to behave, and witnesses who remember the wrong things.',
    amazonUrl: 'https://www.amazon.com/s?k=The+Peculiar+Case+of+the+Luminous+Eye',
    audibleUrl:
      'https://www.audible.com/search?keywords=The+Peculiar+Case+of+the+Luminous+Eye',
  },
];

export function getBook(slug: string) {
  return books.find((b) => b.slug === slug);
}
