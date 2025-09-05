"use client";

import Link from "next/link";
import { ShoppingCart } from "lucide-react";

export default function CartButton() {
  return (
    <Link href="/cart">
      <ShoppingCart size={22} color="gray" />
    </Link>
  );
}
