'use client';
import { useState, useRef } from 'react';
import { ProductCard } from '@/features/products/components/ProductCard';

export default function HomeProductListClient({ products, coupon }: { products: any[], coupon: any }) {
  const [search, setSearch] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const filtered = products.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    (p.description && p.description.toLowerCase().includes(search.toLowerCase()))
  );
  return (
    <>
      <div className="mb-4 flex gap-2">
        <input
          ref={inputRef}
          style={{
            border: '1px solid #ccc',
            borderRadius: 6,
            padding: '8px 12px',
            width: '100%',
            maxWidth: 400,
            fontSize: 16,
            marginBottom: 8,
          }}
          type="text"
          placeholder="Search courses by name or description..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        {search && (
          <button
            className="border px-3 py-1 rounded"
            onClick={() => { setSearch(''); inputRef.current?.focus(); }}
          >Clear</button>
        )}
      </div>
      <div className="grid grid-cols-[repeat(auto-fill,minmax(300px,1fr))] gap-4">
        {filtered.map(product => (
          <ProductCard
            key={product.id}
            id={product.id}
            name={product.name}
            description={product.description}
            priceInDollars={product.priceInDollars}
            imageUrl={product.image_url}
            coupon={coupon}
          />
        ))}
      </div>
    </>
  );
} 