"use client";

import { UploadImage } from "@/components/upload-image";
import { useToast } from "@/hooks/use-toast";
import { uploadImageDM } from "@/server/storage";
import { actionResultMatch } from "@/types/error-typing";

export function UploadWrapper({
  DMId,
  DMShortened,
}: {
  DMId: string;
  DMShortened: string;
}) {
  const { toast } = useToast();

  const handleImageUpload = async (blob: Blob, file: File) => {
    const result = await uploadImageDM({
      blob,
      file,
      DMId,
      DMShortened
    });

    actionResultMatch(
      result,
      () => toast({
        title: `Image uploaded for you, DM`,
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