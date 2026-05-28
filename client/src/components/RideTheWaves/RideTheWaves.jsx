import { AnimatePresence } from 'framer-motion';
import { useRideProgress } from './hooks/useRideProgress';
import IntroScreen from './components/IntroScreen';
import SceneCard from './components/SceneCard';
import ProgressWave from './components/ProgressWave';
import FinalPopup from './components/FinalPopup';
import './RideTheWaves.css';

export default function RideTheWaves() {
  const {
    gameState,
    currentScene,
    sceneIndex,
    totalScenes,
    score,
    selectedChoice,
    startExperience,
    handleChoice,
    handleContinue,
    resetExperience
  } = useRideProgress();

  return (
    <div className="ride-the-waves">
      {(gameState === 'intro' || gameState === 'finished') && (
        <div className="ride-bg-image" />
      )}
      
      <AnimatePresence mode="wait">
        {gameState === 'intro' && (
          <IntroScreen key="intro" onStart={startExperience} />
        )}

        {(gameState === 'scene' || gameState === 'feedback') && (
          <SceneCard 
            key={`scene-${currentScene.id}`}
            scene={currentScene} 
            onChoice={handleChoice}
            selectedChoice={selectedChoice}
            showFeedback={gameState === 'feedback'}
            onContinue={handleContinue}
          />
        )}

        {gameState === 'finished' && (
          <FinalPopup 
            key="final"
            score={score}
            totalScenes={totalScenes}
            onRetry={resetExperience}
            onExit={() => window.history.back()} // Basic exit back to previous route
          />
        )}
      </AnimatePresence>

      {/* Progress wave only shows during active scenes */}
      {(gameState === 'scene' || gameState === 'feedback') && (
        <ProgressWave 
          current={gameState === 'feedback' ? sceneIndex + 1 : sceneIndex} 
          total={totalScenes} 
        />
      )}
    </div>
  );
}
