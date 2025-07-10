import { useEffect, useState } from "react";

type Question = {
  id: number;
  question: string;
  options: string[];
  correctAnswers: number[];
};

export default function App() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState<number[]>([]);
  const [results, setResults] = useState<{ correct: number; total: number } | null>(null);

  useEffect(() => {
    fetch("/networkplus_questions.json")
      .then((res) => res.json())
      .then(setQuestions);
  }, []);

  if (questions.length === 0) return <p>Lade Fragen…</p>;

  const q = questions[current];

  const handleSelect = (index: number) => {
    setSelected((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  };

  const handleSubmit = () => {
    const correct = q.correctAnswers.sort().toString();
    const answer = selected.sort().toString();
    const isCorrect = correct === answer;
    const next = current + 1;

    if (next < questions.length) {
      setCurrent(next);
      setSelected([]);
      setResults((prev) =>
        prev ? { correct: prev.correct + (isCorrect ? 1 : 0), total: prev.total + 1 } : { correct: isCorrect ? 1 : 0, total: 1 }
      );
    } else {
      setResults((prev) =>
        prev ? { correct: prev.correct + (isCorrect ? 1 : 0), total: prev.total + 1 } : { correct: isCorrect ? 1 : 0, total: 1 }
      );
      setCurrent(-1);
    }
  };

  if (current === -1 && results) {
    return (
      <div style={{ padding: "2rem", maxWidth: 600, margin: "0 auto" }}>
        <h2>Ergebnis</h2>
        <p>
          Du hast {results.correct} von {results.total} Fragen richtig beantwortet.
        </p>
        <button onClick={() => { setCurrent(0); setResults(null); setSelected([]); }}>Nochmal starten</button>
      </div>
    );
  }

  return (
    <div style={{ padding: "2rem", maxWidth: 600, margin: "0 auto" }}>
      <h2>Frage {current + 1} von {questions.length}</h2>
      <p style={{ fontWeight: "bold" }}>{q.question}</p>
      <ul>
        {q.options.map((opt, idx) => (
          <li key={idx}>
            <button
              style={{
                display: "block",
                margin: "0.5rem 0",
                backgroundColor: selected.includes(idx) ? "#4caf50" : "#e0e0e0",
                padding: "0.5rem 1rem",
                border: "none",
                width: "100%",
                textAlign: "left",
                cursor: "pointer"
              }}
              onClick={() => handleSelect(idx)}
            >
              {opt}
            </button>
          </li>
        ))}
      </ul>
      <button onClick={handleSubmit}>Antwort einreichen</button>
    </div>
  );
}
