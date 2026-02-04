// FILE: client/src/pages/About.jsx
import SEO from "../components/SEO.jsx";
import Section from "../components/sections/Section.jsx";
import Card from "../components/ui/Card.jsx";
import { useI18n } from "../i18n/i18n.jsx";
import { Link } from "react-router-dom";

function Block({ title, children }) {
  return (
    <Card className="p-6">
      <div className="text-sm font-semibold text-zinc-900">{title}</div>
      <div className="mt-2 text-sm leading-6 text-zinc-600">{children}</div>
    </Card>
  );
}

export default function About() {
  const { lang } = useI18n();
  const isSQ = lang === "sq";

  const pageTitle = isSQ ? "Rreth nesh" : "About";
  const pageDesc = isSQ
    ? "Dokumentim i shkurtuar publik i projektit 'Sekretet e Harresës' për shtegun Levan–Shtyllas–Apolloni."
    : "Public project overview for 'Secrets of Harresë' (Levan–Shtyllas–Apollonia trail).";

  return (
    <main className="mx-auto max-w-6xl px-4 py-12">
      <SEO title={pageTitle} description={pageDesc} lang={lang} />

      {/* HERO */}
      <div className="max-w-3xl">
        <div className="inline-flex items-center gap-2 rounded-full border border-zinc-200 bg-white px-4 py-2 text-xs font-semibold text-zinc-700">
          <span className="h-2 w-2 rounded-full bg-zinc-900" />
          {isSQ ? "Projekt shkencor / digjital" : "Science / digital project"}
        </div>

        <h1 className="mt-5 text-3xl font-semibold tracking-tight text-zinc-900 md:text-4xl">
          {isSQ ? "Sekretet e Harresës" : "Secrets of Harresë"}
        </h1>

        <p className="mt-4 text-sm leading-6 text-zinc-600">{pageDesc}</p>

        <div className="mt-6 flex flex-wrap gap-2">
          <Link to="/trail" className="btn btn-primary">
            {isSQ ? "Shiko Shtegun" : "Explore Trail"}
          </Link>
          <Link to="/map" className="btn btn-outline">
            {isSQ ? "Harta Interaktive" : "Interactive Map"}
          </Link>
          <Link to="/blog" className="btn btn-outline">
            {isSQ ? "Artikujt" : "Articles"}
          </Link>
        </div>
      </div>

      {/* STRUKTURË “SI DOKUMENTI” */}
      <Section
        title={isSQ ? "1) Përshkrimi i shkurtër i projektit" : "1) Project summary"}
        subtitle={isSQ ? "Ideja kryesore dhe qëllimi." : "Main idea and purpose."}
      >
        <Card className="p-6">
          <p className="text-sm leading-6 text-zinc-600">
            {isSQ ? (
              <>
                “Sekretet e Harresës” është një projekt digjital me fokus në
                promovimin e shtegut turistik-kulturor <b>Levan–Shtyllas–Apolloni</b>.
                Projekti ndërthur kërkimin mbi trashëgiminë lokale me një platformë
                online ku publikohen artikuj, foto dhe informacione të strukturuara
                për pikat kryesore (natyrë, histori, arkeologji) dhe një hartë
                interaktive për orientim. Qëllimi është të krijohet një burim i
                kuptueshëm dhe praktik për vizitorët, nxënësit dhe komunitetin,
                duke rritur ndërgjegjësimin dhe interesin për zonat me vlerë
                kulturore e natyrore.
              </>
            ) : (
              <>
                “Secrets of Harresë” is a digital project promoting the{" "}
                <b>Levan–Shtyllas–Apollonia</b> cultural route. It combines heritage
                research with an online platform where articles, photos and
                structured information are published, plus an interactive map for
                navigation. The goal is to provide a clear and practical resource
                for visitors, students and the local community.
              </>
            )}
          </p>
        </Card>
      </Section>

      <Section
        title={isSQ ? "2) Problemi / pyetja kërkimore" : "2) Problem / research question"}
        subtitle={
          isSQ
            ? "Çfarë adreson projekti dhe pse është i rëndësishëm."
            : "What the project addresses and why it matters."
        }
      >
        <div className="grid gap-4 md:grid-cols-2">
          <Block title={isSQ ? "Problemi" : "Problem"}>
            {isSQ ? (
              <>
                Informacioni për pikat turistike-kulturore shpesh është i shpërndarë,
                jo i strukturuar dhe jo i lehtë për t’u përdorur nga vizitorët dhe
                nxënësit. Shumë vende kanë vlera reale, por mungon një platformë e
                qartë që t’i prezantojë me përmbajtje të verifikuar, foto dhe
                udhëzime orientimi.
              </>
            ) : (
              <>
                Heritage and route information is often scattered, unstructured and
                hard to use for visitors and students. Valuable sites exist, but
                they lack a clear platform with verified content, photos and
                navigation guidance.
              </>
            )}
          </Block>

          <Block title={isSQ ? "Konteksti & rëndësia" : "Context & importance"}>
            {isSQ ? (
              <>
                Problemi shfaqet në komunitet dhe në shkollë: vizitorët kërkojnë
                udhëzim praktik, ndërsa nxënësit kanë nevojë për burime të sakta
                për projekte dhe mësim. Zgjidhja ndihmon në promovimin e turizmit,
                ruajtjen e trashëgimisë dhe zhvillimin e aftësive digjitale.
              </>
            ) : (
              <>
                The issue appears in the community and in school: visitors need
                practical guidance, while students need reliable sources for
                learning and projects. A solution supports tourism promotion,
                heritage awareness and digital skills development.
              </>
            )}
          </Block>
        </div>
      </Section>

      <Section
        title={isSQ ? "3) Qëllimi dhe rezultatet e pritshme" : "3) Goal and expected results"}
        subtitle={isSQ ? "Rezultate konkrete dhe të matshme." : "Concrete, measurable outcomes."}
      >
        <div className="grid gap-4 md:grid-cols-3">
          <Block title={isSQ ? "Qëllimi i përgjithshëm" : "Overall goal"}>
            {isSQ ? (
              <>
                Të krijohet një platformë digjitale e strukturuar për shtegun
                Levan–Shtyllas–Apolloni, me përmbajtje të menaxhueshme nga admini,
                për informim dhe orientim praktik.
              </>
            ) : (
              <>
                Build a structured digital platform for the Levan–Shtyllas–Apollonia
                route with admin-managed content for practical guidance and learning.
              </>
            )}
          </Block>

          <Block title={isSQ ? "Rezultati 1 (i matshëm)" : "Outcome 1 (measurable)"}>
            {isSQ ? (
              <>Publikimi i një seti artikujsh (postime) të kategorizuara dhe të filtrueshme.</>
            ) : (
              <>Publish a set of categorized, filterable articles (posts).</>
            )}
          </Block>

          <Block title={isSQ ? "Rezultati 2 (i matshëm)" : "Outcome 2 (measurable)"}>
            {isSQ ? (
              <>Krijimi i një galerie me foto, etiketa dhe vendndodhje (place/tags).</>
            ) : (
              <>Create a photo gallery with tags and place metadata.</>
            )}
          </Block>
        </div>

        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <Block title={isSQ ? "Rezultati 3 (i matshëm)" : "Outcome 3 (measurable)"}>
            {isSQ ? (
              <>Harta interaktive me pika dhe lidhje drejt artikujve përkatës.</>
            ) : (
              <>Interactive map with markers linked to related posts.</>
            )}
          </Block>

          <Block title={isSQ ? "Rezultati 4 (i matshëm)" : "Outcome 4 (measurable)"}>
            {isSQ ? (
              <>Panel Admin për krijim/ndryshim postimesh, galeri dhe menaxhim kontaktesh.</>
            ) : (
              <>Admin panel to create/edit posts, gallery and manage contact messages.</>
            )}
          </Block>
        </div>
      </Section>

      <Section
        title={isSQ ? "4) Metodologjia e punës" : "4) Methodology"}
        subtitle={
          isSQ
            ? "Hapat, metodat dhe mjetet/teknologjitë e përdorura."
            : "Steps, methods and tools/technologies."
        }
      >
        <div className="grid gap-4 md:grid-cols-2">
          <Block title={isSQ ? "Hapat kryesorë" : "Main steps"}>
            <ul className="list-disc pl-5">
              <li>{isSQ ? "Përcaktimi i temës dhe strukturës së platformës." : "Define topic and platform structure."}</li>
              <li>{isSQ ? "Kërkim dhe grumbullim informacioni për pikat kryesore." : "Research and collect info for key places."}</li>
              <li>{isSQ ? "Zhvillimi i faqes (frontend) dhe API (backend)." : "Develop website (frontend) and API (backend)."}</li>
              <li>{isSQ ? "Testim, përmirësime, publikim dhe mirëmbajtje." : "Test, improve, deploy and maintain."}</li>
            </ul>
          </Block>

          <Block title={isSQ ? "Metodat & mjetet" : "Methods & tools"}>
            <ul className="list-disc pl-5">
              <li>{isSQ ? "Metodë digjitale: platformë web me përmbajtje dinamike." : "Digital method: web platform with dynamic content."}</li>
              <li>{isSQ ? "Metodë kërkimore: përmbledhje burimesh dhe verifikim informacioni." : "Research method: summarize and verify sources."}</li>
              <li>{isSQ ? "Teknologji: React + Router, Node/Express, MongoDB, Multer (upload), JWT (admin)." : "Tech: React + Router, Node/Express, MongoDB, Multer (upload), JWT (admin)."}</li>
            </ul>
          </Block>
        </div>
      </Section>

      <Section
        title={isSQ ? "5) Zhvillimi & rezultatet" : "5) Development & results"}
        subtitle={isSQ ? "Çfarë u ndërtua konkretisht." : "What was built concretely."}
      >
        <div className="grid gap-4 md:grid-cols-3">
          <Block title={isSQ ? "Platforma publike" : "Public website"}>
            {isSQ ? (
              <>
                Ballina me seksione informuese, shteg (preview), antikitet (preview),
                galeri publike dhe hartë interaktive. Postimet shfaqen sipas statusit
                “published”.
              </>
            ) : (
              <>
                Public pages: home sections, trail preview, antiquity preview, gallery
                and interactive map. Posts are displayed when “published”.
              </>
            )}
          </Block>

          <Block title={isSQ ? "Paneli Admin" : "Admin panel"}>
            {isSQ ? (
              <>
                Login admin, menaxhim postimesh, upload/menaxhim galeri, menaxhim
                mesazhesh kontakt (status, reply).
              </>
            ) : (
              <>
                Admin login, post management, gallery upload/management, contact
                messages management (status, reply).
              </>
            )}
          </Block>

          <Block title={isSQ ? "Organizimi i të dhënave" : "Data structure"}>
            {isSQ ? (
              <>
                Postime me kategori, tags (p.sh. place:apollonia, period:roman),
                foto me place/tags, dhe kontakte të ruajtura në MongoDB.
              </>
            ) : (
              <>
                Posts with category/tags (e.g., place:apollonia, period:roman),
                media with place/tags, and contacts saved in MongoDB.
              </>
            )}
          </Block>
        </div>
      </Section>

      <Section
        title={isSQ ? "6) Përfundime & reflektim" : "6) Conclusions & reflection"}
        subtitle={isSQ ? "Çfarë u mësua dhe çfarë përmirësohet." : "What was learned and what improves next."}
      >
        <div className="grid gap-4 md:grid-cols-2">
          <Block title={isSQ ? "Çfarë u arrit" : "What was achieved"}>
            {isSQ ? (
              <>
                U krijua një faqe funksionale me përmbajtje të menaxhueshme, ku
                informacioni paraqitet i strukturuar dhe i përdorshëm. Projekti
                shërben si shembull praktik i ndërthurjes së kërkimit me teknologjinë.
              </>
            ) : (
              <>
                A functional website with manageable content was created, presenting
                information in a structured and usable way. It connects research
                with technology in practice.
              </>
            )}
          </Block>

          <Block title={isSQ ? "Çfarë të përmirësohet" : "What to improve"}>
            <ul className="list-disc pl-5">
              <li>{isSQ ? "Shtim i burimeve të cituara për çdo artikull." : "Add cited sources per article."}</li>
              <li>{isSQ ? "Përmirësim i filtrimit/sortimit dhe kërkimit në postime." : "Improve filtering/sorting and search in posts."}</li>
              <li>{isSQ ? "Shtim video/QR dhe materiale për stendë." : "Add video/QR and booth materials."}</li>
            </ul>
          </Block>
        </div>
      </Section>

      <Section
        title={isSQ ? "7) Ndikimi & zbatueshmëria" : "7) Impact & applicability"}
        subtitle={isSQ ? "Si përdoret projekti në praktikë." : "How it can be used in practice."}
      >
        <div className="grid gap-4 md:grid-cols-3">
          <Block title={isSQ ? "Në shkollë" : "In school"}>
            {isSQ ? (
              <>
                Si platformë burimore për projekte, mësim, kërkim dhe zhvillim aftësish
                digjitale (web, databazë, etikë e burimeve).
              </>
            ) : (
              <>
                As a learning resource for projects, research and digital skills
                (web, database, source ethics).
              </>
            )}
          </Block>

          <Block title={isSQ ? "Në komunitet" : "In community"}>
            {isSQ ? (
              <>
                Ndihmon promovimin e turizmit lokal dhe rrit ndërgjegjësimin për
                trashëgiminë dhe mjedisin.
              </>
            ) : (
              <>
                Supports local tourism and raises awareness about heritage and nature.
              </>
            )}
          </Block>

          <Block title={isSQ ? "Zgjerime" : "Extensions"}>
            <ul className="list-disc pl-5">
              <li>{isSQ ? "Shtim itinerarësh dhe pikash të reja." : "Add more routes and points."}</li>
              <li>{isSQ ? "Përkthim i plotë në EN dhe gjuhë të tjera." : "Full translation to EN and other languages."}</li>
              <li>{isSQ ? "Integrim me statistika vizitash dhe feedback." : "Integrate visit stats and feedback."}</li>
            </ul>
          </Block>
        </div>
      </Section>

      <Section
        title={isSQ ? "8) Burimet & referencat" : "8) Sources & references"}
        subtitle={isSQ ? "Listo burimet e përdorura (plotëso sipas rastit)." : "List used sources (fill as needed)."}
      >
        <Card className="p-6">
          <ul className="list-disc pl-5 text-sm leading-6 text-zinc-600">
            <li>{isSQ ? "Faqe zyrtare / burime lokale (p.sh. institucione kulturore)." : "Official pages / local institutional sources."}</li>
            <li>{isSQ ? "Artikuj, libra, botime mbi Apolloninë/Bylisin/Ardenicën." : "Articles/books about Apollonia/Bylis/Ardenica."}</li>
            <li>{isSQ ? "Harta dhe referenca gjeografike (p.sh. Google Maps) për orientim." : "Map references (e.g., Google Maps) for navigation."}</li>
          </ul>

          <div className="mt-4 rounded-2xl border border-zinc-200 bg-zinc-50 p-4 text-sm text-zinc-700">
            {isSQ ? (
              <>
                Këshillë: Për çdo postim në Blog shto një seksion “Burime” dhe vendos
                linkun/autorët. Kjo e bën dokumentimin më të fortë për festival.
              </>
            ) : (
              <>
                Tip: Add a “Sources” section in each blog post with links/authors
                to strengthen festival documentation.
              </>
            )}
          </div>
        </Card>
      </Section>
    </main>
  );
}
