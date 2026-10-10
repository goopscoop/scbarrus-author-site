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
  audibleUrl?: string;
  goodreadsUrl?: string;
  /** Schema.org genre label for structured data. */
  genre?: string;
  img: string;
  type: 'novel' | 'short-story' | 'collection' | 'novella';
};

export const books: Book[] = [
  {
    slug: 'the-peculiar-case-of-the-luminous-eye',
    title: 'The Peculiar Case of the Luminous Eye',
    archiveId: '001',
    year: '2020',
    description:
      'A supernatural mystery involving a book bound in human skin and the otherworldly spirits trapped within. Can William and Florence expel the otherworldly entities? More importantly, will they even survive the night?',
    amazonUrl: 'https://www.amazon.com/Peculiar-Case-Luminous-Eye-Paranormal/dp/0989917746/',
    goodreadsUrl: 'https://www.goodreads.com/book/show/54228797-the-peculiar-case-of-the-luminous-eye',
    genre: 'Supernatural mystery',
    img: 'peculiar-case-cover.jpg',
    type: 'novella',
  },
  {
    slug: 'discovering-aberration',
    title: 'Discovering Aberration',
    archiveId: '002',
    year: '2014',
    description:
      `A dark satirical steampunk adventure. Two professors steal ancient map from a crimelord and find themselves in a race to make the discovery of a lifetime, if it doesn't kill them first.`,
    amazonUrl: 'https://www.amazon.com/Discovering-Aberration-S-C-Barrus/dp/0989917703/',
    goodreadsUrl: 'https://www.goodreads.com/book/show/20937346-discovering-aberration',
    genre: 'Steampunk',
    img: 'discovering-aberration-cover.jpg',
    type: 'novel',
  },
];

export function getBook(slug: string) {
  return books.find((b) => b.slug === slug);
}

/** Human-readable label for `Book.type` (e.g. `short-story` → "Short story"). */
export function displayBookType(type: Book['type']): string {
  return type
    .split('-')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');
}
