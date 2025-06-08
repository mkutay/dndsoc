"use client";

import { UploadImage } from "@/components/upload-image";
import { useToast } from "@/hooks/use-toast";
import { uploadImageCharacter } from "@/server/storage";
import { actionResultMatch } from "@/types/error-typing";

export function UploadWrapper({
  characterId,
  characterShortened,
}: {
  characterId: string;
  characterShortened: string;
}) {
  const { toast } = useToast();

  const handleImageUpload = async (blob: Blob, file: File) => {
    const result = await uploadImageCharacter({
      blob,
      file,
      characterId,
      characterShortened
    });

    actionResultMatch(
      result,
      ({ name }) => toast({
        title: `Image uploaded for you, ${name}`,
        description: "The image has been successfully uploaded.",
        variant: "default",
      }),
      ({ message }) => toast({
        title: "Image upload failed",
        description: message,
        variant: "destructive",
      })
    )
  };

  return <div className="mt-6 flex flex-col gap-2">
    <p className="text-sm">Upload an Image for Your Character</p>
    <UploadImage
      onImageUpload={handleImageUpload}
    />
  </div>
}