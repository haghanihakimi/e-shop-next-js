import { generateComponents } from "@uploadthing/react";
 
import type { OurFileRouter } from "@/pages/api/uploadthing-core/core";
 
export const { UploadButton, UploadDropzone, Uploader } =
  generateComponents<OurFileRouter>();