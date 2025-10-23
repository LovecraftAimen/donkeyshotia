
import React from 'react';

const cn = (...classes: (string | boolean | undefined)[]) => classes.filter(Boolean).join(' ');

const BentoGrid = ({
  className,
  children,
}: {
  className?: string;
  children?: React.ReactNode;
}) => {
  return (
    <div
      className={cn(
        "grid md:auto-rows-[18rem] grid-cols-1 md:grid-cols-3 gap-4",
        className
      )}
    >
      {children}
    </div>
  );
};

const BentoGridItem = ({
  className,
  title,
  description,
  header,
}: {
  className?: string;
  title?: string | React.ReactNode;
  description?: string | React.ReactNode;
  header?: React.ReactNode;
  children?: React.ReactNode;
}) => {
  return (
    <div
      className={cn(
        "row-span-1 rounded-xl group/bento hover:shadow-xl transition duration-200 shadow-input dark:shadow-none p-4 dark:bg-black dark:border-white/[0.2] bg-gray-800 border border-transparent justify-between flex flex-col space-y-4",
        className
      )}
    >
      {header}
      <div className="group-hover/bento:translate-x-2 transition duration-200 flex-grow flex flex-col justify-end">
        <div className="font-sans font-bold text-neutral-200 mb-2 mt-2">
          {title}
        </div>
        <div className="font-sans font-normal text-xs text-neutral-300">
          {description}
        </div>
      </div>
    </div>
  );
};

// Re-exporting children from BentoGridItem props because it was passed through.
// A hacky fix, but necessary to allow children prop to be used inside BentoGridItem in App.tsx
const OriginalBentoGridItem = BentoGridItem;
const BentoGridItemWithChildren: React.FC<{
  className?: string;
  title?: string | React.ReactNode;
  description?: string | React.ReactNode;
  header?: React.ReactNode;
  children?: React.ReactNode;
}> = ({ className, title, description, header, children }) => {
  if (children) {
    return (
      <div
        className={cn(
          "row-span-1 rounded-xl group/bento hover:shadow-xl transition duration-200 shadow-input dark:shadow-none p-4 dark:bg-black dark:border-white/[0.2] bg-gray-800 border border-transparent justify-between flex flex-col space-y-0",
          className
        )}
      >
        {children}
      </div>
    );
  }
  return <OriginalBentoGridItem className={className} title={title} description={description} header={header} />;
};


export { BentoGrid, BentoGridItemWithChildren as BentoGridItem };
