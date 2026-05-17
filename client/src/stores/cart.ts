import { defineStore } from "pinia";
import type { Product } from "@/types/product";
import type { CartItem } from "@/types/cart";

interface CartState {
  items: CartItem[];
}

export const useCartStore = defineStore("cart", {
  state: (): CartState => ({
    items: [],
  }),

  getters: {
    totalItems: (state): number =>
      state.items.reduce((acc, item) => acc + item.quantity, 0),

    totalPrice: (state): number =>
      state.items.reduce(
        (acc, item) => acc + item.product.preco * item.quantity,
        0
      ),

    isEmpty: (state): boolean => state.items.length === 0,
  },

  actions: {
    addProduct(product: Product, quantity = 1) {
      const existing = this.items.find((i) => i.product.id === product.id);
      if (existing) {
        existing.quantity += quantity;
      } else {
        this.items.push({ product, quantity });
      }
    },

    removeProduct(productId: number) {
      this.items = this.items.filter((i) => i.product.id !== productId);
    },

    updateQuantity(productId: number, quantity: number) {
      const item = this.items.find((i) => i.product.id === productId);
      if (!item) return;
      if (quantity <= 0) {
        this.removeProduct(productId);
        return;
      }
      item.quantity = quantity;
    },

    clear() {
      this.items = [];
    },
  },
});
