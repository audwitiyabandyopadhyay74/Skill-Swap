"use client";
import React, { useEffect, useRef, useCallback } from 'react';

export const ScrollStackItem = ({ children, itemClassName = '' }) => (
  <div
    className={`scroll-stack-card relative w-full my-6 p-8 md:p-12 rounded-[32px] md:rounded-[40px] shadow-[0_20px_50px_rgba(0,0,0,0.5)] box-border origin-top ${itemClassName}`.trim()}
    style={{
      backfaceVisibility: 'hidden',
      WebkitBackfaceVisibility: 'hidden',
      transformStyle: 'preserve-3d',
      willChange: 'transform, filter',
      transformOrigin: 'top center',
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
  onStackComplete
}) => {
  const scrollerRef = useRef(null);
  const stackCompletedRef = useRef(false);
  const rafIdRef = useRef(null);
  const cardsRef = useRef([]);
  // Cache static offsets — only updated on mount & resize, not during scroll
  const cardOffsetsRef = useRef([]);
  const endOffsetRef = useRef(0);

  const parsePercentage = useCallback((value, containerHeight) => {
    if (typeof value === 'string' && value.includes('%')) {
      return (parseFloat(value) / 100) * containerHeight;
    }
    return parseFloat(value) || 0;
  }, []);

  // Re-measure all card positions (expensive — only called on mount/resize)
  const measureOffsets = useCallback(() => {
    const scroller = scrollerRef.current;
    if (!scroller) return;
    const cards = cardsRef.current;
    cardOffsetsRef.current = cards.map(card =>
      card ? Math.round(card.getBoundingClientRect().top + window.scrollY) : 0
    );
    const endElement = scroller.querySelector('.scroll-stack-end');
    endOffsetRef.current = endElement
      ? Math.round(endElement.getBoundingClientRect().top + window.scrollY)
      : 0;
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
    const cardOffsets = cardOffsetsRef.current;
    const endElementTop = endOffsetRef.current;

    cards.forEach((card, i) => {
      if (!card) return;

      const cardTop = cardOffsets[i] || 0;
      const triggerStart = cardTop - stackPositionPx - itemStackDistance * i;
      const triggerEnd = cardTop - scaleEndPositionPx;
      const pinStart = triggerStart;
      const pinEnd = endElementTop - containerHeight / 2;

      // Scale progress
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
          const jCardTop = cardOffsets[j] || 0;
          const jTriggerStart = jCardTop - stackPositionPx - itemStackDistance * j;
          if (scrollTop >= jTriggerStart) topCardIndex = j;
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

      // Round aggressively to prevent sub-pixel jitter
      const ty = Math.round(translateY);
      const sc = Math.round(scale * 1000) / 1000;
      const ro = Math.round(rotation * 10) / 10;

      card.style.transform = `translate3d(0, ${ty}px, 0) scale(${sc}) rotate(${ro}deg)`;
      card.style.filter = blur > 0 ? `blur(${Math.round(blur)}px)` : 'none';

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
  ]);

  useEffect(() => {
    const scroller = scrollerRef.current;
    if (!scroller) return;

    const cards = Array.from(scroller.querySelectorAll('.scroll-stack-card'));
    cardsRef.current = cards;

    cards.forEach((card, i) => {
      if (i < cards.length - 1) {
        card.style.marginBottom = `${itemDistance}px`;
      }
    });

    // Initial measure + render
    measureOffsets();
    updateCardTransforms();

    const onScroll = () => {
      if (rafIdRef.current) cancelAnimationFrame(rafIdRef.current);
      rafIdRef.current = requestAnimationFrame(updateCardTransforms);
    };

    const onResize = () => {
      // Re-measure positions whenever layout changes
      measureOffsets();
      updateCardTransforms();
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onResize, { passive: true });

    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onResize);
      if (rafIdRef.current) cancelAnimationFrame(rafIdRef.current);
    };
  }, [itemDistance, updateCardTransforms, measureOffsets]);

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
