import { files } from "@/data/files";
import { site } from "@/data/site";

export default function sitemap() {
  return files.map((file) => ({ url: new URL(file.href, site.url).href }));
}
