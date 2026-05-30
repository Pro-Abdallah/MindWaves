import { AnimatePresence } from 'framer-motion';
import { useRideProgress } from './hooks/useRideProgress';
import IntroScreen from './components/IntroScreen';
import SceneCard from './components/SceneCard';
import ProgressWave from './components/ProgressWave';
import FinalPopup from './components/FinalPopup';
import SupportMeter from './components/SupportMeter';
// Reuse the same ocean background component as ABottleReturned for visual consistency
import OceanBackground from '../ABottleReturned/components/OceanBackground';
import './RideTheWaves.css';
// We need the ABottleReturned CSS for the ocean background classes
import '../ABottleReturned/ABottleReturned.css';

export default function RideTheWaves() {
  const {
    gameState,
    currentScene,
    sceneIndex,
    totalScenes,
    score,
    answeredCount,
    selectedChoice,
    startExperience,
    handleChoice,
    handleContinue,
    resetExperience
  } = useRideProgress();

  const isInGame = gameState === 'scene' || gameState === 'feedback';

  return (
    <div className="ride-the-waves">
      {/* Ocean background — same as ABottleReturned */}
      <OceanBackground isBlurred={false} />

      <AnimatePresence mode="wait">
        {gameState === 'intro' && (
          <IntroScreen key="intro" onStart={startExperience} />
        )}

        {isInGame && (
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
            onExit={() => window.history.back()}
          />
        )}
      </AnimatePresence>

      {/* Live Supportiveness Meter — visible during all active scenes */}
      {isInGame && (
        <SupportMeter
          score={score}
          totalScenes={totalScenes}
          answeredCount={answeredCount}
        />
      )}

      {/* Scene progress bar at bottom */}
      {isInGame && (
        <ProgressWave
          current={gameState === 'feedback' ? sceneIndex + 1 : sceneIndex}
          total={totalScenes}
        />
      )}
    </div>
  );
}
