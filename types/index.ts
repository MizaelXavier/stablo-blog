export interface Post {
  _id: string;
  _type: "post";
  title: string;
  slug: { current: string };
  author: { _ref: string };
  categories: { _ref: string }[];
  publishedAt: string;
  body: any[];
}

export interface Author {
  _id: string;
  _type: "author";
  name: string;
  slug: { current: string };
  image: any;
  bio: any[];
}

export interface Category {
  _id: string;
  _type: "category";
  title: string;
  slug: { current: string };
} 