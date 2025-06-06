'use client';
import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';

export default function SearchBar({ onSearch }: { onSearch: (q: string) => void }) {
  const [search, setSearch] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  return (
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
        placeholder="Search courses by name or tag..."
        value={search}
        onChange={e => {
          setSearch(e.target.value);
          onSearch(e.target.value);
        }}
      />
      {search && (
        <Button variant="outline" onClick={() => { setSearch(''); onSearch(''); inputRef.current?.focus(); }}>Clear</Button>
      )}
    </div>
  );
} 