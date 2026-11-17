import { ButtonLink } from "@/components/ui/Button";

export default function NotFound() {
  return (
    <section className="grain relative grid min-h-svh place-items-center overflow-hidden bg-ink text-paper">
      <div aria-hidden className="pointer-events-none absolute -top-40 left-1/3 h-[30rem] w-[30rem] rounded-full bg-brand/25 blur-[140px]" />
      <div className="container-x relative z-[2] grid justify-items-center gap-8 py-40 text-center">
        <span className="font-display text-[clamp(6rem,22vw,16rem)] leading-none font-light">
          4<em className="text-mint">0</em>4
        </span>
        <p className="max-w-md text-lg text-fog">This route hasn&rsquo;t been mapped yet. Let&rsquo;s get you back on a trusted one.</p>
        <ButtonLink href="/" size="lg">Back to home</ButtonLink>
      </div>
    </section>
  );
}
