"use client";

import { useState } from "react";
import { ShoppingBag } from "lucide-react";
import { toast } from "sonner";
import { useCart } from "@/store/cart";

type Product = {
  id: string;
  name: string;
  price: number;
  imageUrl: string | null;
  sizes: string[];
  stock: number;
};

export default function AddToCartButton({ product }: { product: Product }) {
  const { addItem } = useCart();
  const [selectedSize, setSelectedSize] = useState<string | null>(
    product.sizes.length === 1 ? product.sizes[0] : null
  );

  const outOfStock = product.stock === 0;

  const handleAddToCart = () => {
    if (product.sizes.length > 0 && !selectedSize) {
      toast.error("Please select a size");
      return;
    }

    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      imageUrl: product.imageUrl,
      size: selectedSize,
      quantity: 1,
    });

    toast.success(`${product.name} added to cart!`);
  };

  return (
    <div className="flex flex-col gap-4">

      {/* SIZE SELECTOR */}
      {product.sizes.length > 0 && (
        <div>
          <p className="mb-3 text-sm font-semibold text-foreground">
            Select Size
          </p>
          <div className="flex flex-wrap gap-2">
            {product.sizes.map((size) => (
              <button
                key={size}
                onClick={() => setSelectedSize(size)}
                className={`rounded-xl border px-4 py-2 text-sm font-medium transition ${
                  selectedSize === size
                    ? "border-amber-400 bg-amber-400 text-black"
                    : "border-border text-foreground hover:border-amber-500/50"
                }`}
              >
                {size}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* ADD TO CART */}
      <button
        onClick={handleAddToCart}
        disabled={outOfStock}
        className="flex items-center justify-center gap-2 rounded-full bg-amber-400 px-8 py-4 font-semibold text-black transition hover:bg-amber-300 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <ShoppingBag size={18} />
        {outOfStock ? "Out of Stock" : "Add to Cart"}
      </button>
    </div>
  );
}