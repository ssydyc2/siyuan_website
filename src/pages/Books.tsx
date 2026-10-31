import { useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';

type ReadingTopic = 'self-improvement' | 'wealth' | 'happiness';
type ReadingFilter = 'all' | ReadingTopic;

interface Book {
  id: string;
  title: string | string[];
  titleZh: string | string[];
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
    titleZh: '纳瓦尔宝典',
    author: 'Eric Jorgenson',
    comment: 'Must read for how to build wealth (on specific knowledge) and happiness',
    topics: ['wealth', 'happiness'],
  },
  {
    id: 'the-psychology-of-money',
    title: 'The Psychology of Money',
    titleZh: '金钱心理学',
    author: 'Morgan Housel',
    comment: 'Must read on how to keep wealth.',
    topics: ['wealth'],
  },
  {
    id: 'the-courage-to-be-disliked-and-happy',
    title: ['The Courage to Be Disliked', 'The Courage to Be Happy'],
    titleZh: ['被讨厌的勇气', '幸福的勇气'],
    author: 'Ichiro Kishimi and Fumitake Koga',
    comment:
      'Unlike traditional psychology, which emphasizes childhood and the past, these two books emphasize the present and the courage to choose happiness.',
    topics: ['happiness'],
  },
  {
    id: 'thinking-in-bets',
    title: 'Thinking in Bets',
    titleZh: '高胜算决策',
    author: 'Annie Duke',
    comment:
      "Changed how I see uncertainty and make decisions. Its best advice: 1. Treat decisions as bets and challenge binary right-or-wrong thinking. 2. Use outcomes as opportunities to learn. 3. Welcome dissent to seek information rather than good results. 4. Focus on what we can control, and don't complain about luck. 5. Use the 10-10-10 principle: ask how a decision will affect you in 10 minutes, 10 months, and 10 years, and weigh the long-term impact most. 6. Avoid tilt: don't let a recent bad (or good) outcome hijack your emotions and drive the next decision; step back and reset before deciding. 7. It's difficult to predict the future but easier to work backward: imagine the goal already succeeded or failed (especially for failure), then ask why, so you can surface the real drivers of the outcome.",
    topics: ['self-improvement'],
  },
  {
    id: 'the-happiness-trap',
    title: 'The Happiness Trap',
    titleZh: '幸福的陷阱',
    author: 'Russ Harris',
    comment:
      'Introductory book on ACT. Three ideas I keep: 1. Find your values and live a values-oriented life. 2. Be present: focus on now and on the next thing to do, not the story in your head. 3. Open up and unhook from negative thoughts, rather than fighting or obeying them.',
    topics: ['happiness'],
  },
  {
    id: 'essentialism',
    title: 'Essentialism: The Disciplined Pursuit of Less',
    titleZh: '精要主义',
    author: 'Greg McKeown',
    comment:
      'A book that teaches us how to explore, eliminate, and execute. Six ideas I keep: 1. Most things in life are noise; a few efforts have 100x or 1000x impact. 2. Only take top-10% opportunities: set three minimum criteria and three extreme criteria, and require passing at least two of the three extreme ones. 3. Build in buffers when executing. 4. Improve step by step. 5. Focus on what is essential and stay present. 6. Enjoy the process and treat execution as play.',
    topics: ['self-improvement'],
  },
];

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
  return (
    <button
      type="button"
      className={`reading-topic capitalize ${variant === 'chip' ? 'reading-topic--chip' : ''}`}
      onClick={() => onSelect(filter)}
      aria-pressed={isActive}
    >
      {filter}
    </button>
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
    <aside className="hidden min-w-0 lg:sticky lg:top-10 lg:block lg:self-start" aria-label="Reading topics">
      <p className="page-eyebrow mb-3 border-t border-[var(--rule)] pt-4">Topics</p>
      <div className="space-y-0.5">
        {readingFilters.map((filter) => (
          <TopicButton
            key={filter}
            filter={filter}
            isActive={activeFilter === filter}
            onSelect={onFilterSelect}
          />
        ))}
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
    <div className="lg:hidden">
      <p className="page-eyebrow mb-3">Topics</p>
      <div className="reading-topic-strip -mx-6 flex max-w-[100vw] gap-2 overflow-x-auto px-6 pb-1">
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

function BookTitle({ title, titleZh }: { title: string; titleZh?: string }) {
  return (
    <>
      <span className="block">{title}</span>
      {titleZh ? (
        <span lang="zh" className="mt-1.5 block font-zh text-lg text-[var(--ink-muted)]">
          {titleZh}
        </span>
      ) : null}
    </>
  );
}

function BookCard({
  book,
  reduceMotion
}: {
  book: Book;
  reduceMotion: boolean;
}) {
  return (
    <motion.article
      layout={!reduceMotion}
      className="reading-book-card grid gap-5 md:grid-cols-[minmax(0,15rem)_minmax(0,1fr)] md:gap-10"
      initial={reduceMotion ? false : { opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      exit={reduceMotion ? undefined : { opacity: 0 }}
      transition={reduceMotion ? { duration: 0 } : { duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="min-w-0">
        <h2 className="break-words font-serif text-2xl font-normal leading-tight text-[var(--ink)]">
          {Array.isArray(book.title)
            ? book.title.map((title, index) => (
                <span key={title} className={index > 0 ? 'mt-4 block' : 'block'}>
                  <BookTitle
                    title={title}
                    titleZh={Array.isArray(book.titleZh) ? book.titleZh[index] : undefined}
                  />
                </span>
              ))
            : (
              <BookTitle
                title={book.title}
                titleZh={typeof book.titleZh === 'string' ? book.titleZh : undefined}
              />
            )}
        </h2>
        <p className="mt-3 text-sm text-[var(--ink-muted)]">By {book.author}</p>
        <ul className="mt-4 flex flex-wrap gap-1.5" aria-label="Book topics">
          {book.topics.map((topic) => (
            <li key={topic} className="tag capitalize">
              {topic}
            </li>
          ))}
        </ul>
      </div>
      <div className="min-w-0">
        <p className="page-eyebrow mb-2">My Comment</p>
        <p className="max-w-[62ch] text-[1.02rem] leading-[1.75] text-[var(--ink-soft)]">{book.comment}</p>
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
    <div className="space-y-14">
      <header className="page-enter">
        <h1 className="page-title">Reading List</h1>
        <p className="page-lede mt-6">
          A personal shelf for self-improvement, wealth, and happiness.
        </p>
      </header>

      <MobileTopicControls
        activeFilter={activeFilter}
        onFilterSelect={setActiveFilter}
      />

      <div className="page-enter page-enter--delay grid gap-12 lg:grid-cols-[10rem_minmax(0,1fr)] lg:items-start">
        <ReadingTopicsRail
          activeFilter={activeFilter}
          onFilterSelect={setActiveFilter}
        />
        <div className="min-w-0">
          <AnimatePresence mode="popLayout" initial={false}>
            {filteredBooks.map((book) => (
              <BookCard
                key={book.id}
                book={book}
                reduceMotion={prefersReducedMotion}
              />
            ))}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
