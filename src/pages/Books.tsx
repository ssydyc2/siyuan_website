import { useState } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import readingLibrary from '../assets/hero/reading-library-anime.webp';
import HeroScene from '../components/HeroScene';

type ReadingTopic = 'self-improvement' | 'wealth' | 'happiness';

interface Book {
  id: string;
  title: string | string[];
  author: string;
  comment: string;
  topics: ReadingTopic[];
}

const readingTopics: ReadingTopic[] = ['self-improvement', 'wealth', 'happiness'];

const books: Book[] = [
  {
    id: 'almanack-of-naval-ravikant',
    title: 'The Almanack of Naval Ravikant: A Guide to Wealth and Happiness',
    author: 'Eric Jorgenson',
    comment: 'Must read for how to build wealth (on specific knowledge) and happiness',
    topics: ['wealth', 'happiness'],
  },
  {
    id: 'the-psychology-of-money',
    title: 'The Psychology of Money',
    author: 'Morgan Housel',
    comment: 'Must read on how to keep wealth.',
    topics: ['wealth'],
  },
  {
    id: 'the-courage-to-be-disliked-and-happy',
    title: ['The Courage to Be Disliked', 'The Courage to Be Happy'],
    author: 'Ichiro Kishimi and Fumitake Koga',
    comment:
      'Unlike traditional psychology, which emphasizes childhood and the past, these two books emphasize the present and the courage to choose happiness.',
    topics: ['happiness'],
  },
  {
    id: 'how-to-read-a-book',
    title: 'How to Read a Book',
    author: 'Mortimer J. Adler and Charles Van Doren',
    comment:
      'Must-read for reading books well, with innovative four levels of reading and a focus on active reading.',
    topics: ['self-improvement'],
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

function ReadingTopicsRail({
  activeTopics,
  onTopicSelect
}: {
  activeTopics: ReadingTopic[];
  onTopicSelect: (topic: ReadingTopic) => void;
}) {
  return (
    <aside className="reading-topics min-w-0 lg:sticky lg:top-8 lg:self-start" aria-label="Reading topics">
      <div className="min-w-0 border-y border-[var(--rule)] py-4 lg:border-y-0 lg:border-l lg:py-1 lg:pl-5">
        <p className="mb-3 font-mono text-[0.68rem] uppercase tracking-[0.18em] text-[var(--ink-faint)]">
          Topics
        </p>
        <div className="flex max-w-full gap-2 overflow-x-auto pb-1 lg:block lg:space-y-2 lg:overflow-visible lg:pb-0">
          {readingTopics.map((topic) => {
            const isActive = activeTopics.includes(topic);

            return (
              <motion.button
                key={topic}
                type="button"
                className="block w-max shrink-0 border px-3 py-2 text-left font-mono text-xs uppercase tracking-[0.14em] transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--accent)] lg:w-full lg:border-0 lg:px-0"
                onClick={() => onTopicSelect(topic)}
                aria-pressed={isActive}
                animate={{
                  color: isActive ? 'var(--accent)' : 'var(--ink-faint)',
                  opacity: isActive ? 1 : 0.42,
                  x: isActive ? 2 : 0,
                  borderColor: isActive ? 'var(--accent)' : 'var(--rule)',
                  backgroundColor: isActive ? 'color-mix(in srgb, var(--accent-soft) 42%, transparent)' : 'transparent'
                }}
                transition={{ duration: 0.22, ease: 'easeOut' }}
              >
                <span className="mr-2 inline-block h-1.5 w-1.5 rounded-full bg-current align-middle" />
                {topic}
              </motion.button>
            );
          })}
        </div>
      </div>
    </aside>
  );
}

function BookCard({
  book,
  isActive,
  reduceMotion,
  onSelect
}: {
  book: Book;
  isActive: boolean;
  reduceMotion: boolean;
  onSelect: () => void;
}) {
  const cardTransition = reduceMotion
    ? { duration: 0 }
    : { type: 'spring' as const, stiffness: 260, damping: 30, mass: 0.75 };

  return (
    <motion.button
      type="button"
      className="reading-book-card block w-full border p-6 text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--accent)]"
      onClick={onSelect}
      aria-pressed={isActive}
      animate={{
        opacity: isActive ? 1 : 0.44,
        scale: isActive && !reduceMotion ? 1.012 : 1,
        filter: isActive ? 'grayscale(0) saturate(1.06)' : 'grayscale(0.72) saturate(0.58)',
        borderColor: isActive ? 'var(--accent)' : 'var(--rule)',
        backgroundColor: isActive ? 'color-mix(in srgb, var(--paper-elevated) 90%, var(--accent-soft))' : 'var(--paper-elevated)',
        boxShadow: isActive
          ? '5px 6px 0 color-mix(in srgb, var(--shadow-rule) 95%, transparent), 0 12px 28px color-mix(in srgb, var(--accent) 14%, transparent)'
          : '2px 2px 0 color-mix(in srgb, var(--shadow-rule) 56%, transparent)'
      }}
      transition={cardTransition}
      whileHover={reduceMotion ? undefined : { y: -2 }}
    >
      <h2 className="break-words text-xl font-medium leading-snug text-[var(--ink)]">
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
    </motion.button>
  );
}

export default function Books() {
  const [selectedTopic, setSelectedTopic] = useState<ReadingTopic | null>(null);
  const [selectedBookId, setSelectedBookId] = useState<string | null>(books[0].id);
  const reduceMotion = useReducedMotion();
  const prefersReducedMotion = reduceMotion ?? false;
  const selectedBook = books.find((book) => book.id === selectedBookId) ?? books[0];
  const activeTopics = selectedTopic ? [selectedTopic] : selectedBook.topics;
  const selectTopic = (topic: ReadingTopic) => {
    setSelectedTopic(topic);
    setSelectedBookId(null);
  };
  const selectBook = (bookId: string) => {
    setSelectedBookId(bookId);
    setSelectedTopic(null);
  };
  const isBookActive = (book: Book) => {
    if (selectedTopic) {
      return book.topics.includes(selectedTopic);
    }

    return selectedBookId === book.id;
  };

  return (
    <div className="space-y-8">
      <header>
        <ReadingHeroScene />
        <h1 className="font-serif text-3xl font-normal text-[var(--ink)]">Reading List</h1>
        <p className="mt-4 max-w-3xl text-lg leading-8 text-[var(--ink-muted)]">
          A personal shelf for self-improvement, wealth, and happiness.
        </p>
      </header>

      <div className="grid gap-6 lg:grid-cols-[13rem_minmax(0,1fr)] lg:items-start">
        <ReadingTopicsRail activeTopics={activeTopics} onTopicSelect={selectTopic} />
        <div className="min-w-0 space-y-4">
          {books.map((book) => (
            <BookCard
              key={book.id}
              book={book}
              isActive={isBookActive(book)}
              reduceMotion={prefersReducedMotion}
              onSelect={() => selectBook(book.id)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
