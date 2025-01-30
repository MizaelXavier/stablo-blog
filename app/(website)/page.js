import Container from "@/components/container";
import LatestPosts from "@/components/LatestPosts";
import { getAllPosts } from "@/lib/sanity/client";

export const revalidate = 60;

export default async function Home() {
  let posts = [];
  try {
    posts = await getAllPosts();
  } catch (error) {
    console.error("Error fetching posts:", error);
  }

  return (
    <Container>
      <div className="flex flex-col items-center justify-center py-10">
        <h1 className="mb-4 text-center text-4xl font-bold text-gray-900 dark:text-white">
          Closer Brasil
        </h1>
        <p className="mb-8 max-w-2xl text-center text-lg text-gray-600 dark:text-gray-400">
          Seu portal de notícias com cobertura jornalística completa e atualizada sobre os principais acontecimentos no Brasil e no mundo.
        </p>
      </div>

      <LatestPosts posts={posts} />
    </Container>
  );
}
