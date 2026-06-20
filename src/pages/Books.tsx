import readingLibrary from '../assets/hero/reading-library-anime.webp';
import HeroScene from '../components/HeroScene';

interface Book {
  id: string;
  title: string | string[];
  author: string;
  comment: string;
}

const books: Book[] = [
  {
    id: 'almanack-of-naval-ravikant',
    title: 'The Almanack of Naval Ravikant: A Guide to Wealth and Happiness',
    author: 'Eric Jorgenson',
    comment: 'Must read for how to build wealth (on specific knowledge) and happiness',
  },
  {
    id: 'the-psychology-of-money',
    title: 'The Psychology of Money',
    author: 'Morgan Housel',
    comment: 'Must read on how to keep wealth.',
  },
  {
    id: 'the-courage-to-be-disliked-and-happy',
    title: ['The Courage to Be Disliked', 'The Courage to Be Happy'],
    author: 'Ichiro Kishimi and Fumitake Koga',
    comment:
      'Unlike traditional psychology, which emphasizes childhood and the past, these two books emphasize the present and the courage to choose happiness.',
  },
  {
    id: 'how-to-read-a-book',
    title: 'How to Read a Book',
    author: 'Mortimer J. Adler and Charles Van Doren',
    comment:
      'Must-read for reading books well, with innovative four levels of reading and a focus on active reading.',
  },
];

function ReadingHeroScene() {
  return (
    <HeroScene
      src={readingLibrary}
      alt="Anime-style reading room with bookshelves, warm lamp light, and an open book"
      variant="reading"
    />
  );
}

export default function Books() {
  return (
    <div className="space-y-8">
      <header>
        <ReadingHeroScene />
        <h1 className="font-serif text-3xl font-normal text-[var(--ink)]">Reading List</h1>
        <p className="mt-4 max-w-3xl text-lg leading-8 text-[var(--ink-muted)]">
          A personal shelf for career growth, self-improvement, wealth, and happiness.
        </p>
      </header>

      <div className="space-y-4">
        {books.map((book) => (
          <article
            key={book.id}
            className="border border-[var(--rule)] bg-[var(--paper-elevated)] p-6 shadow-[3px_3px_0_var(--shadow-rule)]"
          >
            <h2 className="text-xl font-medium leading-snug text-[var(--ink)]">
              {Array.isArray(book.title)
                ? book.title.map((title, index) => (
                    <span key={title} className="block">
                      {title}
                      {index < book.title.length - 1 ? ' ' : ''}
                    </span>
                  ))
                : book.title}
            </h2>
            <p className="mt-2 font-mono text-xs uppercase tracking-[0.16em] text-[var(--ink-faint)]">
              By {book.author}
            </p>
            <div className="mt-4 border-l-2 border-[var(--accent)] pl-4">
              <p className="mb-1 font-mono text-xs uppercase tracking-[0.16em] text-[var(--ink-faint)]">
                My Comment
              </p>
              <p className="leading-relaxed text-[var(--ink-muted)]">{book.comment}</p>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
