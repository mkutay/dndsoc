"use client";

import { useState } from 'react';
import { Input } from './ui/input';
import { Button } from './ui/button';

export function UploadImage({
  onImageUpload,
}: {
  onImageUpload: (blob: Blob, file: File) => Promise<void>;
}) {
  const [selected, setSelected] = useState<{
    blob: Blob;
    file: File;
  } | null>(null);
  const [loading, setLoading] = useState(false);

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !file.type.startsWith('image/')) {
      return;
    }

    const blob = new Blob([file], { type: file.type });

    setSelected({
      blob,
      file,
    });
  };

  return (
    <div className="flex flex-row gap-2 w-full max-w-prose">
      <Input
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
      />
      {selected && <Button
        onClick={() => {
          setLoading(true);
          onImageUpload(selected.blob, selected.file).then(() => {
            setSelected(null);
            setLoading(false);
          })
        }}
        disabled={loading}
      >Upload Image</Button>}
    </div>
  );
}