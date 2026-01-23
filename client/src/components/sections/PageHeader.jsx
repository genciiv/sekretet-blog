import Container from "../ui/Container";

export default function PageHeader({ kicker, title, subtitle, right }) {
  return (
    <div className="border-b border-zinc-200 bg-white">
      <Container className="py-10">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            {kicker ? <div className="badge">{kicker}</div> : null}
            <h1 className="mt-3 text-3xl font-semibold tracking-tight text-zinc-900 md:text-4xl">
              {title}
            </h1>
            {subtitle ? <p className="mt-3 max-w-2xl text-base text-zinc-600">{subtitle}</p> : null}
          </div>
          {right ? <div className="flex items-center gap-3">{right}</div> : null}
        </div>
      </Container>
    </div>
  );
}
