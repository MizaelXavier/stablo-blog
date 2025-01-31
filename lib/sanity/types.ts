export interface Post {
  _id: string;
  title: string;
  slug: {
    current: string;
  };
  publishedAt: string;
  excerpt?: string;
  mainImage?: any;
  author?: Author;
  categories?: Category[];
}

export interface Author {
  _id: string;
  name: string;
  slug: {
    current: string;
  };
  image?: any;
  bio?: string;
  occupation?: string;
  social?: {
    twitter?: string;
    linkedin?: string;
    github?: string;
  };
}

export interface Category {
  _id: string;
  title: string;
  slug: {
    current: string;
  };
  description?: string;
} 