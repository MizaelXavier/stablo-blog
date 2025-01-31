import { getAllAuthors, getSettings } from "@/lib/sanity/client";
import About from "./sobre";
import { Metadata } from "next";
import { urlForImage } from "@/lib/sanity/image";

export const metadata = {
  title: "Sobre Nós | Closer Brasil",
  description: "Conheça nossa equipe apaixonada e descubra como estamos transformando o mercado financeiro brasileiro com soluções inovadoras.",
  openGraph: {
    title: "Sobre Nós | Closer Brasil",
    description: "Conheça nossa equipe apaixonada e descubra como estamos transformando o mercado financeiro brasileiro com soluções inovadoras.",
    type: "website"
  }
};

export default async function AboutPage() {
  const authors = await getAllAuthors();
  const settings = await getSettings();

  // Processar as imagens dos autores
  const processedAuthors = authors.map(author => ({
    ...author,
    image: author.image ? urlForImage(author.image) : null
  }));

  return <About settings={settings} authors={processedAuthors} />;
}

export const revalidate = 3600; // Revalidar a cada hora
