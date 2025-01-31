import Container from "@/components/container";
import { urlForImage } from "@/lib/sanity/image";
import Image from "next/image";
import Link from "next/link";
import StructuredData from "@/components/StructuredData";

export default function About({ authors, settings }) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "AboutPage",
    "name": "Sobre a Closer Brasil",
    "description": "Conheça nossa equipe apaixonada e descubra mais sobre a Closer Brasil.",
    "publisher": {
      "@type": "Organization",
      "name": "Closer Brasil",
      "logo": settings?.logo || ""
    },
    "author": authors?.map(author => ({
      "@type": "Person",
      "name": author.name,
      "image": urlForImage(author?.image)?.src || "",
      "url": `/author/${author?.slug}`
    }))
  };

  return (
    <Container>
      <StructuredData data={schema} />
      <h1 className="text-brand-primary mb-3 mt-2 text-center text-3xl font-semibold tracking-tight dark:text-white lg:text-4xl lg:leading-snug">
        Sobre Nós
      </h1>
      <div className="text-center">
        <p className="text-lg">Somos uma pequena equipe apaixonada.</p>
      </div>

      <div className="mb-16 mt-6 grid grid-cols-3 gap-5 md:mb-32 md:mt-16 md:gap-16">
        {authors.slice(0, 3).map(author => {
          const imageProps = urlForImage(author?.image) || null;
          return (
            <div
              key={author._id}
              className="relative aspect-square overflow-hidden rounded-md bg-slate-50 odd:translate-y-10 odd:md:translate-y-16">
              <Link href={`/author/${author?.slug}`}>
                {imageProps && (
                  <Image
                    src={imageProps?.src}
                    alt={author?.name || " "}
                    fill
                    sizes="(max-width: 320px) 100vw, 320px"
                    className="object-cover"
                  />
                )}
              </Link>
            </div>
          );
        })}
      </div>

      <div className="prose mx-auto mt-14 text-center dark:prose-invert">
        <p>
          Fornecemos conectividade em tempo real para permitir que 
          provedores de software e instituições financeiras construam 
          produtos integrados para seus clientes empresariais.
        </p>
        <p>
          Nossa infraestrutura de API é utilizada por clientes que 
          vão desde credores até provedores de cartões corporativos 
          e ferramentas de previsão de negócios, com casos de uso 
          incluindo reconciliação automática, painéis de negócios 
          e decisões de empréstimos.
        </p>
        <p>
          <Link href="/contact">Entre em contato</Link>
        </p>
      </div>
    </Container>
  );
}
