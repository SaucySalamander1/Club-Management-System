"use client";

import { useState, useRef } from "react";
import { supabase } from "@/lib/supabase";
import { Upload, X, Loader2 } from "lucide-react";
import NextImage from "next/image";
import { toast } from "sonner";

type Props = {
  value: string;
  onChange: (url: string) => void;
  bucket: "gallery" | "products";
};

export default function ImageUpload({ value, onChange, bucket }: Props) {
  const [uploading, setUploading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image must be less than 5MB");
      return;
    }

    setUploading(true);

    try {
      const ext = file.name.split(".").pop();

      const filename = `${Date.now()}-${Math.random()
        .toString(36)
        .slice(2)}.${ext}`;

      // Debug Supabase session
      const {
        data: { session },
      } = await supabase.auth.getSession();

      console.log("SUPABASE SESSION:", session);

      // Upload image
      const { error } = await supabase.storage
        .from(bucket)
        .upload(filename, file, {
          cacheControl: "3600",
          upsert: false,
        });

      if (error) {
        console.error("UPLOAD ERROR:", error);
        throw error;
      }

      // Get public URL
      const { data } = supabase.storage
        .from(bucket)
        .getPublicUrl(filename);

      console.log("PUBLIC URL:", data.publicUrl);

      onChange(data.publicUrl);

      toast.success("Image uploaded!");
    } catch (err) {
      console.error(err);
      toast.error("Failed to upload image");
    } finally {
      setUploading(false);

      if (inputRef.current) {
        inputRef.current.value = "";
      }
    }
  };

  const handleRemove = () => {
    onChange("");
  };

  return (
    <div className="flex flex-col gap-2">
      {value ? (
        <div className="relative aspect-square w-full max-w-xs overflow-hidden rounded-2xl border border-border">
          <NextImage
            src={value}
            alt="Upload preview"
            fill
            unoptimized
            className="object-cover"
          />

          <button
            type="button"
            onClick={handleRemove}
            className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full bg-black/60 text-white transition hover:bg-red-500"
          >
            <X size={14} />
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="flex aspect-square w-full max-w-xs flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed border-border bg-accent/50 transition hover:border-amber-500/50 hover:bg-accent disabled:opacity-50"
        >
          {uploading ? (
            <>
              <Loader2 size={24} className="animate-spin text-amber-500" />
              <p className="text-sm text-muted-foreground">Uploading...</p>
            </>
          ) : (
            <>
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-400/10">
                <Upload size={20} className="text-amber-500" />
              </div>

              <div className="text-center">
                <p className="text-sm font-semibold text-foreground">
                  Click to upload
                </p>
                <p className="text-xs text-muted-foreground">
                  PNG, JPG, WEBP up to 5MB
                </p>
              </div>
            </>
          )}
        </button>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        onChange={handleUpload}
        className="hidden"
      />

      <div className="flex items-center gap-2">
        <div className="h-px flex-1 bg-border" />
        <span className="text-xs text-muted-foreground">or paste URL</span>
        <div className="h-px flex-1 bg-border" />
      </div>

      <input
        type="url"
        placeholder="https://..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="rounded-xl border border-border bg-background px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:border-amber-500 focus:outline-none"
      />
    </div>
  );
}