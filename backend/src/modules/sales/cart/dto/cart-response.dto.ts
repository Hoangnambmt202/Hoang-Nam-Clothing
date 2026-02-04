export class CartItemResponseDto {
  id: string;
  productId: string;
  productName: string;
  productImage: string;
  price: number;
  quantity: number;
  size?: string;
  color?: string;
  subtotal: number;
}

export class CartResponseDto {
  id: string;
  userId: string;
  items: CartItemResponseDto[];
  totalAmount: number;
  totalItems: number;
  createdAt: Date;
  updatedAt: Date;
}
