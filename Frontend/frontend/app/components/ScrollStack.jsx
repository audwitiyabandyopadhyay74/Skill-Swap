"use client";
import React, { useEffect, useRef, useCallback } from 'react';

export const ScrollStackItem = ({ children, itemClassName = '' }) => (
  <div
    className={`scroll-stack-card relative w-full my-6 p-8 md:p-12 rounded-[32px] md:rounded-[40px] shadow-[0_20px_50px_rgba(0,0,0,0.5)] box-border origin-top will-change-transform ${itemClassName}`.trim()}
    style={{
      backfaceVisibility: 'hidden',
      WebkitBackfaceVisibility: 'hidden',
      transformStyle: 'preserve-3d'
    }}
  >
    {children}
  </div>
);

const ScrollStack = ({
  children,
  className = '',
  itemDistance = 60,
  itemScale = 0.04,
  itemStackDistance = 24,
  stackPosition = '20%',
  scaleEndPosition = '15%',
  baseScale = 0.85,
  rotationAmount = 0,
  blurAmount = 0,
  useWindowScroll = true,
  onStackComplete
}) => {
  const scrollerRef = useRef(null);
  const stackCompletedRef = useRef(false);
  const rafIdRef = useRef(null);
  const cardsRef = useRef([]);

  const parsePercentage = useCallback((value, containerHeight) => {
    if (typeof value === 'string' && value.includes('%')) {
      return (parseFloat(value) / 100) * containerHeight;
    }
    return parseFloat(value) || 0;
  }, []);

  const getElementOffset = useCallback((element) => {
    if (!element) return 0;
    const rect = element.getBoundingClientRect();
    return rect.top + window.scrollY;
  }, []);

  const updateCardTransforms = useCallback(() => {
    const scroller = scrollerRef.current;
    if (!scroller) return;

    const cards = cardsRef.current;
    if (!cards.length) return;

    const scrollTop = window.scrollY;
    const containerHeight = window.innerHeight;
    const stackPositionPx = parsePercentage(stackPosition, containerHeight);
    const scaleEndPositionPx = parsePercentage(scaleEndPosition, containerHeight);

    const endElement = scroller.querySelector('.scroll-stack-end');
    const endElementTop = endElement ? getElementOffset(endElement) : 0;

    cards.forEach((card, i) => {
      if (!card) return;

      const cardTop = getElementOffset(card);
      const triggerStart = cardTop - stackPositionPx - itemStackDistance * i;
      const triggerEnd = cardTop - scaleEndPositionPx;
      const pinStart = cardTop - stackPositionPx - itemStackDistance * i;
      const pinEnd = endElementTop - containerHeight / 2;

      // Calculate scale progress
      let scaleProgress = 0;
      if (scrollTop > triggerStart && triggerEnd > triggerStart) {
        scaleProgress = Math.min(1, Math.max(0, (scrollTop - triggerStart) / (triggerEnd - triggerStart)));
      } else if (scrollTop >= triggerEnd) {
        scaleProgress = 1;
      }

      const targetScale = baseScale + i * itemScale;
      const scale = Math.max(0.7, 1 - scaleProgress * (1 - targetScale));
      const rotation = rotationAmount ? i * rotationAmount * scaleProgress : 0;

      let blur = 0;
      if (blurAmount) {
        let topCardIndex = 0;
        for (let j = 0; j < cards.length; j++) {
          if (!cards[j]) continue;
          const jCardTop = getElementOffset(cards[j]);
          const jTriggerStart = jCardTop - stackPositionPx - itemStackDistance * j;
          if (scrollTop >= jTriggerStart) {
            topCardIndex = j;
          }
        }
        if (i < topCardIndex) {
          blur = Math.min(10, (topCardIndex - i) * blurAmount);
        }
      }

      let translateY = 0;
      if (scrollTop >= pinStart && scrollTop <= pinEnd) {
        translateY = scrollTop - cardTop + stackPositionPx + itemStackDistance * i;
      } else if (scrollTop > pinEnd) {
        translateY = pinEnd - cardTop + stackPositionPx + itemStackDistance * i;
      }

      // Apply GPU-accelerated transform
      const transform = `translate3d(0, ${Math.round(translateY * 10) / 10}px, 0) scale(${Math.round(scale * 1000) / 1000}) rotate(${Math.round(rotation * 10) / 10}deg)`;
      const filter = blur > 0 ? `blur(${Math.round(blur * 10) / 10}px)` : 'none';

      card.style.transform = transform;
      card.style.filter = filter;

      if (i === cards.length - 1) {
        const isInView = scrollTop >= pinStart && scrollTop <= pinEnd;
        if (isInView && !stackCompletedRef.current) {
          stackCompletedRef.current = true;
          onStackComplete?.();
        } else if (!isInView && stackCompletedRef.current) {
          stackCompletedRef.current = false;
        }
      }
    });
  }, [
    itemScale,
    itemStackDistance,
    stackPosition,
    scaleEndPosition,
    baseScale,
    rotationAmount,
    blurAmount,
    onStackComplete,
    parsePercentage,
    getElementOffset
  ]);

  useEffect(() => {
    const scroller = scrollerRef.current;
    if (!scroller) return;

    // Scope cards query to this scroller only
    const cards = Array.from(scroller.querySelectorAll('.scroll-stack-card'));
    cardsRef.current = cards;

    cards.forEach((card, i) => {
      if (i < cards.length - 1) {
        card.style.marginBottom = `${itemDistance}px`;
      }
      card.style.willChange = 'transform, filter';
      card.style.transformOrigin = 'top center';
      card.style.transform = 'translate3d(0,0,0)';
    });

    const onScrollOrResize = () => {
      if (rafIdRef.current) cancelAnimationFrame(rafIdRef.current);
      rafIdRef.current = requestAnimationFrame(updateCardTransforms);
    };

    // Initial calculation
    updateCardTransforms();

    window.addEventListener('scroll', onScrollOrResize, { passive: true });
    window.addEventListener('resize', onScrollOrResize, { passive: true });

    return () => {
      window.removeEventListener('scroll', onScrollOrResize);
      window.removeEventListener('resize', onScrollOrResize);
      if (rafIdRef.current) cancelAnimationFrame(rafIdRef.current);
    };
  }, [itemDistance, updateCardTransforms]);

  return (
    <div className={`relative w-full ${className}`.trim()} ref={scrollerRef}>
      <div className="scroll-stack-inner pt-12 md:pt-[15vh] px-4 md:px-12 lg:px-20 pb-48 md:pb-[20rem]">
        {children}
        <div className="scroll-stack-end w-full h-px opacity-0 pointer-events-none" />
      </div>
    </div>
  );
};

export default ScrollStack;
