import { useState } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import RpgHeroScene from '../components/RpgHeroScene';

type ReadingTopic = 'self-improvement' | 'wealth' | 'happiness';
type ReadingFilter = 'all' | ReadingTopic;

interface Book {
  id: string;
  title: string | string[];
  author: string;
  comment: string;
  topics: ReadingTopic[];
}

const readingTopics: ReadingTopic[] = ['self-improvement', 'wealth', 'happiness'];
const readingFilters: ReadingFilter[] = ['all', ...readingTopics];

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
  {
    id: 'thinking-in-bets',
    title: 'Thinking in Bets',
    author: 'Annie Duke',
    comment:
      'Changed how I see uncertainty and make decisions. Its best advice: treat decisions as bets and challenge binary right-or-wrong thinking, use outcomes as opportunities to learn, and welcome dissent to seek information rather than good results.',
    topics: ['self-improvement'],
  },
];

function ReadingHeroScene() {
  return <RpgHeroScene variant="reading" />;
}

function TopicButton({
  filter,
  isActive,
  onSelect,
  variant = 'rail'
}: {
  filter: ReadingFilter;
  isActive: boolean;
  onSelect: (filter: ReadingFilter) => void;
  variant?: 'rail' | 'chip';
}) {
  const baseClassName =
    'font-mono text-xs uppercase tracking-[0.14em] transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--accent)]';
  const variantClassName =
    variant === 'chip'
      ? 'inline-flex h-10 shrink-0 items-center border px-3'
      : 'block w-full border-0 px-0 py-2 text-left';

  return (
    <motion.button
      type="button"
      className={`${baseClassName} ${variantClassName}`}
      onClick={() => onSelect(filter)}
      aria-pressed={isActive}
      animate={{
        color: isActive ? 'var(--accent)' : 'var(--ink-faint)',
        opacity: isActive ? 1 : 0.52,
        x: variant === 'rail' && isActive ? 2 : 0,
        borderColor: isActive ? 'var(--accent)' : 'var(--rule)',
        backgroundColor: isActive ? 'color-mix(in srgb, var(--accent-soft) 42%, transparent)' : 'transparent'
      }}
      transition={{ duration: 0.22, ease: 'easeOut' }}
    >
      <span className="inline-flex min-w-0 items-center gap-2">
        <span className="inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-current" />
        <span className="truncate">{filter}</span>
      </span>
    </motion.button>
  );
}

function ReadingTopicsRail({
  activeFilter,
  onFilterSelect
}: {
  activeFilter: ReadingFilter;
  onFilterSelect: (filter: ReadingFilter) => void;
}) {
  return (
    <aside className="reading-topics hidden min-w-0 lg:sticky lg:top-8 lg:block lg:self-start" aria-label="Reading topics">
      <div className="max-h-[calc(100vh-5rem)] min-w-0 overflow-y-auto border-l border-[var(--rule)] py-1 pl-5">
        <p className="mb-3 font-mono text-[0.68rem] uppercase tracking-[0.18em] text-[var(--ink-faint)]">
          Topics
        </p>
        <div className="space-y-2">
          {readingFilters.map((filter) => {
            const isActive = activeFilter === filter;

            return (
              <TopicButton
                key={filter}
                filter={filter}
                isActive={isActive}
                onSelect={onFilterSelect}
              />
            );
          })}
        </div>
      </div>
    </aside>
  );
}

function MobileTopicControls({
  activeFilter,
  onFilterSelect
}: {
  activeFilter: ReadingFilter;
  onFilterSelect: (filter: ReadingFilter) => void;
}) {
  return (
    <div className="sticky top-0 z-20 -mx-6 border-y border-[var(--rule)] bg-[var(--paper)]/95 px-6 py-3 shadow-[0_8px_22px_color-mix(in_srgb,var(--paper)_72%,transparent)] backdrop-blur lg:hidden">
      <p className="mb-2 min-w-0 truncate font-mono text-[0.68rem] uppercase tracking-[0.18em] text-[var(--ink-faint)]">
        Topics
      </p>
      <div className="reading-topic-strip flex max-w-full gap-2 overflow-x-auto pb-1">
        {readingFilters.map((filter) => (
          <TopicButton
            key={filter}
            filter={filter}
            isActive={activeFilter === filter}
            onSelect={onFilterSelect}
            variant="chip"
          />
        ))}
      </div>
    </div>
  );
}

function BookCard({
  book,
  reduceMotion
}: {
  book: Book;
  reduceMotion: boolean;
}) {
  const cardTransition = reduceMotion
    ? { duration: 0 }
    : { type: 'spring' as const, stiffness: 260, damping: 30, mass: 0.75 };

  return (
    <motion.article
      className="rpg-panel reading-book-card block w-full border border-[var(--rule)] bg-[var(--paper-elevated)] p-6 text-left"
      animate={{
        opacity: 1,
        scale: 1
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
      <div className="mt-4 flex flex-wrap gap-2" aria-label="Book topics">
        {book.topics.map((topic) => (
          <span
            key={topic}
            className="border border-[var(--rule)] bg-[var(--accent-soft)] px-2.5 py-1 font-mono text-[0.68rem] uppercase tracking-[0.12em] text-[var(--accent)]"
          >
            {topic}
          </span>
        ))}
      </div>
      <div className="mt-4 border-l-2 border-[var(--accent)] pl-4">
        <p className="mb-1 font-mono text-xs uppercase tracking-[0.16em] text-[var(--ink-faint)]">
          My Comment
        </p>
        <p className="leading-relaxed text-[var(--ink-muted)]">{book.comment}</p>
      </div>
    </motion.article>
  );
}

export default function Books() {
  const [activeFilter, setActiveFilter] = useState<ReadingFilter>('all');
  const reduceMotion = useReducedMotion();
  const prefersReducedMotion = reduceMotion ?? false;
  const filteredBooks = activeFilter === 'all'
    ? books
    : books.filter((book) => book.topics.includes(activeFilter));

  return (
    <div className="space-y-8">
      <header>
        <ReadingHeroScene />
        <h1 className="rpg-page-title font-serif text-3xl font-normal text-[var(--ink)]">Reading List</h1>
        <p className="mt-4 max-w-3xl text-lg leading-8 text-[var(--ink-muted)]">
          A personal shelf for self-improvement, wealth, and happiness.
        </p>
      </header>

      <MobileTopicControls
        activeFilter={activeFilter}
        onFilterSelect={setActiveFilter}
      />

      <div className="grid gap-6 lg:grid-cols-[13rem_minmax(0,1fr)] lg:items-start">
        <ReadingTopicsRail
          activeFilter={activeFilter}
          onFilterSelect={setActiveFilter}
        />
        <div className="min-w-0 space-y-4">
          {filteredBooks.map((book) => (
            <BookCard
              key={book.id}
              book={book}
              reduceMotion={prefersReducedMotion}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
