 "use client";
 
 import dynamic from "next/dynamic";
import type { SocialBubblesBackgroundProps } from "./SocialBubblesBackground";
 
 const Bubbles = dynamic(() => import("./SocialBubblesBackground"), {
   ssr: false,
 });
 
export default function SocialBubblesClient(props: SocialBubblesBackgroundProps) {
   return <Bubbles {...props} />;
 }
 
