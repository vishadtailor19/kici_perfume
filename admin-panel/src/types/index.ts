export interface Product {
  id: string;
  name: string;
  description: string;
  brand: string;
  category: string;
  price: number;
  stock: number;
  images: Array<{
    url: string;
    alt: string;
    isPrimary: boolean;
  }>;
  fragranceNotes: {
    top: string[];
    heart: string[];
    base: string[];
  };
  size: string;
  tags: string[];
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'user';
}