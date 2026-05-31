type PageHeroProps = {
  image: string;
  imageAlt: string;
  children: React.ReactNode;
  compact?: boolean;
};

export function PageHero({
  image,
  imageAlt,
  children,
  compact = false,
}: PageHeroProps) {
  return (
    <section
      className={`page-hero hero-dark relative ${compact ? "min-h-[220px]" : "min-h-[260px]"} sm:min-h-[300px]`}
      style={{ backgroundImage: `url(${image})` }}
      aria-label={imageAlt}
    >
      <div className="page-hero-overlay absolute inset-0" aria-hidden="true" />
      <div className="relative mx-auto flex max-w-7xl flex-col justify-end px-4 pb-8 pt-24 sm:px-6 sm:pb-10">
        {children}
      </div>
    </section>
  );
}
