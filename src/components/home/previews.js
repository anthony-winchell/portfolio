import Image from "next/image";
import SpotuiView from "@/components/demos/SpotuiView";
import TuChatView from "@/components/demos/TuChatView";
import { initialState as spotuiState } from "@/lib/spotui";
import { initialState as tuchatState } from "@/lib/tuchat";

// Still pictures of each project. The terminal apps are drawn by the same
// components as their demos; FloSight is a screenshot of the live site.

function TuChatPreview() {
  return <TuChatView state={tuchatState} className="h-72" />;
}

function SpotuiPreview() {
  return <SpotuiView state={spotuiState} />;
}

function FloSightPreview() {
  return (
    <Image
      src="/projects/flosight-home.webp"
      alt=""
      width={1280}
      height={800}
      sizes="(min-width: 1024px) 640px, 100vw"
      className="w-full"
    />
  );
}

export const previews = {
  tuchat: { title: "tuchat (sample data)", Component: TuChatPreview },
  spotui: { title: "spotui (sample data)", Component: SpotuiPreview },
  flosight: { title: "flosightdrones.com", Component: FloSightPreview },
};
