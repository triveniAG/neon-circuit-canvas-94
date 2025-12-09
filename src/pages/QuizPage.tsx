import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import CircuitHeader from "@/components/CircuitHeader";
import CircuitFooter from "@/components/CircuitFooter";
import CircuitBackground from "@/components/CircuitBackground";
import { Trophy, RotateCcw, CheckCircle, XCircle, Zap, Brain, Timer, ArrowRight } from "lucide-react";
import { toast } from "sonner";

interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
  category: string;
  componentName: string;
}

type QuizState = "start" | "playing" | "result";

const QuizPage = () => {
  const [quizState, setQuizState] = useState<QuizState>("start");
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [timeLeft, setTimeLeft] = useState(30);
  const [timerActive, setTimerActive] = useState(false);

  const { data: components, isLoading } = useQuery({
    queryKey: ["quiz-components"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("circuit_components")
        .select("*");
      if (error) throw error;
      return data;
    },
  });

  // Generate quiz questions from components
  const generateQuestions = () => {
    if (!components || components.length === 0) return;

    const generatedQuestions: QuizQuestion[] = [];
    const shuffledComponents = [...components].sort(() => Math.random() - 0.5);

    shuffledComponents.slice(0, 10).forEach((component, index) => {
      const questionTypes = [
        {
          question: `What is the primary application of a ${component.name}?`,
          correctAnswer: component.application,
          getOptions: () => {
            const otherApps = components
              .filter((c) => c.id !== component.id)
              .map((c) => c.application)
              .sort(() => Math.random() - 0.5)
              .slice(0, 3);
            return [...otherApps, component.application].sort(() => Math.random() - 0.5);
          },
          explanation: `${component.name} is primarily used for: ${component.application}`,
        },
        {
          question: `What does a ${component.name} do?`,
          correctAnswer: component.definition,
          getOptions: () => {
            const otherDefs = components
              .filter((c) => c.id !== component.id)
              .map((c) => c.definition)
              .sort(() => Math.random() - 0.5)
              .slice(0, 3);
            return [...otherDefs, component.definition].sort(() => Math.random() - 0.5);
          },
          explanation: `${component.name}: ${component.definition}`,
        },
        {
          question: `Why would you use a ${component.name} in a circuit?`,
          correctAnswer: component.why_used,
          getOptions: () => {
            const otherReasons = components
              .filter((c) => c.id !== component.id)
              .map((c) => c.why_used)
              .sort(() => Math.random() - 0.5)
              .slice(0, 3);
            return [...otherReasons, component.why_used].sort(() => Math.random() - 0.5);
          },
          explanation: `${component.name} is used because: ${component.why_used}`,
        },
      ];

      const selectedType = questionTypes[index % questionTypes.length];
      
      generatedQuestions.push({
        id: `q-${index}`,
        question: selectedType.question,
        options: selectedType.getOptions(),
        correctAnswer: selectedType.correctAnswer,
        explanation: selectedType.explanation,
        category: component.category || "General",
        componentName: component.name,
      });
    });

    setQuestions(generatedQuestions);
  };

  // Timer effect
  useEffect(() => {
    if (timerActive && timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && !isAnswered) {
      handleAnswer(null);
    }
  }, [timeLeft, timerActive, isAnswered]);

  const startQuiz = () => {
    generateQuestions();
    setQuizState("playing");
    setCurrentQuestionIndex(0);
    setScore(0);
    setSelectedAnswer(null);
    setIsAnswered(false);
    setTimeLeft(30);
    setTimerActive(true);
  };

  const handleAnswer = (answer: string | null) => {
    if (isAnswered) return;
    
    setSelectedAnswer(answer);
    setIsAnswered(true);
    setTimerActive(false);

    if (answer === questions[currentQuestionIndex]?.correctAnswer) {
      setScore(score + 1);
      toast.success("Correct! +1 point", { duration: 1500 });
    } else {
      toast.error("Incorrect!", { duration: 1500 });
    }
  };

  const nextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedAnswer(null);
      setIsAnswered(false);
      setTimeLeft(30);
      setTimerActive(true);
    } else {
      setQuizState("result");
      setTimerActive(false);
    }
  };

  const getScoreMessage = () => {
    const percentage = (score / questions.length) * 100;
    if (percentage === 100) return "Perfect Score! You're an electronics master!";
    if (percentage >= 80) return "Excellent! You really know your components!";
    if (percentage >= 60) return "Good job! Keep learning!";
    if (percentage >= 40) return "Not bad! Review the component library!";
    return "Keep practicing! Visit the library to learn more!";
  };

  const currentQuestion = questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      <CircuitBackground />
      <CircuitHeader />

      <main className="relative z-10 pt-24 pb-16">
        <div className="container mx-auto px-4 max-w-4xl">
          {/* Start Screen */}
          {quizState === "start" && (
            <Card className="glass-panel border-primary/30 animate-fade-in">
              <CardHeader className="text-center pb-4">
                <div className="mx-auto w-20 h-20 rounded-full bg-primary/20 flex items-center justify-center mb-4 animate-pulse-glow">
                  <Brain className="w-10 h-10 text-primary" />
                </div>
                <CardTitle className="text-3xl font-mono text-primary">
                  Electronics Component Quiz
                </CardTitle>
                <CardDescription className="text-muted-foreground text-lg mt-2">
                  Test your knowledge about electronic components, their applications, and uses!
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="glass-panel p-4 rounded-lg border border-primary/20 text-center">
                    <Zap className="w-8 h-8 text-secondary mx-auto mb-2" />
                    <h3 className="font-mono text-foreground">10 Questions</h3>
                    <p className="text-sm text-muted-foreground">Random selection</p>
                  </div>
                  <div className="glass-panel p-4 rounded-lg border border-primary/20 text-center">
                    <Timer className="w-8 h-8 text-secondary mx-auto mb-2" />
                    <h3 className="font-mono text-foreground">30 Seconds</h3>
                    <p className="text-sm text-muted-foreground">Per question</p>
                  </div>
                  <div className="glass-panel p-4 rounded-lg border border-primary/20 text-center">
                    <Trophy className="w-8 h-8 text-secondary mx-auto mb-2" />
                    <h3 className="font-mono text-foreground">Earn Points</h3>
                    <p className="text-sm text-muted-foreground">Track your score</p>
                  </div>
                </div>

                <Button
                  onClick={startQuiz}
                  disabled={isLoading || !components?.length}
                  className="w-full h-14 text-lg font-mono bg-primary hover:bg-primary/90 text-primary-foreground"
                >
                  {isLoading ? (
                    "Loading Components..."
                  ) : (
                    <>
                      <Zap className="w-5 h-5 mr-2" />
                      Start Quiz
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Playing Screen */}
          {quizState === "playing" && currentQuestion && (
            <div className="space-y-6 animate-fade-in">
              {/* Progress Bar */}
              <div className="glass-panel p-4 rounded-lg border border-primary/30">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-mono text-sm text-muted-foreground">
                    Question {currentQuestionIndex + 1} of {questions.length}
                  </span>
                  <div className="flex items-center gap-4">
                    <Badge variant="outline" className="border-secondary text-secondary">
                      <Trophy className="w-3 h-3 mr-1" />
                      Score: {score}
                    </Badge>
                    <Badge 
                      variant="outline" 
                      className={`border-primary ${timeLeft <= 10 ? 'text-destructive border-destructive animate-pulse' : 'text-primary'}`}
                    >
                      <Timer className="w-3 h-3 mr-1" />
                      {timeLeft}s
                    </Badge>
                  </div>
                </div>
                <Progress value={progress} className="h-2" />
              </div>

              {/* Question Card */}
              <Card className="glass-panel border-primary/30">
                <CardHeader>
                  <Badge className="w-fit mb-2 bg-secondary/20 text-secondary border-secondary/50">
                    {currentQuestion.category}
                  </Badge>
                  <CardTitle className="text-xl font-mono text-foreground leading-relaxed">
                    {currentQuestion.question}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {currentQuestion.options.map((option, index) => {
                    const isCorrect = option === currentQuestion.correctAnswer;
                    const isSelected = option === selectedAnswer;
                    
                    let buttonClass = "w-full p-4 text-left font-mono text-sm border rounded-lg transition-all duration-300 ";
                    
                    if (isAnswered) {
                      if (isCorrect) {
                        buttonClass += "border-green-500 bg-green-500/20 text-green-400";
                      } else if (isSelected && !isCorrect) {
                        buttonClass += "border-destructive bg-destructive/20 text-destructive";
                      } else {
                        buttonClass += "border-muted bg-muted/10 text-muted-foreground opacity-50";
                      }
                    } else {
                      buttonClass += "border-primary/30 bg-background/50 text-foreground hover:border-primary hover:bg-primary/10 cursor-pointer";
                    }

                    return (
                      <button
                        key={index}
                        onClick={() => handleAnswer(option)}
                        disabled={isAnswered}
                        className={buttonClass}
                      >
                        <div className="flex items-center gap-3">
                          <span className="w-8 h-8 rounded-full border border-current flex items-center justify-center text-xs">
                            {String.fromCharCode(65 + index)}
                          </span>
                          <span className="flex-1">{option}</span>
                          {isAnswered && isCorrect && (
                            <CheckCircle className="w-5 h-5 text-green-500" />
                          )}
                          {isAnswered && isSelected && !isCorrect && (
                            <XCircle className="w-5 h-5 text-destructive" />
                          )}
                        </div>
                      </button>
                    );
                  })}

                  {/* Explanation */}
                  {isAnswered && (
                    <div className="mt-4 p-4 rounded-lg border border-secondary/30 bg-secondary/10 animate-fade-in">
                      <p className="text-sm text-muted-foreground font-mono">
                        <span className="text-secondary font-semibold">Explanation:</span>{" "}
                        {currentQuestion.explanation}
                      </p>
                    </div>
                  )}

                  {/* Next Button */}
                  {isAnswered && (
                    <Button
                      onClick={nextQuestion}
                      className="w-full mt-4 h-12 font-mono bg-primary hover:bg-primary/90"
                    >
                      {currentQuestionIndex < questions.length - 1 ? (
                        <>
                          Next Question
                          <ArrowRight className="w-4 h-4 ml-2" />
                        </>
                      ) : (
                        <>
                          See Results
                          <Trophy className="w-4 h-4 ml-2" />
                        </>
                      )}
                    </Button>
                  )}
                </CardContent>
              </Card>
            </div>
          )}

          {/* Results Screen */}
          {quizState === "result" && (
            <Card className="glass-panel border-primary/30 animate-fade-in">
              <CardHeader className="text-center pb-4">
                <div className="mx-auto w-24 h-24 rounded-full bg-secondary/20 flex items-center justify-center mb-4">
                  <Trophy className="w-12 h-12 text-secondary animate-pulse-glow" />
                </div>
                <CardTitle className="text-3xl font-mono text-primary">
                  Quiz Complete!
                </CardTitle>
                <CardDescription className="text-lg mt-2">
                  {getScoreMessage()}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Score Display */}
                <div className="glass-panel p-8 rounded-lg border border-primary/30 text-center">
                  <div className="text-6xl font-mono font-bold text-primary mb-2">
                    {score}/{questions.length}
                  </div>
                  <p className="text-muted-foreground">
                    {Math.round((score / questions.length) * 100)}% Accuracy
                  </p>
                  <Progress 
                    value={(score / questions.length) * 100} 
                    className="h-3 mt-4" 
                  />
                </div>

                {/* Performance Breakdown */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="glass-panel p-4 rounded-lg border border-green-500/30 text-center">
                    <CheckCircle className="w-8 h-8 text-green-500 mx-auto mb-2" />
                    <div className="text-2xl font-mono text-green-500">{score}</div>
                    <p className="text-sm text-muted-foreground">Correct</p>
                  </div>
                  <div className="glass-panel p-4 rounded-lg border border-destructive/30 text-center">
                    <XCircle className="w-8 h-8 text-destructive mx-auto mb-2" />
                    <div className="text-2xl font-mono text-destructive">{questions.length - score}</div>
                    <p className="text-sm text-muted-foreground">Incorrect</p>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button
                    onClick={startQuiz}
                    className="flex-1 h-12 font-mono bg-primary hover:bg-primary/90"
                  >
                    <RotateCcw className="w-4 h-4 mr-2" />
                    Try Again
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => window.location.href = "/library"}
                    className="flex-1 h-12 font-mono border-secondary text-secondary hover:bg-secondary/10"
                  >
                    <Brain className="w-4 h-4 mr-2" />
                    Study Components
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </main>

      <CircuitFooter />
    </div>
  );
};

export default QuizPage;
