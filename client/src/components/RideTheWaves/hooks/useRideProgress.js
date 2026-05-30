import { useState, useCallback } from 'react';
import { scenes } from '../data/scenes';

export function useRideProgress() {
  const [gameState, setGameState] = useState('intro'); // intro, scene, feedback, finished
  const [currentSceneIndex, setCurrentSceneIndex] = useState(0);
  const [score, setScore] = useState(0); // +1 supportive, -1 harmful
  const [selectedChoice, setSelectedChoice] = useState(null);
  const [answeredCount, setAnsweredCount] = useState(0);

  const startExperience = useCallback(() => {
    setGameState('scene');
    setCurrentSceneIndex(0);
    setScore(0);
    setSelectedChoice(null);
    setAnsweredCount(0);
  }, []);

  const handleChoice = useCallback((choice) => {
    setSelectedChoice(choice);
    setAnsweredCount(prev => prev + 1);
    if (choice.isSupportive) {
      setScore(prev => prev + 1);
    } else {
      setScore(prev => prev - 1);
    }
    setGameState('feedback');
  }, []);

  const handleContinue = useCallback(() => {
    if (currentSceneIndex < scenes.length - 1) {
      setCurrentSceneIndex(prev => prev + 1);
      setGameState('scene');
      setSelectedChoice(null);
    } else {
      setGameState('finished');
    }
  }, [currentSceneIndex]);

  const resetExperience = useCallback(() => {
    setGameState('intro');
    setCurrentSceneIndex(0);
    setScore(0);
    setSelectedChoice(null);
    setAnsweredCount(0);
  }, []);

  return {
    gameState,
    currentScene: scenes[currentSceneIndex],
    sceneIndex: currentSceneIndex,
    totalScenes: scenes.length,
    score,
    answeredCount,
    selectedChoice,
    startExperience,
    handleChoice,
    handleContinue,
    resetExperience
  };
}
