import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const ITEMS: { value: string; question: string; answer: string }[] = [
  {
    value: "who",
    question: "Dla kogo jest Cliently?",
    answer:
      "Dla freelancerów, studiów i małych zespołów (1–10 osób) prowadzących własną listę klientów. Jeżeli dziś ciągniesz kontakty w arkuszu i zaczyna to boleć — to najprawdopodobniej jesteś w grupie docelowej.",
  },
  {
    value: "security",
    question: "Czy moje dane są bezpieczne?",
    answer:
      "Tak. Dane szyfrowane at-rest i in-transit, codzienne kopie zapasowe, logowanie przez Better-Auth z opcją SSO (Google, GitHub). Infrastruktura w UE — żadne dane nie opuszczają Europy.",
  },
  {
    value: "team",
    question: "Czy mogę zaprosić zespół?",
    answer:
      "Od pierwszego dnia. Jedno konto może należeć do wielu organizacji, każda organizacja ma odseparowane dane, a zaproszenia wysyłasz e-mailem w dwa kliknięcia. Role admin i member wystarczają dla większości zespołów — zaawansowane uprawnienia dodamy gdy zgłosicie taką potrzebę.",
  },
  {
    value: "beta",
    question: "Jak długo trwa beta?",
    answer:
      "Planujemy wyjście z bety na koniec Q3 2026. Użytkownicy beta otrzymują dożywotni rabat na płatny plan — bez względu na to, jaki będzie ostateczny cennik.",
  },
  {
    value: "export",
    question: "Czy mogę wyeksportować swoje dane?",
    answer:
      "Zawsze. Eksport do CSV jednym klikiem — klienci, notatki, status, daty. Jeśli kiedykolwiek zechcesz odejść, zabierasz wszystko ze sobą.",
  },
  {
    value: "integrations",
    question: "Jakie integracje są planowane?",
    answer:
      "Na roadmapie: e-mail (wysyłka i synchronizacja wątków), Slack (powiadomienia o zmianach), kalendarz (follow-upy). Aktualnie skupiamy się na tym, żeby CRM był bardzo dobry — integracje dochodzą zaraz po.",
  },
];

export function LandingFaq() {
  return (
    <section id="faq" className="border-border border-t">
      <div className="mx-auto w-full max-w-[860px] px-6 py-20 sm:px-10 sm:py-28">
        <header className="max-w-[640px]">
          <span className="text-accent text-[10.5px] font-medium tracking-[0.1em] uppercase">
            FAQ
          </span>
          <h2 className="text-foreground mt-3 text-[26px] leading-[1.15] font-semibold tracking-[-0.015em] sm:text-[34px]">
            Pytania, które padają najczęściej.
          </h2>
          <p className="text-muted-foreground mt-4 text-[14.5px] leading-[1.6] sm:text-[15.5px]">
            Brakuje Twojego? Napisz do nas — odpowiemy tym samym dniem.
          </p>
        </header>

        <div className="mt-10">
          <Accordion type="single" collapsible>
            {ITEMS.map((item) => (
              <AccordionItem key={item.value} value={item.value}>
                <AccordionTrigger>{item.question}</AccordionTrigger>
                <AccordionContent>{item.answer}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
}
