"use client";

import BuyersFooter from "@/component/BuyerFooter";
import BuyersHeader from "@/component/BuyerHeader";
import { CartProvider } from "@/context/CartContext";

export default function BuyersLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <CartProvider>
      <div className="min-h-screen flex flex-col bg-gray-50">
        <BuyersHeader />

        <main className="flex-1">
          {children}
        </main>

        <BuyersFooter />
      </div>
    </CartProvider>
  );
}