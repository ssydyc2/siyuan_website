import { lazy, Suspense, useCallback, useEffect, useRef, useState, type ReactNode } from 'react';
import { motion, useMotionValueEvent, useReducedMotion, useScroll } from 'motion/react';
import SceneFallback from '../components/about/SceneFallback';

const LossSurfaceScene = lazy(() => import('../components/about/LossSurfaceScene'));

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

function supportsWebGL() {
  if (typeof document === 'undefined') {
    return false;
  }

  try {
    const canvas = document.createElement('canvas');
    return Boolean(canvas.getContext('webgl2') ?? canvas.getContext('webgl'));
  } catch {
    return false;
  }
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

function Chapter({
  labelledBy,
  reduceMotion,
  className = '',
  children
}: {
  labelledBy: string;
  reduceMotion: boolean;
  className?: string;
  children: ReactNode;
}) {
  return (
    <section aria-labelledby={labelledBy} className={`about-chapter ${className}`}>
      <motion.div
        className="about-chapter__content"
        initial={reduceMotion ? false : { opacity: 0, y: 28 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      >
        {children}
      </motion.div>
    </section>
  );
}

export default function Background() {
  const [activeTimelineIndex, setActiveTimelineIndex] = useState(0);
  const [hasWebGL] = useState(supportsWebGL);
  const reduceMotion = useReducedMotion() ?? false;
  const storyRef = useRef<HTMLDivElement>(null);
  const { scrollY } = useScroll();
  const { scrollYProgress } = useScroll({ target: storyRef, offset: ['start start', 'end end'] });
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
    <div ref={storyRef} className="about-story">
      {hasWebGL && (
        <Suspense fallback={null}>
          <LossSurfaceScene progress={scrollYProgress} reduceMotion={reduceMotion} />
        </Suspense>
      )}

      <Chapter labelledBy="about-heading" reduceMotion={reduceMotion} className="about-chapter--summary">
        <p className="page-eyebrow">Summary</p>
        <h1 id="about-heading" className="page-title mt-3">About Me</h1>
        <p className="page-lede mt-8">
          I earned my Ph.D. from the University of Southern California, where my research
          focused on theoretical optimization problems and algorithmic methods. I have 8
          years of industry experience spanning product-facing machine learning and LLM work,
          plus infrastructure, including recommendation systems, ads models, notification
          optimization, and AI safety.
        </p>
        <p className="home-contact">
          <span className="page-eyebrow">Contact</span>
          <a href="mailto:ssydyc@gmail.com" className="text-link text-[0.95rem]">
            ssydyc@gmail.com
          </a>
        </p>
        {!hasWebGL && <SceneFallback />}
        {hasWebGL && (
          <p className="about-scroll-hint" aria-hidden="true">
            Scroll to descend
          </p>
        )}
      </Chapter>

      <Chapter labelledBy="experience-heading" reduceMotion={reduceMotion}>
        <h2 id="experience-heading" className="page-eyebrow home-kicker">Experience</h2>
        <ol>
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
      </Chapter>
    </div>
  );
}
