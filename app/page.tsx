"use client";

import { useMemo, useState, type ReactNode } from "react";
import {
  ArrowRight,
  BookOpen,
  BrainCircuit,
  Calculator,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  CircleAlert,
  Database,
  Filter,
  Layers3,
  RefreshCcw,
  Search,
  ShieldCheck,
  Target,
  TimerReset,
  XCircle,
} from "lucide-react";
import materialsJson from "@/data/materials.json";
import questionsJson from "@/data/questions.json";
import type { Difficulty, MaterialsData, Question, QuestionType, Topic, TopicFilter, TopicMaterial } from "@/lib/types";

const materials = materialsJson as MaterialsData;
const questionBank = questionsJson as Question[];
const topics: TopicFilter[] = ["Semua", "SAW", "SMART", "TOPSIS", "AHP"];
const difficulties: ("Semua" | Difficulty)[] = ["Semua", "Menengah-Sulit", "Sulit"];
const questionTypes: ("Semua" | QuestionType)[] = ["Semua", "Teori", "Hitungan"];

type QuizMode = "bank" | "simulation";

type Answers = Record<number, number>;

function seededShuffle(items: Question[], seed: number): Question[] {
  const result = [...items];
  let value = seed || 1;
  const random = () => {
    value = (value * 16807) % 2147483647;
    return (value - 1) / 2147483646;
  };
  for (let i = result.length - 1; i > 0; i -= 1) {
    const j = Math.floor(random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

function makeSimulation(seed: number): Question[] {
  return seededShuffle(questionBank, seed).slice(0, materials.examProfile.officialQuestionCount);
}

export default function HomePage() {
  const [openTopic, setOpenTopic] = useState<string>("saw");
  const [quizMode, setQuizMode] = useState<QuizMode>("bank");
  const [attempt, setAttempt] = useState(1);
  const [answers, setAnswers] = useState<Answers>({});
  const [submitted, setSubmitted] = useState(false);
  const [revealInBank, setRevealInBank] = useState(false);
  const [topicFilter, setTopicFilter] = useState<TopicFilter>("Semua");
  const [difficultyFilter, setDifficultyFilter] = useState<"Semua" | Difficulty>("Semua");
  const [typeFilter, setTypeFilter] = useState<"Semua" | QuestionType>("Semua");
  const [query, setQuery] = useState("");

  const activeQuestions = useMemo(
    () => (quizMode === "simulation" ? makeSimulation(attempt) : questionBank),
    [quizMode, attempt],
  );

  const filteredQuestions = useMemo(() => {
    const keyword = query.trim().toLowerCase();
    return activeQuestions.filter((question) => {
      const matchesTopic = topicFilter === "Semua" || question.topic === topicFilter;
      const matchesDifficulty = difficultyFilter === "Semua" || question.difficulty === difficultyFilter;
      const matchesType = typeFilter === "Semua" || question.type === typeFilter;
      const matchesText =
        keyword.length === 0 ||
        question.question.toLowerCase().includes(keyword) ||
        question.competency.toLowerCase().includes(keyword) ||
        question.topic.toLowerCase().includes(keyword);
      return matchesTopic && matchesDifficulty && matchesType && matchesText;
    });
  }, [activeQuestions, topicFilter, difficultyFilter, typeFilter, query]);

  const answeredCount = activeQuestions.filter((question) => answers[question.id] !== undefined).length;
  const correctCount = activeQuestions.filter((question) => answers[question.id] === question.answer).length;
  const score = Math.round((correctCount / activeQuestions.length) * 100);
  const canReveal = quizMode === "bank" ? revealInBank : submitted;

  function chooseAnswer(id: number, optionIndex: number) {
    if (quizMode === "simulation" && submitted) return;
    setAnswers((current) => ({ ...current, [id]: optionIndex }));
  }

  function changeMode(mode: QuizMode) {
    setQuizMode(mode);
    setAnswers({});
    setSubmitted(false);
    setRevealInBank(false);
    setTopicFilter("Semua");
    setDifficultyFilter("Semua");
    setTypeFilter("Semua");
    setQuery("");
  }

  function newAttempt() {
    setAttempt((current) => current + 1);
    setAnswers({});
    setSubmitted(false);
    setRevealInBank(false);
    setTopicFilter("Semua");
    setDifficultyFilter("Semua");
    setTypeFilter("Semua");
    setQuery("");
  }

  return (
    <main className="min-h-screen text-slate-950">
      <Header />

      <section className="mx-auto max-w-7xl px-4 pb-10 pt-8 sm:px-6 lg:px-8 lg:pt-12">
        <div className="hero-grid overflow-hidden rounded-[2.25rem] border border-slate-200 bg-white shadow-sm">
          <div className="px-6 py-9 sm:px-10 sm:py-12 lg:px-12">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-orange-200 bg-orange-50 px-4 py-2 text-sm font-bold text-orange-700">
              <ShieldCheck className="h-4 w-4" />
              Close Book · CBT Siakad · Teori Dominan
            </div>
            <h1 className="max-w-3xl text-4xl font-black leading-tight tracking-tight text-slate-950 sm:text-5xl">
              Persiapan UAS <span className="text-blue-700">SPK</span> dengan soal lebih menantang
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-8 text-slate-600 sm:text-lg">
              Ringkasan mendalam dan bank latihan untuk <strong>SAW, SMART, TOPSIS, dan AHP</strong>. Fokus pada perbedaan teori, jebakan konsep, alur metode, dan hitungan singkat yang sering muncul pada pilihan ganda.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a href="#materi" className="inline-flex items-center gap-2 rounded-2xl bg-slate-950 px-5 py-3 text-sm font-bold text-white transition hover:bg-blue-700">
                Mulai Ringkasan <BookOpen className="h-4 w-4" />
              </a>
              <a href="#latihan" className="inline-flex items-center gap-2 rounded-2xl border border-slate-300 bg-white px-5 py-3 text-sm font-bold text-slate-900 transition hover:border-blue-500 hover:text-blue-700">
                Latihan CBT <ArrowRight className="h-4 w-4" />
              </a>
            </div>
          </div>
          <div className="border-t border-slate-100 bg-slate-50 p-5 lg:border-l lg:border-t-0 lg:p-7">
            <div className="rounded-[1.75rem] bg-slate-950 p-6 text-white">
              <p className="text-xs font-bold uppercase tracking-[0.25em] text-blue-300">Kisi-kisi</p>
              <h2 className="mt-3 text-xl font-black">{materials.examProfile.title}</h2>
              <div className="mt-6 grid grid-cols-2 gap-3">
                <QuickStat label="Soal UAS" value="50" />
                <QuickStat label="Bank Latihan" value="60" />
                <QuickStat label="Materi" value="4" />
                <QuickStat label="Mode" value="CBT" />
              </div>
              <p className="mt-5 rounded-2xl bg-white/10 p-4 text-sm leading-6 text-slate-200">
                Distribusi latihan: <strong className="text-white">45 teori</strong> dan <strong className="text-white">15 hitungan</strong>, disusun agar sesuai info bahwa soal teori lebih banyak.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-5 px-4 pb-12 sm:px-6 lg:grid-cols-[0.95fr_1.05fr] lg:px-8">
        <article className="surface rounded-[2rem] p-6 sm:p-7">
          <div className="flex items-center gap-3">
            <Layers3 className="h-6 w-6 text-blue-700" />
            <div>
              <p className="eyebrow">Landasan</p>
              <h2 className="text-xl font-black">{materials.foundation.title}</h2>
            </div>
          </div>
          <p className="mt-5 text-sm leading-7 text-slate-600">{materials.foundation.description}</p>
          <p className="mt-3 text-sm leading-7 text-slate-600">{materials.foundation.decisionPhase}</p>
          <div className="mt-5 rounded-2xl bg-blue-50 p-4 text-sm leading-7 text-blue-900">
            <strong>Studi kasus modul:</strong> {materials.foundation.caseStudy}
          </div>
        </article>
        <article className="surface rounded-[2rem] p-6 sm:p-7">
          <div className="flex items-center gap-3">
            <Target className="h-6 w-6 text-orange-600" />
            <div>
              <p className="eyebrow">Strategi Close Book</p>
              <h2 className="text-xl font-black">Yang harus benar-benar dikuasai</h2>
            </div>
          </div>
          <div className="mt-5 grid gap-3">
            {materials.examProfile.learningStrategy.map((strategy, index) => (
              <div key={strategy} className="flex gap-3 rounded-2xl border border-slate-100 bg-slate-50 p-4 text-sm leading-6 text-slate-700">
                <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-slate-950 text-xs font-black text-white">{index + 1}</span>
                <p>{strategy}</p>
              </div>
            ))}
          </div>
        </article>
      </section>

      <section id="materi" className="mx-auto max-w-7xl scroll-mt-24 px-4 pb-12 sm:px-6 lg:px-8">
        <SectionTitle eyebrow="Ringkasan Lengkap" title="Materi per metode" description="Buka tiap metode untuk mempelajari konsep, rumus, tahapan, jebakan teori, dan kaitannya dengan praktikum." />
        <div className="mt-7 grid gap-4">
          {materials.topics.map((topic) => (
            <TopicCard key={topic.id} topic={topic} open={openTopic === topic.id} onToggle={() => setOpenTopic(openTopic === topic.id ? "" : topic.id)} />
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-12 sm:px-6 lg:px-8">
        <article className="surface rounded-[2rem] p-6 sm:p-8">
          <SectionTitle eyebrow="Hafalan Pembeda" title="Tabel perbandingan cepat" description="Bagian ini penting untuk soal teori yang menukar ciri satu metode dengan metode lainnya." compact />
          <div className="mt-6 overflow-x-auto">
            <table className="min-w-[850px] w-full border-separate border-spacing-y-2 text-sm">
              <thead>
                <tr className="text-left text-slate-500">
                  <th className="px-4 py-3">Aspek</th>
                  <th className="px-4 py-3">SAW</th>
                  <th className="px-4 py-3">SMART</th>
                  <th className="px-4 py-3">TOPSIS</th>
                  <th className="px-4 py-3">AHP</th>
                </tr>
              </thead>
              <tbody>
                {materials.comparison.map((row) => (
                  <tr key={row.aspect} className="bg-slate-50 text-slate-700">
                    <td className="rounded-l-2xl border-y border-l border-slate-100 px-4 py-4 font-black text-slate-950">{row.aspect}</td>
                    <td className="border-y border-slate-100 px-4 py-4">{row.SAW}</td>
                    <td className="border-y border-slate-100 px-4 py-4">{row.SMART}</td>
                    <td className="border-y border-slate-100 px-4 py-4">{row.TOPSIS}</td>
                    <td className="rounded-r-2xl border-y border-r border-slate-100 px-4 py-4">{row.AHP}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </article>
      </section>

      <section id="latihan" className="mx-auto max-w-7xl scroll-mt-24 px-4 pb-14 sm:px-6 lg:px-8">
        <SectionTitle eyebrow="Latihan Pilihan Ganda" title="Bank 60 soal tingkat menengah–sulit" description="Pakai mode bank untuk belajar dan mode simulasi untuk mengerjakan 50 soal tanpa pembahasan sebelum dikumpulkan." />
        <div className="mt-7 rounded-[2rem] border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
          <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
            <div className="flex flex-wrap gap-2">
              <button type="button" className={quizMode === "bank" ? "mode-active" : "mode-idle"} onClick={() => changeMode("bank")}>
                <BookOpen className="h-4 w-4" /> Bank 60 Soal
              </button>
              <button type="button" className={quizMode === "simulation" ? "mode-active" : "mode-idle"} onClick={() => changeMode("simulation")}>
                <TimerReset className="h-4 w-4" /> Simulasi 50 Soal
              </button>
            </div>
            <div className="flex flex-wrap gap-3 text-sm font-bold">
              <InfoPill label="Ditampilkan" value={String(filteredQuestions.length)} />
              <InfoPill label="Dijawab" value={`${answeredCount}/${activeQuestions.length}`} />
              {(submitted || (quizMode === "bank" && revealInBank)) && <InfoPill label="Skor" value={`${score}%`} highlight />}
            </div>
          </div>

          <div className="mt-5 grid gap-3 border-t border-slate-100 pt-5 lg:grid-cols-[1.3fr_repeat(3,0.7fr)]">
            <label className="filter-input">
              <Search className="h-4 w-4 text-slate-400" />
              <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Cari konsep atau soal..." />
            </label>
            <FilterSelect value={topicFilter} onChange={(value) => setTopicFilter(value as TopicFilter)} options={topics} label="Materi" />
            <FilterSelect value={difficultyFilter} onChange={(value) => setDifficultyFilter(value as "Semua" | Difficulty)} options={difficulties} label="Kesulitan" />
            <FilterSelect value={typeFilter} onChange={(value) => setTypeFilter(value as "Semua" | QuestionType)} options={questionTypes} label="Tipe" />
          </div>

          <div className="mt-5 flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-slate-50 p-4">
            <p className="text-sm leading-6 text-slate-600">
              {quizMode === "bank"
                ? "Mode belajar: pembahasan dapat dibuka kapan saja setelah mencoba soal."
                : `Simulasi percobaan #${attempt}: pembahasan dan nilai baru tampil setelah dikumpulkan.`}
            </p>
            <div className="flex flex-wrap gap-2">
              {quizMode === "bank" ? (
                <button className="action-secondary" type="button" onClick={() => setRevealInBank((current) => !current)}>
                  {revealInBank ? "Tutup Pembahasan" : "Buka Pembahasan"}
                </button>
              ) : (
                <button className="action-primary" type="button" onClick={() => setSubmitted(true)} disabled={submitted}>
                  {submitted ? "Sudah Dikumpulkan" : "Kumpulkan Jawaban"}
                </button>
              )}
              <button className="action-secondary" type="button" onClick={newAttempt}>
                <RefreshCcw className="h-4 w-4" /> {quizMode === "simulation" ? "Simulasi Baru" : "Reset Jawaban"}
              </button>
            </div>
          </div>
        </div>

        <div className="mt-6 grid gap-4">
          {filteredQuestions.map((question, displayIndex) => (
            <QuestionCard
              key={`${quizMode}-${attempt}-${question.id}`}
              question={question}
              number={quizMode === "simulation" ? displayIndex + 1 : question.id}
              selected={answers[question.id]}
              reveal={canReveal}
              locked={quizMode === "simulation" && submitted}
              onChoose={(optionIndex) => chooseAnswer(question.id, optionIndex)}
            />
          ))}
        </div>
      </section>

      <footer className="border-t border-slate-200 bg-white/70 py-10">
        <div className="mx-auto flex max-w-7xl flex-col justify-between gap-5 px-4 text-sm text-slate-600 sm:px-6 lg:flex-row lg:items-center lg:px-8">
          <div>
            <p className="font-black text-slate-950">SPK UAS Mastery</p>
            <p className="mt-1">Materi dan soal disimpan ringan dalam <code>data/materials.json</code> dan <code>data/questions.json</code>.</p>
          </div>
          <div className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-4 py-2 font-semibold">
            <Database className="h-4 w-4" /> JSON Driven · No Image Assets · Ringan untuk Deploy
          </div>
        </div>
      </footer>
    </main>
  );
}

function Header() {
  return (
    <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/88 backdrop-blur-xl">
      <nav className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
        <a href="#" className="flex items-center gap-3">
          <span className="grid h-11 w-11 place-items-center rounded-2xl bg-slate-950 text-white">
            <BrainCircuit className="h-6 w-6" />
          </span>
          <span>
            <span className="block text-xs font-bold uppercase tracking-[0.24em] text-slate-500">UAS SPK</span>
            <span className="block text-lg font-black">Mastery Lab</span>
          </span>
        </a>
        <div className="flex items-center gap-2">
          <a href="#materi" className="nav-link">Materi</a>
          <a href="#latihan" className="nav-link">Latihan CBT</a>
        </div>
      </nav>
    </header>
  );
}

function QuickStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
      <p className="text-xs font-semibold text-slate-400">{label}</p>
      <p className="mt-1 text-2xl font-black">{value}</p>
    </div>
  );
}

function SectionTitle({ eyebrow, title, description, compact = false }: { eyebrow: string; title: string; description: string; compact?: boolean }) {
  return (
    <div className={compact ? "" : "max-w-3xl"}>
      <p className="eyebrow">{eyebrow}</p>
      <h2 className="mt-2 text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">{title}</h2>
      <p className="mt-3 text-sm leading-7 text-slate-600 sm:text-base">{description}</p>
    </div>
  );
}

function TopicCard({ topic, open, onToggle }: { topic: TopicMaterial; open: boolean; onToggle: () => void }) {
  return (
    <article className="surface overflow-hidden rounded-[2rem]">
      <button type="button" onClick={onToggle} className="flex w-full items-center justify-between gap-4 px-5 py-5 text-left sm:px-7 sm:py-6">
        <div className="flex items-center gap-4">
          <span className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-slate-950 text-sm font-black text-white">{topic.title}</span>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="text-lg font-black sm:text-xl">{topic.fullName}</h3>
              <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-bold text-blue-700">{topic.badge}</span>
            </div>
            <p className="mt-1 line-clamp-2 text-sm leading-6 text-slate-600">{topic.mainPurpose}</p>
          </div>
        </div>
        {open ? <ChevronUp className="h-5 w-5 shrink-0" /> : <ChevronDown className="h-5 w-5 shrink-0" />}
      </button>
      {open && (
        <div className="border-t border-slate-100 px-5 pb-7 pt-6 sm:px-7">
          <p className="rounded-2xl bg-slate-50 p-4 text-sm leading-7 text-slate-700">{topic.definition}</p>
          <div className="mt-6 grid gap-5 lg:grid-cols-2">
            <StudyPanel icon={<Layers3 className="h-5 w-5" />} title="Tahapan">
              <ol className="space-y-3">
                {topic.steps.map((step, index) => (
                  <li key={step} className="flex gap-3 text-sm leading-6 text-slate-700">
                    <span className="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full bg-slate-950 text-xs font-black text-white">{index + 1}</span>
                    <span>{step}</span>
                  </li>
                ))}
              </ol>
            </StudyPanel>
            <StudyPanel icon={<Calculator className="h-5 w-5" />} title="Rumus Kunci">
              <div className="space-y-3">
                {topic.formulas.map((formula) => (
                  <div key={formula.label} className="rounded-2xl bg-slate-950 p-4 text-white">
                    <p className="text-xs font-bold uppercase tracking-[0.18em] text-blue-300">{formula.label}</p>
                    <code className="mt-2 block overflow-x-auto text-sm font-bold text-white">{formula.expression}</code>
                    <p className="mt-2 text-xs leading-5 text-slate-300">{formula.meaning}</p>
                  </div>
                ))}
              </div>
            </StudyPanel>
            <StudyPanel icon={<CheckCircle2 className="h-5 w-5" />} title="Wajib Ingat">
              <BulletList items={topic.mustRemember} />
            </StudyPanel>
            <StudyPanel icon={<CircleAlert className="h-5 w-5" />} title="Jebakan Soal Teori">
              <BulletList items={topic.commonTraps} alert />
            </StudyPanel>
          </div>
          <div className="mt-5 rounded-2xl border border-blue-100 bg-blue-50 p-5">
            <p className="mb-3 flex items-center gap-2 text-sm font-black text-blue-900"><Database className="h-4 w-4" /> Kaitan Praktikum</p>
            <BulletList items={topic.implementation} />
          </div>
          {topic.saatyScale && topic.randomIndex && (
            <div className="mt-5 grid gap-5 lg:grid-cols-2">
              <MiniTable title="Skala Saaty" headers={["Nilai", "Makna"]} rows={topic.saatyScale.map((row) => [row.value, row.meaning])} />
              <MiniTable title="Random Index (RI)" headers={["n", "RI"]} rows={topic.randomIndex.map((row) => [String(row.n), row.ri])} />
            </div>
          )}
        </div>
      )}
    </article>
  );
}

function StudyPanel({ icon, title, children }: { icon: ReactNode; title: string; children: ReactNode }) {
  return (
    <div className="rounded-2xl border border-slate-100 p-5">
      <h4 className="mb-4 flex items-center gap-2 font-black text-slate-950">{icon}{title}</h4>
      {children}
    </div>
  );
}

function BulletList({ items, alert = false }: { items: string[]; alert?: boolean }) {
  return (
    <ul className="space-y-3">
      {items.map((item) => (
        <li key={item} className="flex gap-3 text-sm leading-6 text-slate-700">
          <span className={`mt-2 h-2 w-2 shrink-0 rounded-full ${alert ? "bg-orange-500" : "bg-blue-600"}`} />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

function MiniTable({ title, headers, rows }: { title: string; headers: string[]; rows: string[][] }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-100">
      <p className="border-b border-slate-100 bg-slate-50 px-4 py-3 text-sm font-black">{title}</p>
      <table className="w-full text-sm">
        <thead className="text-left text-slate-500">
          <tr>{headers.map((header) => <th key={header} className="px-4 py-3">{header}</th>)}</tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.join("-")} className="border-t border-slate-100">
              {row.map((cell) => <td key={cell} className="px-4 py-3 text-slate-700">{cell}</td>)}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function InfoPill({ label, value, highlight = false }: { label: string; value: string; highlight?: boolean }) {
  return (
    <span className={`rounded-full px-4 py-2 ${highlight ? "bg-blue-700 text-white" : "bg-slate-100 text-slate-700"}`}>
      {label}: <strong>{value}</strong>
    </span>
  );
}

function FilterSelect({ value, onChange, options, label }: { value: string; onChange: (value: string) => void; options: readonly string[]; label: string }) {
  return (
    <label className="filter-select">
      <span className="flex items-center gap-1 text-xs font-bold text-slate-500"><Filter className="h-3 w-3" />{label}</span>
      <select value={value} onChange={(event) => onChange(event.target.value)}>
        {options.map((option) => <option value={option} key={option}>{option}</option>)}
      </select>
    </label>
  );
}

function QuestionCard({ question, number, selected, reveal, locked, onChoose }: { question: Question; number: number; selected: number | undefined; reveal: boolean; locked: boolean; onChoose: (index: number) => void }) {
  const isCorrect = selected === question.answer;
  return (
    <article className="surface rounded-[1.75rem] p-5 sm:p-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="flex-1">
          <div className="flex flex-wrap gap-2">
            <span className="tag-dark">{question.topic}</span>
            <span className="tag-muted">{question.difficulty}</span>
            <span className={`tag-muted ${question.type === "Teori" ? "text-blue-700" : "text-orange-700"}`}>{question.type}</span>
            <span className="tag-muted hidden sm:inline-flex">{question.competency}</span>
          </div>
          <h3 className="mt-4 text-base font-black leading-7 sm:text-lg">{number}. {question.question}</h3>
        </div>
        {reveal && selected !== undefined && (
          <span className={`inline-flex items-center gap-1 rounded-full px-3 py-2 text-xs font-black ${isCorrect ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
            {isCorrect ? <CheckCircle2 className="h-4 w-4" /> : <XCircle className="h-4 w-4" />}
            {isCorrect ? "Benar" : "Salah"}
          </span>
        )}
      </div>
      <div className="mt-5 grid gap-3 lg:grid-cols-2">
        {question.options.map((option, optionIndex) => {
          const picked = selected === optionIndex;
          const correctOption = reveal && optionIndex === question.answer;
          const selectedWrong = reveal && picked && optionIndex !== question.answer;
          return (
            <button
              type="button"
              disabled={locked}
              key={option}
              onClick={() => onChoose(optionIndex)}
              className={`option ${picked ? "option-picked" : ""} ${correctOption ? "option-correct" : ""} ${selectedWrong ? "option-wrong" : ""}`}
            >
              <span className="option-key">{String.fromCharCode(65 + optionIndex)}</span>
              <span>{option}</span>
            </button>
          );
        })}
      </div>
      {reveal && (
        <div className="mt-5 rounded-2xl border border-blue-100 bg-blue-50 p-4 text-sm leading-7 text-slate-700">
          <p className="font-black text-blue-900">Jawaban: {String.fromCharCode(65 + question.answer)} · {question.materialRef}</p>
          <p className="mt-1">{question.explanation}</p>
        </div>
      )}
    </article>
  );
}
