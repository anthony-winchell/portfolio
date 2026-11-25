import { projects } from "./projects";

export const rootFiles = [
  { name: "home", href: "/" },
  { name: "about.md", href: "/about" },
];

export const projectFiles = projects.map((project) => ({
  name: project.file,
  href: `/projects/${project.slug}`,
}));

export const files = [...rootFiles, ...projectFiles];

// The file `delta` places away from this one, wrapping around at the ends.
export function siblingFile(pathname, delta) {
  const current = files.findIndex((file) => file.href === pathname);
  if (current === -1) return undefined;
  return files[(current + delta + files.length) % files.length];
}
