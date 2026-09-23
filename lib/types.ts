export type Tri = "yes" | "no" | "nei";
export type Country = "USA" | "Canada";
export type CourseLevel = "Undergraduate" | "Graduate" | "Both";

export interface Syllabus {
  id: string;
  country: Country;
  courseLevel: CourseLevel;
  informationLevel: 1 | 2 | 3 | 4 | 5;
  infoFlags: Record<string, boolean>;
  layer1: Record<string, Tri>;
  layer2: Record<string, Tri>;
  coverage: number;
  framingDepth: number;
  framingByCategory: Record<string, number>;
}

export interface LabeledKey {
  key: string;
  label: string;
}

export interface Layer2Category {
  key: string;
  title: string;
  questions: LabeledKey[];
}

export interface Meta {
  recordCount: number;
  coverageMax: number;
  framingMax: number;
  infoFlags: LabeledKey[];
  infoLevelLadder: string[];
  layer1: LabeledKey[];
  layer2Categories: Layer2Category[];
}
