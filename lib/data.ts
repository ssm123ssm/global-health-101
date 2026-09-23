import syllabiJson from "@/public/data/syllabi.json";
import metaJson from "@/public/data/meta.json";
import type { Meta, Syllabus } from "./types";

export const syllabi = syllabiJson as Syllabus[];
export const meta = metaJson as Meta;
