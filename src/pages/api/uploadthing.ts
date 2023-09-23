import { createNextPageApiHandler } from "uploadthing/next-legacy";
 
import { ourFileRouter } from "@/pages/api/uploadthing-core/core";
 
const handler = createNextPageApiHandler({
  router: ourFileRouter,
});
 
export default handler;