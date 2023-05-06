export type Product = {
  _id: string;
  category: string;
  image: FileList | null | '' | string;
  name: string;
  price: number;
};

export type NewProduct = Omit<Product, '_id'>;
