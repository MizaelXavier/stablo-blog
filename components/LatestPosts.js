import Image from "next/image";
import Link from "next/link";
import { urlForImage } from "@/lib/sanity/image";
import { format, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";
import Label from "@/components/ui/label";
import { hasVideo } from "@/lib/utils/postUtils";

export default function LatestPosts({ posts = [] }) {
  // Filter out invalid posts (those without slug)
  const validPosts = posts.filter(post => post?.slug);

  if (!validPosts || validPosts.length === 0) {
    return (
      <section className="mb-16">
        <h2 className="mb-8 text-3xl font-bold text-gray-900 dark:text-white">
          Últimas Notícias
        </h2>
        <p className="text-center text-gray-600 dark:text-gray-400">
          Nenhum post encontrado. Em breve teremos novidades!
        </p>
      </section>
    );
  }

  // Separar posts em destaque dos demais
  const featuredPosts = validPosts.filter(post => post.featured);
  const regularPosts = validPosts.filter(post => !post.featured);

  return (
    <section className="mb-16">
      {/* Posts em Destaque */}
      {featuredPosts.length > 0 && (
        <div className="mb-16">
          <h2 className="mb-8 text-3xl font-bold text-gray-900 dark:text-white">
            Em Destaque
          </h2>
          <div className="grid gap-10 md:grid-cols-2 lg:gap-10">
            {featuredPosts.slice(0, 2).map(post => (
              <FeaturedPostCard key={post._id} post={post} />
            ))}
          </div>
        </div>
      )}

      {/* Posts Regulares */}
      <div>
        <h2 className="mb-8 text-3xl font-bold text-gray-900 dark:text-white">
          Últimas Notícias
        </h2>
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-3">
          {regularPosts.slice(0, 6).map(post => (
            <PostCard key={post._id} post={post} />
          ))}
        </div>
      </div>

      {/* Botão Ver Mais */}
      {validPosts.length > 6 && (
        <div className="mt-10 flex justify-center">
          <Link
            href="/archive"
            className="rounded-md bg-blue-500 px-5 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-600">
            Ver todos os posts
          </Link>
        </div>
      )}
    </section>
  );
}

function FeaturedPostCard({ post }) {
  const imageProps = post?.mainImage ? urlForImage(post.mainImage) : null;
  const videoPresent = hasVideo(post);

  return (
    <article className="group relative flex flex-col">
      {imageProps && (
        <Link href={`/noticia/${post.slug}`}>
          <div className="relative aspect-video overflow-hidden rounded-md">
            <Image
              src={imageProps.src}
              {...(post.mainImage.blurDataURL && {
                placeholder: "blur",
                blurDataURL: post.mainImage.blurDataURL
              })}
              alt={post.mainImage?.alt || post.title}
              width={800}
              height={450}
              className="object-cover transition duration-200 group-hover:scale-105"
              priority
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

      <div className="flex flex-wrap items-center gap-3 mt-3">
        {post.categories?.map(category => (
          <Label key={category._id} color={category.color}>
            <Link href={`/category/${category.slug}`}>
              {category.title}
            </Link>
          </Label>
        ))}
        <span className="text-sm text-gray-500 dark:text-gray-400">
          {format(parseISO(post.publishedAt || post._createdAt), "d 'de' MMMM, yyyy", { locale: ptBR })}
        </span>
      </div>

      <h3 className="mt-2 text-xl font-semibold leading-snug tracking-tight">
        <Link href={`/noticia/${post.slug}`}>
          <span className="bg-gradient-to-r from-green-200 to-green-100 bg-[length:0px_10px] bg-left-bottom bg-no-repeat transition-[background-size] duration-500 hover:bg-[length:100%_3px] group-hover:bg-[length:100%_10px] dark:from-purple-800 dark:to-purple-900">
            {post.title}
          </span>
        </Link>
      </h3>

      {post.excerpt && (
        <p className="mt-2 line-clamp-3 text-gray-500 dark:text-gray-400">
          {post.excerpt}
        </p>
      )}

      <div className="mt-3 flex items-center space-x-3 text-gray-500 dark:text-gray-400">
        <Link href={`/author/${post.author?.slug}`} className="flex items-center gap-3">
          {post.author?.image && (
            <div className="relative h-5 w-5 flex-shrink-0">
              <Image
                src={post.author.image}
                alt={post.author?.name}
                className="rounded-full object-cover"
                fill
                sizes="20px"
              />
            </div>
          )}
          <span className="truncate text-sm">
            {post.author?.name}
          </span>
        </Link>
        <span className="text-xs text-gray-300 dark:text-gray-600">•</span>
        <span className="text-sm">{post.estReadingTime || 5} min de leitura</span>
      </div>
    </article>
  );
}

function PostCard({ post }) {
  const imageProps = post?.mainImage ? urlForImage(post.mainImage) : null;
  const videoPresent = hasVideo(post);

  return (
    <article className="group cursor-pointer">
      {imageProps && (
        <Link href={`/noticia/${post.slug}`}>
          <div className="relative aspect-video overflow-hidden rounded-md bg-gray-100">
            <Image
              src={imageProps.src}
              {...(post.mainImage.blurDataURL && {
                placeholder: "blur",
                blurDataURL: post.mainImage.blurDataURL
              })}
              alt={post.mainImage?.alt || post.title}
              width={400}
              height={225}
              className="object-cover transition duration-200 group-hover:scale-105"
            />
            {videoPresent && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-black bg-opacity-60">
                  <div className="ml-1 h-0 w-0 border-y-[8px] border-l-[12px] border-r-0 border-solid border-y-transparent border-l-white"></div>
                </div>
              </div>
            )}
          </div>
        </Link>
      )}

      <div className="flex flex-wrap items-center gap-3 mt-3">
        {post.categories?.map(category => (
          <Label key={category._id} color={category.color}>
            <Link href={`/category/${category.slug}`}>
              {category.title}
            </Link>
          </Label>
        ))}
        <span className="text-sm text-gray-500 dark:text-gray-400">
          {format(parseISO(post.publishedAt || post._createdAt), "d 'de' MMMM, yyyy", { locale: ptBR })}
        </span>
      </div>

      <h3 className="mt-2 text-lg font-medium text-gray-800 dark:text-gray-200">
        <Link href={`/noticia/${post.slug}`}>
          {post.title}
        </Link>
      </h3>

      {post.excerpt && (
        <p className="mt-2 text-gray-600 dark:text-gray-400 line-clamp-2">
          {post.excerpt}
        </p>
      )}

      <div className="mt-3 flex items-center space-x-3 text-gray-500 dark:text-gray-400">
        <Link href={`/author/${post.author?.slug}`} className="flex items-center gap-3">
          {post.author?.image && (
            <div className="relative h-5 w-5 flex-shrink-0">
              <Image
                src={post.author.image}
                alt={post.author?.name}
                className="rounded-full object-cover"
                fill
                sizes="20px"
              />
            </div>
          )}
          <span className="truncate text-sm">
            {post.author?.name}
          </span>
        </Link>
        <span className="text-xs text-gray-300 dark:text-gray-600">•</span>
        <span className="text-sm">{post.estReadingTime || 5} min de leitura</span>
      </div>
    </article>
  );
} 