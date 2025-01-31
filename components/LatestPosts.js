import Image from "next/image";
import Link from "next/link";
import { urlForImage } from "@/lib/sanity/image";
import { formatDate } from "@/utils/all";
import Label from "@/components/ui/label";

// Função local para verificar vídeos
const hasVideo = (post) => {
  if (!post?.body || !Array.isArray(post.body)) return false;
  return post.body.some(block => block._type === 'youtube' && block.url);
};

export default function LatestPosts({ posts = [] }) {
  // Filter out invalid posts (those without slug)
  const validPosts = posts.filter(post => post?.slug?.current);

  if (!validPosts || validPosts.length === 0) {
    return (
      <section className="mb-16">
        <h2 className="mb-8 text-3xl font-bold text-gray-900 dark:text-white">
          Últimos Posts
        </h2>
        <p className="text-center text-gray-600 dark:text-gray-400">
          Nenhum post encontrado. Em breve teremos novidades!
        </p>
      </section>
    );
  }

  return (
    <section className="mb-16">
      <h2 className="mb-8 text-3xl font-bold text-gray-900 dark:text-white">
        Últimos Posts
      </h2>
      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {validPosts.map(post => {
          if (!post) return null;

          const imageProps = post?.mainImage ? urlForImage(post.mainImage) : null;
          const videoPresent = hasVideo(post);
          const postUrl = `/post/${post.slug.current}`;
          
          return (
            <article key={post._id} className="group relative flex flex-col">
              {imageProps && (
                <Link href={postUrl}>
                  <div className="relative aspect-video overflow-hidden rounded-md border border-gray-100">
                    <Image
                      src={imageProps.src}
                      alt={post.mainImage?.alt || "Imagem do Post"}
                      width={400}
                      height={300}
                      className="transition-all hover:scale-105"
                    />
                    {videoPresent && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-black bg-opacity-60">
                          <div className="ml-1 h-0 w-0 border-y-[10px] border-l-[16px] border-r-0 border-solid border-y-transparent border-l-white"></div>
                        </div>
                      </div>
                    )}
                  </div>
                </Link>
              )}
              <div className="flex flex-wrap items-baseline gap-3 mt-1">
                {post.categories?.length > 0 && (
                  <div className="flex flex-wrap items-center gap-2">
                    {post.categories.map(category => (
                      category?.slug?.current ? (
                        <Label key={category._id} color={category.color}>
                          <Link href={`/category/${category.slug.current}`}>
                            {category.title}
                          </Link>
                        </Label>
                      ) : null
                    ))}
                  </div>
                )}
                <span className="text-sm text-gray-500 dark:text-gray-400 whitespace-nowrap">
                  {formatDate(post.publishedAt || post._createdAt)}
                </span>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mt-2">
                <Link href={postUrl}>
                  {post.title}
                </Link>
              </h3>
              {post.excerpt && (
                <p className="text-gray-600 dark:text-gray-400 mt-2">
                  {post.excerpt}
                </p>
              )}
              <div className="flex items-center space-x-3 mt-2">
                <Link
                  href={postUrl}
                  className="inline-flex items-center text-sm font-medium text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-500">
                  Ler mais
                  <svg
                    className="ml-1 h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </Link>
              </div>
            </article>
          );
        })}
      </div>
      {validPosts.length > 0 && (
        <div className="mt-10 flex justify-center">
          <Link
            href="/blog"
            className="rounded-md bg-blue-500 px-5 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-600">
            Ver todos os posts
          </Link>
        </div>
      )}
    </section>
  );
} 