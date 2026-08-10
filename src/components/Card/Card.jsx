import React, { useEffect, useState } from 'react';
import { CardPropTypes } from './Card.types';
import ProgressBar from '../ProgressBar/ProgressBar';

const _stripMarkdown = (text) => {
  if (!text) {
    return '';
  }
  return text.replace(/#/g, '');
};

const _useAnimatedProgress = (progress) => {
  const [animatedProgress, setAnimatedProgress] = useState(0);

  useEffect(() => {
    if (typeof progress === 'number') {
      setAnimatedProgress(progress);
    }
  }, [progress]);

  return animatedProgress;
};

const Card = React.memo(
  ({
    itemId,
    title,
    image,
    isLocked,
    description,
    topic,
    author,
    containImage = true,
    isCarousel = false,
    progress = null
  }) => {
    const showImage = image && (containImage || isCarousel);
    const animatedProgress = _useAnimatedProgress(progress);

    return (
      <article
        data-item-id={itemId}
        aria-label={isLocked ? `Locked: ${title}` : title}
        className={[
          'w-full px-4 sm:max-w-[300px] md:max-w-[230px] lg:max-w-none group flex flex-col flex-shrink-0 overflow-hidden rounded-md',
          'border border-slate-100 bg-surface',
          'shadow-card transition-all duration-slow ease-smooth',
          'hover:-translate-y-1 hover:border-brand-primary/30 hover:shadow-elevated',
          'focus-visible:outline-2 focus-visible:outline-brand-primary focus-visible:outline-offset-2',
          'active:scale-[0.98] active:transition-transform active:duration-fast min-h-[260px] h-full',
          isCarousel ? 'w-full max-w-[400px] min-w-[260px]' : 'w-72 sm:w-80'
        ].join(' ')}
        tabIndex={0}
        role="link"
      >
        {/* Image */}
        {showImage && (
          <div
            className={['py-4 relative overflow-hidden rounded-md', isCarousel ? 'aspect-[4/3]' : 'aspect-video'].join(
              ' '
            )}
          >
            <img
              alt={title}
              src={image}
              loading="lazy"
              className={[
                'h-full w-full object-cover',
                isLocked && 'blur-md',
                'transition-transform duration-slower ease-smooth'
              ].join(' ')}
            />
            {isLocked && (
              <div className="absolute inset-0 flex items-center justify-center bg-ink-primary/40 backdrop-blur-sm">
                <svg
                  className="h-8 w-8 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                  />
                </svg>
              </div>
            )}
          </div>
        )}

        <div className="pt-4 pb-3">
          <h3 className="font-heading text-base font-semibold text-ink-primary line-clamp">{title}</h3>
          {author && <p className="mt-1 font-body text-xs font-medium text-ink-secondary">{author}</p>}
        </div>

        {description && (
          <div className="flex-1">
            <p className="font-body text-sm leading-relaxed text-ink-secondary line-clamp-3">
              {_stripMarkdown(description)}
            </p>
          </div>
        )}

        {/* Footer: Topic Badge */}
        {topic && (
          <div className="mt-auto pt-4 pb-4">
            <span className="inline-block rounded-full bg-brand-primary/10 px-2.5 py-1 font-body text-2xs font-bold uppercase tracking-wider text-brand-primary">
              {topic}
            </span>
          </div>
        )}

        {/* Footer: Progress */}
        {typeof progress === 'number' && (
          <ProgressBar progress={progress} title={title} animatedProgress={animatedProgress} />
        )}
      </article>
    );
  }
);

Card.displayName = 'Card';
Card.propTypes = CardPropTypes;

export default Card;
