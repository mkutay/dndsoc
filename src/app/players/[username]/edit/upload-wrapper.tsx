"use client";

import { UploadImage } from "@/components/upload-image";
import { useToast } from "@/hooks/use-toast";
import { uploadImagePlayer } from "@/server/storage";
import { actionResultMatch } from "@/types/error-typing";

export function UploadWrapper({
  playerId,
  playerShortened,
}: {
  playerId: string;
  playerShortened: string;
}) {
  const { toast } = useToast();

  const handleImageUpload = async (blob: Blob, file: File) => {
    const result = await uploadImagePlayer({
      blob,
      file,
      playerId,
      playerShortened
    });

    actionResultMatch(
      result,
      () => toast({
        title: `Image uploaded for you, player`,
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
    <p className="text-sm">Upload an Image for Your Profile</p>
    <UploadImage
      onImageUpload={handleImageUpload}
    />
  </div>
}