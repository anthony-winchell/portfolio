import ProjectCard from "@/components/ProjectCard";
import { projects } from "@/data/projects";

export const metadata = {
  title: "Projects",
};

export default function ProjectsPage() {
  return (
    <div className="mx-auto w-full max-w-3xl px-6 py-16">
      <h1 className="text-4xl font-bold text-purple">Projects</h1>
      <div className="mt-8 space-y-6">
        {projects.map((project) => (
          <ProjectCard key={project.slug} project={project} />
        ))}
      </div>
    </div>
  );
}
