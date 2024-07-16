export interface Product {
    id: string;
    name: string;
    description: string;
    price: number;
    stock: number;
    size: number;
    imageUrls: { Url: string }[];
    category: string;
    postedDate: string;
  }