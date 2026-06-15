import { useEffect, useState } from 'react';

interface TimelineItem {
  period: string;
  title: string;
  company?: string;
  description: string;
  tags: string[];
}

const timelineData: TimelineItem[] = [
  {
    period: "2025 - Present",
    title: "Software Engineer, Machine Learning",
    company: "Meta Inc.",
    description: "On the AI Platform team, working on LLM inference and training supporting other teams, especially for TPU.",
    tags: ["LLM", "Infra", "Performance Optimization"]
  },
  {
    period: "2022 - 2025",
    title: "Software Engineer, Machine Learning",
    company: "Meta Inc.",
    description: "Trained and deployed machine learning models for users' languages, advertiser's subsidy and ads notifications that are running in Meta's ads systems",
    tags: ["ML Systems", "Ads"]
  },
  {
    period: "2020 - 2022",
    title: "Machine Learning Engineer",
    company: "Snap Inc.",
    description: "Developed machine learning models for friend recommendations and notification optimization, directly impacting user engagement and retention.",
    tags: ["ML Systems", "Recommendation Systems"]
  },
  {
    period: "2018 - 2020",
    title: "Software Engineer, Infrastructure",
    company: "Snap Inc.",
    description: "Built service mesh infrastructure powering real-time communication for hundreds of millions of users.",
    tags: ["Distributed Systems", "Infrastructure"]
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

function TimelineCard({ item, index, isVisible }: { item: TimelineItem; index: number; isVisible: boolean }) {
  const isLeft = index % 2 === 0;

  return (
    <div className={`relative flex items-center ${isLeft ? 'justify-start' : 'justify-end'} mb-3`}>
      {/* Node on center line */}
      <div
        className="absolute left-1/2 top-1/2 z-10 h-3 w-3 -translate-x-1/2 rounded-full border-2 border-[#0f766e] bg-[#fffdf7]"
        style={{
          opacity: isVisible ? 1 : 0,
          transform: isVisible ? 'translate(-50%, -50%) scale(1)' : 'translate(-50%, -50%) scale(0)',
          transition: 'all 0.4s ease-out',
          transitionDelay: `${index * 0.15 + 0.3}s`
        }}
      >
        <div className="absolute inset-0.5 rounded-full bg-[#b7791f]" />
      </div>

      {/* Connector to center line */}
      <div
        className={`absolute top-1/2 h-px w-6 bg-[#958979]
          ${isLeft ? 'right-1/2 mr-3' : 'left-1/2 ml-3'}`}
        style={{
          opacity: isVisible ? 1 : 0,
          transition: 'opacity 0.5s ease-out',
          transitionDelay: `${index * 0.1}s`
        }}
      />

      {/* Card */}
      <div
        className={`w-5/12 ${isLeft ? 'pr-8' : 'pl-8'}`}
        style={{
          opacity: isVisible ? 1 : 0,
          transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
          transition: 'all 0.6s ease-out',
          transitionDelay: `${index * 0.15}s`
        }}
      >
        <div className="relative group">
          <div className="relative border border-[#d8cec0] bg-[#fffdf7] p-4 shadow-[3px_3px_0_#d8cec0] transition-colors duration-300 group-hover:border-[#958979]">
            {/* Period badge */}
            <div className="mb-2 inline-flex items-center border border-[#d8cec0] bg-[#eee7da] px-2 py-0.5 font-mono text-[0.68rem] uppercase tracking-[0.14em] text-[#0f766e]">
              <span className="mr-1.5 h-1.5 w-1.5 rounded-full bg-[#b7791f]" />
              {item.period}
            </div>

            {/* Title & Company */}
            <h3 className="mb-0.5 whitespace-pre-line text-base font-semibold text-[#20231f]">{item.title}</h3>
            {item.company && (
              <p className="mb-1 font-mono text-xs text-[#0f766e]">{item.company}</p>
            )}

            {/* Description */}
            {item.description && (
              <p className="mb-2 text-xs leading-relaxed text-[#61685f]">{item.description}</p>
            )}

            {/* Tags */}
            <div className="flex flex-wrap gap-1">
              {item.tags.map((tag) => (
                <span
                  key={tag}
                  className="border border-[#d8cec0] bg-[#f7f3ea] px-1.5 py-0.5 font-mono text-[0.68rem] text-[#61685f]"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function PixelJourney({ isVisible }: { isVisible: boolean }) {
  const renderSceneryItems = () => (
    <>
      <span className="pixel-journey__house">
        <span className="pixel-journey__roof" />
        <span className="pixel-journey__chimney" />
        <span className="pixel-journey__door" />
        <span className="pixel-journey__window" />
      </span>
      <span className="pixel-journey__tree pixel-journey__tree--first" />
      <span className="pixel-journey__tree pixel-journey__tree--second" />
      <span className="pixel-journey__tree pixel-journey__tree--third" />
      <span className="pixel-journey__shrub pixel-journey__shrub--first" />
      <span className="pixel-journey__shrub pixel-journey__shrub--second" />
    </>
  );

  return (
    <div
      className="pixel-journey"
      aria-hidden="true"
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'translateY(0)' : 'translateY(-10px)',
        transition: 'all 0.6s ease-out',
        transitionDelay: '0.05s'
      }}
    >
      <div className="pixel-journey__backdrop">
        <span className="pixel-journey__sun" />
        <div className="pixel-journey__clouds" />
        <div className="pixel-journey__hills" />
        <div className="pixel-journey__scenery">
          <div className="pixel-journey__scenery-strip">{renderSceneryItems()}</div>
          <div className="pixel-journey__scenery-strip">{renderSceneryItems()}</div>
        </div>
      </div>
      <div className="pixel-journey__track" />
      <div className="pixel-journey__walker">
        <span className="pixel-journey__head" />
        <span className="pixel-journey__pack" />
        <span className="pixel-journey__body" />
        <span className="pixel-journey__arm" />
        <span className="pixel-journey__leg pixel-journey__leg--front" />
        <span className="pixel-journey__leg pixel-journey__leg--back" />
      </div>
    </div>
  );
}

export default function Background() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const frameId = window.requestAnimationFrame(() => {
      setIsVisible(true);
    });

    return () => window.cancelAnimationFrame(frameId);
  }, []);

  return (
    <div className="relative min-h-screen">
      <div className="relative space-y-4">
        {/* Header */}
        <div className="text-center mb-8">
          <PixelJourney isVisible={isVisible} />
          <h1
            className="mb-2 font-serif text-3xl font-normal text-[#20231f]"
            style={{
              opacity: isVisible ? 1 : 0,
              transform: isVisible ? 'translateY(0)' : 'translateY(-20px)',
              transition: 'all 0.6s ease-out'
            }}
          >
            About Me
          </h1>
        </div>

        {/* Summary */}
        <section
          className="mx-auto mb-10 max-w-3xl border-y border-[#d8cec0] bg-[#fffdf7]/70 px-1 py-6"
          style={{
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? 'translateY(0)' : 'translateY(16px)',
            transition: 'all 0.6s ease-out',
            transitionDelay: '0.15s'
          }}
        >
          <p className="text-base leading-8 text-[#454b44]">
            I earned my Ph.D. from the University of Southern California, where my research
            focused on theoretical optimization problems and algorithmic methods. I have 8
            years of industry experience spanning product-facing machine learning models and AI
            platform infrastructure, including recommendation systems, ads models, notification
            optimization, and recent work on LLM post-training, serving frameworks, and
            performance optimization.
          </p>
          <p className="mt-4 font-mono text-sm text-[#61685f]">
            Contact:{' '}
            <a
              href="mailto:ssydyc@gmail.com"
              className="font-medium text-[#0f766e] transition-colors hover:text-[#0b5f59]"
            >
              ssydyc@gmail.com
            </a>
          </p>
        </section>

        {/* Timeline */}
        <div className="relative max-w-5xl mx-auto">
          {/* Center line */}
          <div
            className="absolute bottom-0 left-1/2 top-0 w-px bg-[#958979]"
            style={{
              opacity: isVisible ? 1 : 0,
              transform: isVisible ? 'scaleY(1)' : 'scaleY(0)',
              transformOrigin: 'top',
              transition: 'all 0.8s ease-out'
            }}
          />

          {/* Cards */}
          {timelineData.map((item, index) => (
            <TimelineCard key={index} item={item} index={index} isVisible={isVisible} />
          ))}
        </div>
      </div>
    </div>
  );
}
