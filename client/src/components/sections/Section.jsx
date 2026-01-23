import Container from "../ui/Container";

export default function Section({ title, subtitle, children }) {
  return (
    <section className="py-12">
      <Container>
        {title ? (
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-zinc-900">{title}</h2>
            {subtitle ? <p className="mt-2 text-sm text-zinc-600">{subtitle}</p> : null}
          </div>
        ) : null}
        {children}
      </Container>
    </section>
  );
}
