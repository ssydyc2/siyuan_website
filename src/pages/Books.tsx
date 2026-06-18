import readingLibrary from '../assets/reading-list/reading-library.svg';

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
    <div className="reading-hero-scene" aria-hidden="true">
      <img src={readingLibrary} alt="" className="reading-hero-scene__image" draggable="false" />
      <span className="reading-hero-scene__shine" />
      <span className="reading-hero-scene__grain" />
    </div>
  );
}

export default function Books() {
  return (
    <div className="space-y-8">
      <header>
        <ReadingHeroScene />
        <h1 className="font-serif text-3xl font-normal text-[#20231f]">Reading List</h1>
        <p className="mt-4 max-w-3xl text-lg leading-8 text-[#61685f]">
          A personal shelf for career growth, self-improvement, wealth, and happiness.
        </p>
      </header>

      <div className="space-y-4">
        {books.map((book) => (
          <article
            key={book.id}
            className="border border-[#d8cec0] bg-[#fffdf7] p-6 shadow-[3px_3px_0_#d8cec0]"
          >
            <h2 className="text-xl font-medium leading-snug text-[#20231f]">
              {Array.isArray(book.title)
                ? book.title.map((title, index) => (
                    <span key={title} className="block">
                      {title}
                      {index < book.title.length - 1 ? ' ' : ''}
                    </span>
                  ))
                : book.title}
            </h2>
            <p className="mt-2 font-mono text-xs uppercase tracking-[0.16em] text-[#8a9188]">
              By {book.author}
            </p>
            <div className="mt-4 border-l-2 border-[#0f766e] pl-4">
              <p className="mb-1 font-mono text-xs uppercase tracking-[0.16em] text-[#8a9188]">
                My Comment
              </p>
              <p className="leading-relaxed text-[#61685f]">{book.comment}</p>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
