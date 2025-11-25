import React, { useState, useMemo, useEffect } from 'react';
import { QUIZ_DATA, QuizItem } from '../quizData';
import { BrainCircuit, Check, X, ChevronDown, RotateCcw, ThumbsUp, ThumbsDown, SkipForward, ChevronLeft, ChevronRight } from 'lucide-react';

// Função para embaralhar um array
const shuffleArray = (array: any[]) => {
  let currentIndex = array.length, randomIndex;
  while (currentIndex !== 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;
    [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
  }
  return array;
};

const QuizView: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [questions, setQuestions] = useState<QuizItem[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [isAnswerVisible, setIsAnswerVisible] = useState(false);
  const [scores, setScores] = useState({ correct: 0, incorrect: 0 });
  const [isFinished, setIsFinished] = useState(false);

  const categories = useMemo(() => ['all', ...Array.from(new Set(QUIZ_DATA.map(q => q.category)))], []);

  // Inicia ou reinicia o quiz quando a categoria muda
  const startQuiz = (category: string) => {
    setSelectedCategory(category);
    const filteredQuestions = category === 'all' 
      ? QUIZ_DATA 
      : QUIZ_DATA.filter(q => q.category === category);
    
    setQuestions(shuffleArray([...filteredQuestions]));
    setCurrentQuestionIndex(0);
    setScores({ correct: 0, incorrect: 0 });
    setIsAnswerVisible(false);
    setIsFinished(false);
  };

  useEffect(() => {
    startQuiz('all'); // Inicia com todas as questões por padrão
  }, []);

  const handleRevealAnswer = () => setIsAnswerVisible(true);

  const goToNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setIsAnswerVisible(false);
    } else {
      setIsFinished(true);
    }
  };
  
  const handlePreviousQuestion = () => {
      if (currentQuestionIndex > 0) {
        setCurrentQuestionIndex(prev => prev - 1);
        setIsAnswerVisible(false); // Sempre esconde a resposta ao navegar
      }
  };
  
  const handleNextQuestion = () => {
      if (currentQuestionIndex < questions.length - 1) {
        setCurrentQuestionIndex(prev => prev + 1);
        setIsAnswerVisible(false); // Sempre esconde a resposta ao navegar
      }
  };

  const handleScore = (result: 'correct' | 'incorrect') => {
    setScores(prev => ({ ...prev, [result]: prev[result] + 1 }));
    goToNextQuestion();
  };
  
  const currentQuestion = questions[currentQuestionIndex];

  return (
    <div className="w-full max-w-4xl mx-auto flex flex-col items-center animate-in pb-12">
      <div className="text-center space-y-2 mb-8">
        <h2 className="text-3xl font-black text-slate-800 tracking-tight flex items-center justify-center gap-3">
          <BrainCircuit className="w-8 h-8 text-emerald-500" />
          Questões de Prova
        </h2>
        <p className="text-slate-500 text-sm max-w-lg mx-auto">
          Teste seus conhecimentos com questões no estilo flashcard. Selecione uma categoria e comece!
        </p>
      </div>

      {/* Painel de Controle */}
      <div className="w-full bg-white border border-slate-200 rounded-2xl shadow-lg p-4 mb-8 flex flex-col sm:flex-row items-center justify-between gap-4 sticky top-44 z-20">
        <div className="relative w-full sm:w-auto">
          <select 
            className="appearance-none w-full sm:min-w-[250px] pl-4 pr-10 py-2 text-sm font-bold border border-slate-200 rounded-lg shadow-sm bg-slate-50 hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 cursor-pointer text-slate-700"
            value={selectedCategory}
            onChange={(e) => startQuiz(e.target.value)}
          >
            <option value="all">Todas as Categorias</option>
            {categories.slice(1).map(c => <option key={c} value={c}>{c}</option>)}
          </select>
          <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
            <ChevronDown className="h-4 w-4 text-slate-400" />
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-3 text-sm font-bold">
          <div className="flex items-center gap-2 text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-full">
            <Check className="w-4 h-4" />
            <span>Acertos: {scores.correct}</span>
          </div>
          <div className="flex items-center gap-2 text-rose-600 bg-rose-50 px-3 py-1.5 rounded-full">
            <X className="w-4 h-4" />
            <span>Erros: {scores.incorrect}</span>
          </div>
          <button
            onClick={() => startQuiz(selectedCategory)}
            className="flex items-center gap-2 text-slate-600 bg-slate-100 px-3 py-1.5 rounded-full hover:bg-slate-200 transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Reiniciar</span>
          </button>
        </div>
      </div>

      {isFinished ? (
        <div className="text-center bg-white p-10 rounded-2xl shadow-xl border w-full animate-zoom-in">
          <h3 className="text-2xl font-black text-slate-800">Sessão Finalizada!</h3>
          <p className="text-slate-500 mt-2">Você concluiu todas as questões desta categoria.</p>
          <div className="my-6 text-xl font-bold flex justify-center gap-6">
             <span className="text-emerald-600">Acertos: {scores.correct}</span>
             <span className="text-rose-600">Erros: {scores.incorrect}</span>
          </div>
          <button
            onClick={() => startQuiz(selectedCategory)}
            className="bg-emerald-600 text-white font-semibold py-3 px-6 rounded-lg shadow-lg hover:bg-emerald-700 transition-all transform hover:scale-105 flex items-center gap-2 mx-auto"
          >
            <RotateCcw className="w-4 h-4" />
            Recomeçar
          </button>
        </div>
      ) : questions.length > 0 && currentQuestion ? (
        <div className="w-full">
            {/* Card da Questão */}
            <div className="bg-white rounded-2xl shadow-xl border border-slate-200 p-6 sm:p-8 min-h-[300px] flex flex-col justify-between">
                <div>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">
                        Questão {currentQuestionIndex + 1} de {questions.length}
                    </p>
                    <p className="text-lg font-semibold text-slate-800 leading-relaxed whitespace-pre-line">
                        {currentQuestion.question}
                    </p>
                    {isAnswerVisible && (
                        <div className="mt-6 pt-6 border-t border-dashed border-slate-200 animate-fade-in">
                            <p className="text-sm font-bold text-emerald-700 uppercase tracking-wider mb-2">Resposta:</p>
                            <p className="text-md text-slate-700 font-medium leading-relaxed whitespace-pre-line">
                                {currentQuestion.answer}
                            </p>
                        </div>
                    )}
                </div>
                
                {/* Credits Section */}
                {currentQuestion.category !== 'Prova Final A' && currentQuestion.category !== 'Prova Final B' && (
                    <div className="mt-6 text-right">
                        <p className="text-xs italic text-slate-400">
                            Questão concedida por Grupo de Monitoria UIT (Pedro Antônio e Thiago Hey).
                        </p>
                    </div>
                )}
            </div>

            {/* Botões de Ação */}
            <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3">
                {!isAnswerVisible ? (
                    <div className="w-full flex justify-center items-center gap-3">
                        <button
                            onClick={handlePreviousQuestion}
                            disabled={currentQuestionIndex === 0}
                            className="w-auto flex items-center justify-center gap-2 bg-slate-200 text-slate-600 font-semibold py-3 px-5 rounded-lg hover:bg-slate-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <ChevronLeft className="w-4 h-4"/>
                        </button>
                        <button
                            onClick={handleRevealAnswer}
                            className="w-full sm:w-auto bg-medical-600 text-white font-semibold py-3 px-8 rounded-lg shadow-lg hover:bg-medical-700 transition-all transform hover:scale-105"
                        >
                            Revelar Resposta
                        </button>
                        <button
                            onClick={handleNextQuestion}
                            disabled={currentQuestionIndex === questions.length - 1}
                            className="w-auto flex items-center justify-center gap-2 bg-slate-200 text-slate-600 font-semibold py-3 px-5 rounded-lg hover:bg-slate-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <ChevronRight className="w-4 h-4"/>
                        </button>
                    </div>
                ) : (
                    <>
                        <button
                            onClick={() => handleScore('incorrect')}
                            className="w-full sm:w-auto flex items-center justify-center gap-2 bg-rose-500 text-white font-semibold py-3 px-6 rounded-lg shadow-lg hover:bg-rose-600 transition-all transform hover:scale-105"
                        >
                            <ThumbsDown className="w-4 h-4"/> Errei
                        </button>
                        <button
                            onClick={() => handleScore('correct')}
                            className="w-full sm:w-auto flex items-center justify-center gap-2 bg-emerald-500 text-white font-semibold py-3 px-6 rounded-lg shadow-lg hover:bg-emerald-600 transition-all transform hover:scale-105"
                        >
                            <ThumbsUp className="w-4 h-4"/> Acertei
                        </button>
                        <button
                            onClick={goToNextQuestion}
                            className="w-full sm:w-auto flex items-center justify-center gap-2 bg-slate-200 text-slate-600 font-semibold py-3 px-6 rounded-lg hover:bg-slate-300 transition-colors"
                        >
                             Pular <SkipForward className="w-4 h-4"/>
                        </button>
                    </>
                )}
            </div>
        </div>
      ) : (
        <div className="text-center p-10">
            <p className="text-slate-500">Carregando questões...</p>
        </div>
      )}
    </div>
  );
};

export default QuizView;