import Container from "../ui/Container";

export default function Section({ title, subtitle, children }) {
  return (
    <section className="py-10">
      <Container>
        {title ? (
          <div className="mb-5">
            {/* ↓ më normal */}
            <h2 className="text-lg font-semibold text-zinc-900">{title}</h2>
            {subtitle ? (
              <p className="mt-2 text-sm leading-6 text-zinc-600">{subtitle}</p>
            ) : null}
          </div>
        ) : null}
        {children}
      </Container>
    </section>
  );
}
