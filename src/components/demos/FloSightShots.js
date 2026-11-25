import Image from "next/image";

export default function FloSightShots() {
  return (
    <>
      <Image
        src="/projects/flosight-home.webp"
        alt="The FloSight home page: a drone logo above the heading Aerial Drone Capture and Inspections."
        width={1280}
        height={800}
        sizes="(min-width: 1280px) 1100px, 100vw"
        preload
        className="w-full"
      />
      <figure className="border-t border-line">
        <Image
          src="/projects/flosight-leads.webp"
          alt="The leads page: a table with name, email, service, date, and a status menu for each lead."
          width={1128}
          height={439}
          sizes="(min-width: 1280px) 1100px, 100vw"
          className="w-full"
        />
        <figcaption className="border-t border-line px-4 py-3 text-sm text-muted">
          Top: the live site. Bottom: the private leads page, run locally with
          sample data.
        </figcaption>
      </figure>
    </>
  );
}
