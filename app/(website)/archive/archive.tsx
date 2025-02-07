import PostList from "@/components/postlist";
import Pagination from "@/components/blog/pagination";

async function getPaginatedPosts(page: number, limit: number) {
  try {
    const start = (page - 1) * limit;
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_SITE_URL}/api/posts?start=${start}&limit=${limit}`,
      { next: { revalidate: 60 } }
    );
    const data = await response.json();
    return {
      posts: data.posts || [],
      pagination: data.pagination
    };
  } catch (error) {
    console.error("Erro ao buscar posts:", error);
    return { posts: [], pagination: { total: 0, start: 0, limit, hasMore: false } };
  }
}

export default async function Post({ searchParams }) {
  const page = parseInt(searchParams.page, 10) || 1;
  const POSTS_PER_PAGE = 6;

  const { posts, pagination } = await getPaginatedPosts(page, POSTS_PER_PAGE);

  const isFirstPage = page === 1;
  const isLastPage = !pagination.hasMore;

  return (
    <>
      {posts && posts.length === 0 && (
        <div className="flex h-40 items-center justify-center">
          <span className="text-lg text-gray-500">
            Fim dos resultados!
          </span>
        </div>
      )}
      <div className="mt-10 grid gap-10 md:grid-cols-2 lg:gap-10 xl:grid-cols-3">
        {posts.map(post => (
          <PostList key={post._id} post={post} aspect="square" />
        ))}
      </div>

      <Pagination
        pageIndex={page}
        isFirstPage={isFirstPage}
        isLastPage={isLastPage}
      />
    </>
  );
}
