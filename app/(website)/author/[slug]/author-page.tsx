import Container from "@/components/container";
import { urlForImage } from "@/lib/sanity/image";
import Image from "next/image";
import Link from "next/link";
import StructuredData from "@/components/StructuredData";
import PostList from "@/components/postlist";
import { Author as AuthorType, Post } from "@/lib/sanity/types";

interface AuthorPageProps {
  author: AuthorType;
  posts: Post[];
}

export default function AuthorPage({ author, posts }: AuthorPageProps) {
  const imageProps = author?.image ? urlForImage(author.image) : null;

  const schema = {
    "@context": "https://schema.org",
    "@type": "ProfilePage",
    "name": author.name,
    "description": author.bio,
    "mainEntity": {
      "@type": "Person",
      "name": author.name,
      "description": author.bio,
      "image": imageProps?.src || "",
      "url": `/author/${author.slug.current}`,
      "jobTitle": author.occupation || "",
      "worksFor": {
        "@type": "Organization",
        "name": "Closer Brasil"
      },
      "sameAs": [
        author.social?.twitter || "",
        author.social?.linkedin || "",
        author.social?.github || ""
      ].filter(Boolean)
    }
  };

  return (
    <Container>
      <StructuredData data={schema} />
      
      <div className="mx-auto max-w-4xl">
        <div className="flex flex-col items-center justify-center text-center">
          {imageProps && (
            <div className="mb-8 h-32 w-32 overflow-hidden rounded-full">
              <Image
                src={imageProps.src}
                alt={author.name}
                width={128}
                height={128}
                className="object-cover"
              />
            </div>
          )}
          <h1 className="text-brand-primary mb-3 text-3xl font-semibold tracking-tight dark:text-white lg:text-4xl">
            {author.name}
          </h1>
          {author.occupation && (
            <h2 className="text-lg text-gray-600 dark:text-gray-400">
              {author.occupation}
            </h2>
          )}
          {author.bio && (
            <div className="mt-4 max-w-2xl text-gray-600 dark:text-gray-400">
              <p>{author.bio}</p>
            </div>
          )}
          <div className="mt-8 flex space-x-4">
            {author.social?.twitter && (
              <a
                href={author.social.twitter}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-600 hover:text-blue-500 dark:text-gray-400">
                Twitter
              </a>
            )}
            {author.social?.linkedin && (
              <a
                href={author.social.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-600 hover:text-blue-500 dark:text-gray-400">
                LinkedIn
              </a>
            )}
            {author.social?.github && (
              <a
                href={author.social.github}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-600 hover:text-blue-500 dark:text-gray-400">
                GitHub
              </a>
            )}
          </div>
        </div>

        <div className="mt-16">
          <h2 className="mb-8 text-2xl font-semibold text-gray-900 dark:text-white">
            Artigos por {author.name}
          </h2>
          {posts && posts.length > 0 ? (
            <div className="grid gap-10 md:grid-cols-2">
              {posts.map(post => (
                <div key={post._id} className="group cursor-pointer">
                  <Link href={`/post/${post.slug.current}`}>
                    {post.mainImage && (
                      <div className="relative aspect-video overflow-hidden rounded-md bg-gray-100">
                        <Image
                          src={urlForImage(post.mainImage).url()}
                          alt={post.title || ""}
                          fill
                          sizes="(max-width: 640px) 100vw, 50vw"
                          className="object-cover transition duration-200 group-hover:scale-105"
                        />
                      </div>
                    )}
                    <div className="mt-3">
                      <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200">
                        {post.title}
                      </h3>
                      {post.excerpt && (
                        <p className="mt-2 text-gray-600 dark:text-gray-400 line-clamp-2">
                          {post.excerpt}
                        </p>
                      )}
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-600 dark:text-gray-400">
              Nenhum artigo publicado ainda.
            </p>
          )}
        </div>
      </div>
    </Container>
  );
} 