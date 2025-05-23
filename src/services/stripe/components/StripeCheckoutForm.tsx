export function StripeCheckoutForm({ product, user }: { product: any, user: any }) {
  return (
    <div className="border p-4 rounded bg-gray-50">
      <div className="mb-2">Stripe Checkout (Demo)</div>
      <div>Product: {product?.name}</div>
      <div>User: {user?.name || user?.email || 'Unknown'}</div>
      <button className="mt-4 px-4 py-2 bg-blue-600 text-white rounded">Pay (Demo)</button>
    </div>
  );
} 