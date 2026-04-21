const STATS: { value: string; label: string; description: string }[] = [
  {
    value: "13 px",
    label: "Gęstość tekstu",
    description: "Linear-level density w całej aplikacji. Zero rozdęcia.",
  },
  {
    value: "1 akcent",
    label: "Jeden kolor",
    description: "Indigo dla fokusu i akcji. Nigdy dekoracja.",
  },
  {
    value: "100%",
    label: "Klawiaturą",
    description: "Każda akcja osiągalna bez myszki. Tab, Enter, ESC.",
  },
];

export function LandingStats() {
  return (
    <section className="border-border border-y">
      <div className="divide-border mx-auto grid w-full max-w-[1200px] grid-cols-1 divide-y px-6 sm:px-10 md:grid-cols-3 md:divide-x md:divide-y-0">
        {STATS.map((stat, i) => (
          <div
            key={stat.label}
            className="flex flex-col gap-2 px-0 py-10 sm:py-12 md:px-8"
            data-index={i}
          >
            <p className="text-foreground text-[32px] leading-none font-semibold tracking-[-0.02em] tabular-nums sm:text-[40px]">
              {stat.value}
            </p>
            <p className="text-accent mt-1 text-[10.5px] font-medium tracking-[0.1em] uppercase">
              {stat.label}
            </p>
            <p className="text-muted-foreground text-[13px] leading-[1.55]">{stat.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
