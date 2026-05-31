import { useState } from "react";
import { apiClient } from "@/services/api/client";
import type { ApiResponse } from "@/services/api/types";

type CloudinarySignedUploadParams = {
  apiKey: string;
  cloudName: string;
  folder: string;
  signature: string;
  timestamp: number;
  uploadUrl: string;
};

export function useCloudinaryUpload() {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const uploadImage = async (file: File, category?: "cafe" | "billiard") => {
    setIsUploading(true);
    setError(null);
    try {
      // 1. Get Signature from our backend
      const query = category ? `?category=${category}` : "";
      const sigRes = await apiClient<ApiResponse<CloudinarySignedUploadParams>>(
        `/api/uploads/signature${query}`,
        { method: "POST" }
      );

      const { apiKey, folder, signature, timestamp, uploadUrl } = sigRes.data;

      // 2. Prepare FormData for Cloudinary
      const formData = new FormData();
      formData.append("file", file);
      formData.append("api_key", apiKey);
      formData.append("timestamp", timestamp.toString());
      formData.append("signature", signature);
      formData.append("folder", folder);

      // 3. Upload to Cloudinary
      const uploadRes = await fetch(uploadUrl, {
        method: "POST",
        body: formData,
      });

      if (!uploadRes.ok) {
        throw new Error("Gagal mengunggah gambar ke server cloud.");
      }

      const uploadData = await uploadRes.json();

      return {
        secure_url: uploadData.secure_url as string,
        public_id: uploadData.public_id as string,
      };
    } catch (err: any) {
      console.error("Cloudinary upload error:", err);
      setError(err.message || "Gagal mengunggah gambar");
      throw err;
    } finally {
      setIsUploading(false);
    }
  };

  return { uploadImage, isUploading, error };
}
