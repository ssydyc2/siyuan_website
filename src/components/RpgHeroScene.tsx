import aboutClouds from '../assets/hero/about-clouds-v4.webp';
import aboutRestingTraveler from '../assets/hero/about-resting-traveler-v4.webp';
import aboutRpgBackground from '../assets/hero/about-rpg-background-v5.webp';
import aboutRpgBackground960 from '../assets/hero/about-rpg-background-v5-960w.webp';
import aboutRpgBackground1440 from '../assets/hero/about-rpg-background-v5-1440w.webp';
import blogEnchantedPageStrip from '../assets/hero/blog-enchanted-page-strip-v1.webp';
import blogMageBackground from '../assets/hero/blog-mage-background-v2.webp';
import blogMageBackground960 from '../assets/hero/blog-mage-background-v2-960w.webp';
import blogMageBackground1440 from '../assets/hero/blog-mage-background-v2-1440w.webp';
import blogMageCastStrip from '../assets/hero/blog-mage-cast-strip-v1.webp';
import readingArchiveFolio from '../assets/hero/reading-archive-folio.webp';
import readingArchiveUnfoldStrip from '../assets/hero/reading-archive-unfold-strip.webp';
import readingRpgBackground from '../assets/hero/reading-rpg-background-v3.webp';
import readingRpgBackground960 from '../assets/hero/reading-rpg-background-v3-960w.webp';
import readingRpgBackground1440 from '../assets/hero/reading-rpg-background-v3-1440w.webp';

export type RpgHeroSceneVariant = 'about' | 'reading' | 'study';

interface RpgHeroSceneProps {
  variant: RpgHeroSceneVariant;
}

interface SceneSource {
  src: string;
  srcSet: string;
}

const heroImageSizes = '(max-width: 640px) 185vw, (max-width: 960px) 106vw, 950px';

const sceneSources: Record<RpgHeroSceneVariant, SceneSource> = {
  about: {
    src: aboutRpgBackground,
    srcSet: `${aboutRpgBackground960} 960w, ${aboutRpgBackground1440} 1440w, ${aboutRpgBackground} 1935w`,
  },
  reading: {
    src: readingRpgBackground,
    srcSet: `${readingRpgBackground960} 960w, ${readingRpgBackground1440} 1440w, ${readingRpgBackground} 1896w`,
  },
  study: {
    src: blogMageBackground,
    srcSet: `${blogMageBackground960} 960w, ${blogMageBackground1440} 1440w, ${blogMageBackground} 1896w`,
  },
};

const ambientParticleCount = 8;

function AboutSubject() {
  return (
    <>
      <span className="rpg-hero__cloud-field">
        <img
          src={aboutClouds}
          alt=""
          className="rpg-hero__clouds rpg-hero__clouds--far"
          draggable="false"
        />
        <img
          src={aboutClouds}
          alt=""
          className="rpg-hero__clouds rpg-hero__clouds--near"
          draggable="false"
        />
      </span>
      <img
        src={aboutRestingTraveler}
        alt=""
        className="rpg-hero__resting-traveler"
        decoding="async"
        draggable="false"
      />
    </>
  );
}

function ReadingArchiveSubject() {
  return (
    <span className="rpg-hero__archive">
      <span className="rpg-hero__archive-shelf-glow" />
      <span className="rpg-hero__archive-flight">
        <img
          src={readingArchiveFolio}
          alt=""
          className="rpg-hero__archive-folio"
          decoding="async"
          draggable="false"
        />
        <span className="rpg-hero__archive-motes">
          {Array.from({ length: 4 }, (_, index) => (
            <span key={index} />
          ))}
        </span>
      </span>
      <span className="rpg-hero__archive-landing">
        <img
          src={readingArchiveUnfoldStrip}
          alt=""
          className="rpg-hero__archive-unfold-strip"
          decoding="async"
          draggable="false"
        />
      </span>
    </span>
  );
}

function BlogSpellwritingSubject() {
  return (
    <span className="rpg-hero__spellwriting">
      <span className="rpg-hero__spellwriting-mage">
        <img
          src={blogMageCastStrip}
          alt=""
          className="rpg-hero__spellwriting-mage-strip"
          decoding="async"
          draggable="false"
        />
      </span>
      <span className="rpg-hero__spellwriting-page">
        <img
          src={blogEnchantedPageStrip}
          alt=""
          className="rpg-hero__spellwriting-page-strip rpg-hero__spellwriting-page-strip--base"
          decoding="async"
          draggable="false"
        />
        <img
          src={blogEnchantedPageStrip}
          alt=""
          className="rpg-hero__spellwriting-page-strip rpg-hero__spellwriting-page-strip--progress"
          decoding="async"
          draggable="false"
        />
      </span>
      <span className="rpg-hero__spellwriting-glyphs">
        {Array.from({ length: 6 }, (_, index) => (
          <span key={index} />
        ))}
      </span>
    </span>
  );
}

export default function RpgHeroScene({ variant }: RpgHeroSceneProps) {
  const scene = sceneSources[variant];

  return (
    <div className={`rpg-hero rpg-hero--${variant}`} aria-hidden="true">
      <div className="rpg-hero__camera">
        <div className="rpg-hero__stage">
          <img
            src={scene.src}
            srcSet={scene.srcSet}
            sizes={heroImageSizes}
            alt=""
            className="rpg-hero__image"
            decoding="async"
            draggable="false"
            fetchPriority="high"
          />
          {variant === 'about' && <AboutSubject />}
          {variant === 'reading' && <ReadingArchiveSubject />}
          {variant === 'study' && <BlogSpellwritingSubject />}
          {variant === 'about' && (
            <span className="rpg-hero__particles">
              {Array.from({ length: ambientParticleCount }, (_, index) => (
                <span key={index} />
              ))}
            </span>
          )}
        </div>
      </div>
      <span className="rpg-hero__glow" />
      <span className="rpg-hero__vignette" />
    </div>
  );
}
