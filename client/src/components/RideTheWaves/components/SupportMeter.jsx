import { motion } from 'framer-motion';

export default function SupportMeter({ score, totalScenes, answeredCount }) {
  // Same scoring logic as FinalPopup: map score from (-totalScenes .. +totalScenes) to 0..100
  const normalizedScore = score + totalScenes; // 0 to 2*totalScenes
  const maxScore = totalScenes * 2;
  const percentage = Math.max(0, Math.min(100, (normalizedScore / maxScore) * 100));

  // Color based on score
  let barColor, label;
  if (score >= 2) {
    barColor = '#4ade80';
    label = 'Supportive';
  } else if (score <= -2) {
    barColor = '#f87171';
    label = 'Harmful';
  } else {
    barColor = '#fbbf24';
    label = 'Mixed';
  }

  // Don't render until at least one answer
  if (answeredCount === 0) return null;

  return (
    <motion.div
      className="support-meter"
      initial={{ opacity: 0, x: 40 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
    >
      <div className="support-meter-header">
        <span className="support-meter-title">Supportiveness</span>
        <span className="support-meter-label" style={{ color: barColor }}>{label}</span>
      </div>
      <div className="support-meter-track">
        <motion.div
          className="support-meter-fill"
          animate={{ width: `${percentage}%`, backgroundColor: barColor, boxShadow: `0 0 12px ${barColor}` }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        />
      </div>
      <div className="support-meter-scenes">
        {answeredCount} / {totalScenes} scenes
      </div>
    </motion.div>
  );
}
