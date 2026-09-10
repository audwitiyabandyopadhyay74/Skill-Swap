"use client";
import React from 'react';

export const ScrollStackItem = ({ children, itemClassName = '', style = {} }) => (
  <div
    className={`scroll-stack-card sticky w-full p-8 md:p-12 rounded-[32px] md:rounded-[40px] shadow-[0_30px_60px_rgba(0,0,0,0.6)] box-border transition-all duration-300 ${itemClassName}`.trim()}
    style={{
      backfaceVisibility: 'hidden',
      WebkitBackfaceVisibility: 'hidden',
      ...style,
    }}
  >
    {children}
  </div>
);

const ScrollStack = ({
  children,
  className = '',
}) => {
  const childrenArray = React.Children.toArray(children);

  return (
    <div className={`relative w-full ${className}`.trim()}>
      <div className="scroll-stack-inner pt-8 md:pt-[8vh] px-4 md:px-12 lg:px-20 pb-24 md:pb-32 space-y-10">
        {childrenArray.map((child, i) => {
          if (!React.isValidElement(child)) return child;

          // Header or non-stack item
          if (child.type !== ScrollStackItem) {
            return child;
          }

          // Calculate sticky top offset for cards
          // Card 1 sticks at 120px, Card 2 at 150px, Card 3 at 180px
          const cardIndex = childrenArray.slice(0, i).filter(c => React.isValidElement(c) && c.type === ScrollStackItem).length;
          const stickyTop = 120 + cardIndex * 36;

          return React.cloneElement(child, {
            style: {
              position: 'sticky',
              top: `${stickyTop}px`,
              zIndex: cardIndex + 10,
              ...child.props.style,
            },
          });
        })}
      </div>
    </div>
  );
};

export default ScrollStack;
