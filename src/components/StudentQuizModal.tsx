import React, { useState } from 'react';
import { QUIZ_QUESTIONS } from '../data/mockData';
import { 
  BookOpen, 
  CheckCircle2, 
  XCircle, 
  HelpCircle, 
  RotateCcw, 
  Award,
  X
} from 'lucide-react';

interface StudentQuizModalProps {
  onClose: () => void;
}

export const StudentQuizModal: React.FC<StudentQuizModalProps> = ({ onClose }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [userAnswers, setUserAnswers] = useState<Record<number, number>>({});
  const [showResults, setShowResults] = useState<boolean>(false);

  const currentQ = QUIZ_QUESTIONS[currentQuestionIndex];
  const totalQuestions = QUIZ_QUESTIONS.length;

  const handleSelectOption = (optionIndex: number) => {
    setUserAnswers(prev => ({
      ...prev,
      [currentQ.id]: optionIndex
    }));
  };

  const handleNext = () => {
    if (currentQuestionIndex < totalQuestions - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      setShowResults(true);
    }
  };

  const handlePrev = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

  const handleResetQuiz = () => {
    setUserAnswers({});
    setCurrentQuestionIndex(0);
    setShowResults(false);
  };

  const correctAnswersCount = QUIZ_QUESTIONS.reduce((count, q) => {
    return userAnswers[q.id] === q.correctIndex ? count + 1 : count;
  }, 0);

  const finalScore = Math.round((correctAnswersCount / totalQuestions) * 100);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-2xl w-full p-6 space-y-5 max-h-[90vh] overflow-y-auto text-slate-100 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-emerald-400" />
            <h3 className="text-base font-bold text-white">
              Kuis Evaluasi Pemahaman Mahasiswa Teknik Logistik
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded text-slate-400 hover:text-white hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {!showResults ? (
          <div className="space-y-5">
            {/* Progress counter */}
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span>Pertanyaan {currentQuestionIndex + 1} dari {totalQuestions}</span>
              <span className="font-mono">{Math.round(((currentQuestionIndex + 1) / totalQuestions) * 100)}%</span>
            </div>
            <div className="w-full bg-slate-950 rounded-full h-1.5 overflow-hidden">
              <div
                className="bg-emerald-500 h-full transition-all"
                style={{ width: `${((currentQuestionIndex + 1) / totalQuestions) * 100}%` }}
              />
            </div>

            {/* Question Text */}
            <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl">
              <h4 className="text-sm font-semibold text-white leading-relaxed">
                {currentQ.question}
              </h4>
            </div>

            {/* Options */}
            <div className="space-y-2.5">
              {currentQ.options.map((option, idx) => {
                const isSelected = userAnswers[currentQ.id] === idx;
                return (
                  <button
                    key={idx}
                    onClick={() => handleSelectOption(idx)}
                    className={`w-full text-left p-3.5 rounded-xl text-xs transition-all border flex items-center gap-3 ${
                      isSelected
                        ? 'bg-emerald-950/60 border-emerald-500 text-white font-medium ring-1 ring-emerald-500'
                        : 'bg-slate-950 border-slate-800 hover:border-slate-700 text-slate-300'
                    }`}
                  >
                    <span className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 text-[10px] font-bold ${
                      isSelected ? 'bg-emerald-500 text-white' : 'bg-slate-800 text-slate-400'
                    }`}>
                      {String.fromCharCode(65 + idx)}
                    </span>
                    <span className="flex-1">{option}</span>
                  </button>
                );
              })}
            </div>

            {/* Navigation buttons */}
            <div className="flex items-center justify-between pt-3 border-t border-slate-800">
              <button
                onClick={handlePrev}
                disabled={currentQuestionIndex === 0}
                className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 disabled:opacity-30 text-slate-300 text-xs rounded transition-colors"
              >
                Sebelumnya
              </button>

              <button
                onClick={handleNext}
                disabled={userAnswers[currentQ.id] === undefined}
                className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 text-white text-xs font-semibold rounded transition-colors"
              >
                {currentQuestionIndex === totalQuestions - 1 ? 'Selesai & Lihat Skor' : 'Selanjutnya'}
              </button>
            </div>
          </div>
        ) : (
          /* Results Screen */
          <div className="space-y-5 text-center py-4">
            <div className="w-16 h-16 rounded-full bg-emerald-950 border-2 border-emerald-500 text-emerald-400 flex items-center justify-center mx-auto">
              <Award className="w-8 h-8" />
            </div>

            <div className="space-y-1">
              <h4 className="text-xl font-bold text-white">Hasil Ujian Kuis Mahasiswa</h4>
              <p className="text-xs text-slate-400">
                Topik: IoT, EOQ, Blockchain, Green Logistics, UU JPH, dan HCCP
              </p>
            </div>

            <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl inline-block px-8">
              <span className="text-4xl font-extrabold font-mono text-emerald-400">{finalScore}</span>
              <span className="text-xs text-slate-400 block mt-1">
                {correctAnswersCount} dari {totalQuestions} Soal Terjawab Benar
              </span>
            </div>

            {/* Explanations summary */}
            <div className="text-left space-y-3 pt-3 max-h-60 overflow-y-auto pr-1">
              {QUIZ_QUESTIONS.map((q, i) => {
                const userChoice = userAnswers[q.id];
                const isCorrect = userChoice === q.correctIndex;
                return (
                  <div key={q.id} className="p-3 bg-slate-950 border border-slate-800 rounded-lg text-xs space-y-1">
                    <div className="flex items-center gap-1.5 font-semibold text-white">
                      {isCorrect ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                      ) : (
                        <XCircle className="w-4 h-4 text-rose-400 shrink-0" />
                      )}
                      <span>{i + 1}. {q.question}</span>
                    </div>
                    <p className="text-slate-400 text-[11px] pl-5">{q.explanation}</p>
                  </div>
                );
              })}
            </div>

            <div className="flex justify-center gap-3 pt-2">
              <button
                onClick={handleResetQuiz}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium rounded flex items-center gap-1.5"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Ulangi Kuis</span>
              </button>
              <button
                onClick={onClose}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold rounded"
              >
                Tutup Evaluasi
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
