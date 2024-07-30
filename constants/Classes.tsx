import { TabBarIcon } from "@/components/navigation/TabBarIcon";
import { Icon } from "react-native-paper";

export interface Product {
    id: string;
    name: string;
    description: string;
    price: number;
    priceAfterDiscount: number;
    quantityInStock: number;
    size: number;
    imageUrls: {id: string, url: string }[];
    category: string;
    postedDate: string;
  }

export interface Comment {
  id: string,
  content: string,
  first: boolean,
  rating: number
}

export interface Card {
  id: string;
  cartElements: CartElement[]
  total_amount: number
}

export interface CartElement {

  id: string;
  
  quantity: number;

  sub_total: number;

  product: Product;

}


export type OrderStatus = 'Delivered' | 'Pending' | 'Picked up';

export type paymentMethod = 'Card' | 'Cash';
export type OrderItem = {
  id: string;
  product: Product;
  quantity: number;
  sub_total: number;
};
export interface Order {
  id: string;
  creationDate: string;
  adresse: string;
  totalAmount: number;
  status: OrderStatus;
  paymentMethod: paymentMethod;
  shepingDate: Date;
  orderItems: OrderItem[]
};