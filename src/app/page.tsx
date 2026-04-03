import { getBioContent } from "@/lib/content";
import { HomeClient } from "./home-client";

export default async function BioPage() {
  const bioEn = await getBioContent("en");
  const bioIt = await getBioContent("it");

  return <HomeClient bioEn={bioEn} bioIt={bioIt} />;
}
