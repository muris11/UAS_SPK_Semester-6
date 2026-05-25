export type Topic = "SAW" | "SMART" | "TOPSIS" | "AHP";
export type TopicFilter = "Semua" | Topic;
export type QuestionType = "Teori" | "Hitungan";
export type Difficulty = "Menengah-Sulit" | "Sulit";

export type Formula = {
  label: string;
  expression: string;
  meaning: string;
};

export type TopicMaterial = {
  id: string;
  title: Topic;
  fullName: string;
  badge: string;
  definition: string;
  mainPurpose: string;
  inputOutput: { input: string[]; output: string[] };
  steps: string[];
  formulas: Formula[];
  mustRemember: string[];
  commonTraps: string[];
  implementation: string[];
  saatyScale?: { value: string; meaning: string }[];
  randomIndex?: { n: number; ri: string }[];
};

export type Question = {
  id: number;
  topic: Topic;
  difficulty: Difficulty;
  type: QuestionType;
  competency: string;
  question: string;
  options: string[];
  answer: number;
  explanation: string;
  materialRef: string;
};

export type MaterialsData = {
  examProfile: {
    title: string;
    format: string;
    officialQuestionCount: number;
    practiceBankCount: number;
    mode: string;
    focus: string;
    coveredTopics: Topic[];
    learningStrategy: string[];
    practiceDistribution: { topic: Topic; questions: number; theory: number; calculation: number }[];
  };
  foundation: {
    title: string;
    description: string;
    decisionPhase: string;
    caseStudy: string;
  };
  topics: TopicMaterial[];
  comparison: Record<string, string>[];
  sources: string[];
};
