import React from 'react';
import { motion } from 'framer-motion';
import './PaperMessageCard.css';

const SIGN_OFFS = [
  "in memory of her",
  "from a fellow wave",
  "written at dawn",
  "from the deep",
  "carried a long way",
  "from the shore",
  "a quiet echo",
  "found adrift",
  "for you",
  "until we meet again"
];

export default function PaperMessageCard({ message, index }) {
  // Use index to consistently pick a sign-off
  const signOff = SIGN_OFFS[index % SIGN_OFFS.length];

  return (
    <motion.div 
      className="paper-message-card"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.8, delay: (index % 5) * 0.1 }}
    >
      <div className="paper-texture"></div>
      <div className="paper-tape top-left"></div>
      <div className="paper-tape bottom-right"></div>
      
      <div className="quote-mark">“</div>
      
      <p className="paper-text">
        {message.text}
      </p>
      
      <p className="paper-signoff">
        • {signOff}
      </p>
    </motion.div>
  );
}
