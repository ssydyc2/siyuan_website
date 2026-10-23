import { useCallback, useEffect, useRef, useState } from 'react';
import { useMotionValueEvent, useReducedMotion, useScroll } from 'motion/react';

interface TimelineItem {
  period: string;
  title: string;
  company?: string;
  description: string;
  tags: string[];
}

const timelineData: TimelineItem[] = [
  {
    period: "2022 - Present",
    title: "Software Engineer, Machine Learning",
    company: "Meta Inc.",
    description: "Machine learning for ads, LLMs, and AI safety at MSL.",
    tags: ["Ads", "LLM", "AI Safety"]
  },
  {
    period: "2018 - 2022",
    title: "Machine Learning Engineer",
    company: "Snap Inc.",
    description: "Built ML models for friending ranking and notification ranking systems.",
    tags: ["ML Systems", "Ranking Systems"]
  },
  {
    period: "2013 - 2018",
    title: "Ph.D. in Operations Research\nM.S. in Computer Science",
    company: "University of Southern California",
    description: "Focused on theoretical optimization and algorithmic research",
    tags: ["Optimization", "Mathematical Modeling", "Research"]
  },
  {
    period: "2010 - 2013",
    title: "M.A. in Mathematics",
    company: "Indiana University Bloomington",
    description: "Ph.D dropout",
    tags: ["Mathematics", "Graduate Study"]
  },
  {
    period: "2006 - 2010",
    title: "B.S. in Mathematics and Applied Mathematics",
    company: "University of Science and Technology of China",
    description: "",
    tags: ["Mathematics", "Applied Mathematics"]
  }
];

function ConvexDescentFigure() {
  return (
    <svg viewBox="0 0 420 340" role="img" aria-labelledby="home-figure-title">
      <title id="home-figure-title">Level curves of a convex function, with one descent drawn in</title>
      <text
        x="24"
        y="34"
        fill="var(--ink-faint)"
        fontFamily="var(--font-mono)"
        fontSize="11"
        letterSpacing="0.14em"
      >
        FIG. 1
      </text>
      <text
        x="396"
        y="34"
        fill="var(--ink-faint)"
        fontFamily="var(--font-mono)"
        fontSize="12"
        textAnchor="end"
      >
        f(x, y)
      </text>
      <line x1="24" y1="52" x2="396" y2="52" stroke="var(--rule)" />
      <g fill="none" transform="rotate(-22 214 178)">
        <ellipse cx="214" cy="178" rx="136" ry="88" stroke="var(--rule-strong)" strokeWidth="1.25" />
        <ellipse cx="214" cy="178" rx="90" ry="58" stroke="var(--ink-faint)" strokeWidth="1.25" />
        <ellipse cx="214" cy="178" rx="46" ry="30" fill="var(--accent-soft)" stroke="var(--accent)" strokeWidth="1.35" />
      </g>
      <polyline
        points="72,96 108,116 140,134 168,150 192,162 214,178"
        fill="none"
        stroke="var(--accent)"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <g fill="var(--paper-elevated)" stroke="var(--accent)" strokeWidth="1.5">
        <circle cx="72" cy="96" r="3.25" />
        <circle cx="108" cy="116" r="3.25" />
        <circle cx="140" cy="134" r="3.25" />
        <circle cx="168" cy="150" r="3.25" />
        <circle cx="192" cy="162" r="3.25" />
      </g>
      <circle cx="214" cy="178" r="4" fill="var(--accent)" />
      <text
        x="228"
        y="168"
        fill="var(--ink-muted)"
        fontFamily="var(--font-serif)"
        fontSize="15"
        fontStyle="italic"
      >
        x*
      </text>
    </svg>
  );
}

function TimelineEntry({
  item,
  isActive,
  entryRef,
  onActivate
}: {
  item: TimelineItem;
  isActive: boolean;
  entryRef: (node: HTMLLIElement | null) => void;
  onActivate: () => void;
}) {
  return (
    <li ref={entryRef} className={`timeline-item ${isActive ? 'timeline-item--active' : ''}`}>
      <button
        type="button"
        className="timeline-item__hitbox"
        aria-label={`Highlight and center ${item.title.replace(/\n/g, ' ')} at ${item.company ?? item.period}`}
        aria-pressed={isActive}
        onClick={onActivate}
      />
      <p className="timeline-item__period">
        <span aria-hidden="true" className="timeline-item__marker" />
        {item.period}
      </p>
      <div className="min-w-0">
        <h3 className="timeline-item__title whitespace-pre-line font-serif text-[1.4rem] font-normal leading-snug">
          {item.title}
        </h3>
        {item.company && (
          <p className="mt-1 text-sm font-medium text-[var(--ink-muted)]">{item.company}</p>
        )}
        {item.description && (
          <p className="mt-3 max-w-[60ch] text-[0.95rem] leading-relaxed text-[var(--ink-muted)]">{item.description}</p>
        )}
        <ul className="mt-4 flex flex-wrap gap-1.5" aria-label="Tags">
          {item.tags.map((tag) => (
            <li key={tag} className="tag">
              {tag}
            </li>
          ))}
        </ul>
      </div>
    </li>
  );
}

export default function Background() {
  const [activeTimelineIndex, setActiveTimelineIndex] = useState(0);
  const reduceMotion = useReducedMotion();
  const { scrollY } = useScroll();
  const timelineRefs = useRef<Array<HTMLLIElement | null>>([]);

  const updateActiveTimelineItem = useCallback(() => {
    if (typeof window === 'undefined') {
      return;
    }

    const scrolledToBottom =
      window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4;
    const focalLine = window.innerHeight * 0.52;
    let nextActiveIndex = 0;
    let shortestDistance = Number.POSITIVE_INFINITY;

    timelineRefs.current.forEach((node, index) => {
      if (!node) {
        return;
      }

      const rect = node.getBoundingClientRect();
      const nodeCenter = rect.top + rect.height / 2;
      const distance = Math.abs(nodeCenter - focalLine);

      if (distance < shortestDistance) {
        shortestDistance = distance;
        nextActiveIndex = index;
      }
    });

    if (scrolledToBottom && window.scrollY > 0) {
      nextActiveIndex = timelineRefs.current.length - 1;
    }

    setActiveTimelineIndex((current) => {
      return current === nextActiveIndex ? current : nextActiveIndex;
    });
  }, []);

  useMotionValueEvent(scrollY, 'change', updateActiveTimelineItem);

  useEffect(() => {
    const frameId = window.requestAnimationFrame(updateActiveTimelineItem);
    window.addEventListener('resize', updateActiveTimelineItem);

    return () => {
      window.cancelAnimationFrame(frameId);
      window.removeEventListener('resize', updateActiveTimelineItem);
    };
  }, [updateActiveTimelineItem]);

  const activateTimelineItem = useCallback((index: number) => {
    setActiveTimelineIndex(index);
    timelineRefs.current[index]?.scrollIntoView({
      behavior: reduceMotion ? 'auto' : 'smooth',
      block: 'center'
    });
  }, [reduceMotion]);

  return (
    <div className="home">
      <header className="page-enter">
        <h1 className="page-title">About Me</h1>
      </header>

      <section className="home-spread page-enter page-enter--delay">
        <div>
          <p className="page-lede">
            I earned my Ph.D. from the University of Southern California, where my research
            focused on theoretical optimization problems and algorithmic methods. I have 8
            years of industry experience spanning product-facing machine learning models and AI
            platform infrastructure, including recommendation systems, ads models, notification
            optimization, and recent work on LLM post-training, serving frameworks, and
            performance optimization.
          </p>
          <p className="home-contact">
            <span className="page-eyebrow">Contact</span>
            <a href="mailto:ssydyc@gmail.com" className="text-link text-[0.95rem]">
              ssydyc@gmail.com
            </a>
          </p>
        </div>
        <figure className="home-plate">
          <ConvexDescentFigure />
        </figure>
      </section>

      <section aria-labelledby="experience-heading">
        <h2 id="experience-heading" className="page-eyebrow home-kicker">Experience</h2>
        <ol className="page-enter page-enter--delay">
          {timelineData.map((item, index) => (
            <TimelineEntry
              key={index}
              item={item}
              isActive={activeTimelineIndex === index}
              entryRef={(node) => {
                timelineRefs.current[index] = node;
              }}
              onActivate={() => activateTimelineItem(index)}
            />
          ))}
        </ol>
      </section>
    </div>
  );
}
