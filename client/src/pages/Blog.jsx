import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import PageHeader from "../components/sections/PageHeader";
import Section from "../components/sections/Section";
import Card from "../components/ui/Card";
import SEO from "../components/SEO.jsx";
import { apiGet, absUrl } from "../lib/api.js";

export default function Blog() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let ok = true;
    (async () => {
      try {
        const data = await apiGet("/api/posts");
        if (ok) setItems(Array.isArray(data.items) ? data.items : []);
      } finally {
        if (ok) setLoading(false);
      }
    })();
    return () => (ok = false);
  }, []);

  return (
    <main>
      <SEO
        title="Blog"
        description="Artikuj turistikë dhe kulturorë për shtegun Levan–Shtyllas–Apolloni."
        lang="sq"
      />

      <PageHeader
        kicker="Blog"
        title="Artikuj"
        subtitle="Histori, vende dhe këshilla për vizitorët."
      />

      <Section title="" subtitle="">
        {loading ? (
          <div className="text-sm text-zinc-600">Loading…</div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((p) => {
              const title = (p.title_sq || "").trim();
              const excerpt = (p.excerpt_sq || "").trim();

              return (
                <Card key={p._id || p.slug} className="overflow-hidden p-0">
                  {p.coverImageUrl ? (
                    <img
                      src={absUrl(p.coverImageUrl)}
                      alt={title || "Cover"}
                      className="h-40 w-full object-cover"
                      loading="lazy"
                    />
                  ) : null}

                  <div className="p-4">
                    <div className="text-xs text-zinc-500">
                      {p.category || "General"}
                    </div>

                    <h3 className="mt-1 text-base font-semibold">
                      {title || "Pa titull"}
                    </h3>

                    <p className="mt-2 text-[13px] text-zinc-600">
                      {excerpt || ""}
                    </p>

                    <div className="mt-4">
                      <Link className="btn btn-primary" to={`/blog/${p.slug}`}>
                        Lexo
                      </Link>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </Section>
    </main>
  );
}

// ------------------ Ardit Code Change ------------------
// import SEO from "../components/SEO";
// import PageHeader from "../components/sections/PageHeader";
// import Section from "../components/sections/Section";

// export default function BlogProject() {
//   return (
//     <main>
//       <SEO
//         title="Krijimi i Projektit – Sekretet e Harrësës"
//         description="Si u ndërtua platforma turistike-kulturore me MERN Stack."
//         lang="sq"
//       />

//       <PageHeader
//         kicker="Projekt Shkollor"
//         title="Si u Ndërtua Platforma “Sekretet e Harrësës”"
//         subtitle="Nga ideja deri në implementim me MERN Stack."
//       />

//         <Section>
//           <article className="mx-auto max-w-4xl space-y-14">

       

//             {/* Section 1 */}
//             <div className="space-y-6">
//               <h3 className="text-2xl font-semibold text-zinc-800">
//                 1. Ideja e Projektit
//               </h3>

//               <p className="text-zinc-600 leading-relaxed text-[17px]">
//                 Projekti “Sekretet e Harrësës” u krijua për të promovuar trashëgiminë
//                 kulturore përmes teknologjisë digjitale. Qëllimi ishte ndërtimi i
//                 një platforme turistike moderne dhe interaktive.
//               </p>

//               <div className="mx-auto max-w-2xl rounded-2xl bg-white shadow-lg p-4">
//                 <img
//                   src="/blog/m2.jpeg"
//                   alt="Struktura e projektit"
//                   className="w-full rounded-xl object-cover"
//                 />
//               </div>
//             </div>

//             {/* Section 2 */}
//             <div className="space-y-6">
//               <h3 className="text-2xl font-semibold text-zinc-800">
//                 2. Struktura MERN Stack
//               </h3>

//               <p className="text-zinc-600 leading-relaxed text-[17px]">
//                 Aplikacioni u ndërtua duke përdorur MERN Stack:
//               </p>

//               <ul className="space-y-2 text-zinc-600 text-[16px]">
//                 <li><strong>MongoDB</strong> – Ruajtja e të dhënave</li>
//                 <li><strong>Express.js</strong> – Ndërtimi i REST API</li>
//                 <li><strong>React.js</strong> – Ndërfaqja e përdoruesit</li>
//                 <li><strong>Node.js</strong> – Server dhe logjika</li>
//               </ul>

//               <div className="mx-auto max-w-2xl rounded-2xl bg-white shadow-lg p-4">
//                 <img
//                   src="/blog/m12.jpeg"
//                   alt="Node.js"
//                   className="w-full rounded-xl object-cover"
//                 />
//               </div>
//             </div>

//             {/* Section 3 */}
//             <div className="space-y-6">
//               <h3 className="text-2xl font-semibold text-zinc-800">
//                 3. Implementimi i Hartës Interaktive
//               </h3>

//               <p className="text-zinc-600 leading-relaxed text-[17px]">
//                 U përdor Leaflet për krijimin e hartës interaktive ku përdoruesit
//                 mund të klikojnë pika turistike dhe të hapin artikujt përkatës.
//               </p>

//               <div className="mx-auto max-w-2xl rounded-2xl bg-white shadow-lg p-4">
//                 <img
//                   src="/blog/m9.jpeg"
//                   alt="Harta interaktive"
//                   className="w-full rounded-xl object-cover"
//                 />
//               </div>
//             </div>

//             {/* Section 4 */}
//             <div className="space-y-6">
//               <h3 className="text-2xl font-semibold text-zinc-800">
//                 4. Paneli Admin & REST API
//               </h3>

//               <p className="text-zinc-600 leading-relaxed text-[17px]">
//                 U implementua autentikim me JWT dhe funksionalitet CRUD për
//                 menaxhimin e artikujve.
//               </p>

//               <div className="mx-auto max-w-2xl rounded-2xl bg-white shadow-lg p-4">
//                 <img
//                   src="/blog/m18.jpeg"
//                   alt="Admin Panel"
//                   className="w-full rounded-xl object-cover"
//                 />
//               </div>
//             </div>

//             {/* Conclusion */}
//             <div className="space-y-6 text-center pt-8 border-t">
//               <h3 className="text-2xl font-semibold text-zinc-800">
//                 Përfundim
//               </h3>

//               <p className="text-zinc-600 leading-relaxed text-[17px] max-w-2xl mx-auto">
//                 Ky projekt demonstron ndërtimin e një aplikacioni full-stack me
//                 arkitekturë të pastër, REST API funksionale dhe ndërfaqe moderne.
//               </p>
//             </div>

//           </article>
//         </Section>
//     </main>
//   );
// }