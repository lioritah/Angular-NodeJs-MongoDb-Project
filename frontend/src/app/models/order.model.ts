export type Order = {
  _id: string;
  cart: string;
  user: string;
  deliveryDate: Date;
  orderDate: Date;
  deliveryStreet: string;
  deliveryCity: string;
  cardLast4Digits: string;
  totalPrice: number;
};
