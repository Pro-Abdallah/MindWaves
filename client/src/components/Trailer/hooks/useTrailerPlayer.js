import { useState, useRef, useCallback } from 'react';

export function useTrailerPlayer() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [hasPlayed, setHasPlayed] = useState(false);
  const iframeRef = useRef(null);

  const openModal = useCallback(() => {
    setIsModalOpen(true);
    setHasPlayed(true);
    // Prevent body scroll when modal is open
    document.body.style.overflow = 'hidden';
  }, []);

  const closeModal = useCallback(() => {
    setIsModalOpen(false);
    document.body.style.overflow = '';
  }, []);

  return {
    isModalOpen,
    hasPlayed,
    iframeRef,
    openModal,
    closeModal,
  };
}
