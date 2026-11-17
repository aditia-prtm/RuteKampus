import { useState, useEffect, useCallback, useRef } from 'react';

/**
 * Custom hook untuk mengontrol pemutaran langkah visualisasi algoritma (play/pause/step/speed).
 *
 * @param {Array<any>} steps Daftar langkah dari solveCPP()
 * @param {number} [initialSpeed=1000] Interval waktu per langkah dalam milidetik
 */
export function useStepPlayer(steps = [], initialSpeed = 1200) {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(initialSpeed); // ms per step

  const stepsLength = steps ? steps.length : 0;
  const isPlayingRef = useRef(isPlaying);
  isPlayingRef.current = isPlaying;

  // Reset ke awal jika daftar steps berganti
  useEffect(() => {
    setCurrentStepIndex(0);
    setIsPlaying(false);
  }, [stepsLength]);

  const nextStep = useCallback(() => {
    setCurrentStepIndex((prev) => {
      if (prev < stepsLength - 1) {
        return prev + 1;
      }
      setIsPlaying(false);
      return prev;
    });
  }, [stepsLength]);

  const prevStep = useCallback(() => {
    setCurrentStepIndex((prev) => Math.max(0, prev - 1));
  }, []);

  const goToStep = useCallback((index) => {
    if (index >= 0 && index < stepsLength) {
      setCurrentStepIndex(index);
    }
  }, [stepsLength]);

  const togglePlay = useCallback(() => {
    if (currentStepIndex >= stepsLength - 1) {
      setCurrentStepIndex(0);
      setIsPlaying(true);
    } else {
      setIsPlaying((prev) => !prev);
    }
  }, [currentStepIndex, stepsLength]);

  const restart = useCallback(() => {
    setIsPlaying(false);
    setCurrentStepIndex(0);
  }, []);

  // Interval otomatis ketika isPlaying aktif
  useEffect(() => {
    if (!isPlaying) return;

    const timer = setInterval(() => {
      setCurrentStepIndex((prev) => {
        if (prev < stepsLength - 1) {
          return prev + 1;
        } else {
          setIsPlaying(false);
          return prev;
        }
      });
    }, speed);

    return () => clearInterval(timer);
  }, [isPlaying, speed, stepsLength]);

  return {
    currentStepIndex,
    currentStep: steps && steps[currentStepIndex] ? steps[currentStepIndex] : null,
    totalSteps: stepsLength,
    isFirstStep: currentStepIndex === 0,
    isLastStep: currentStepIndex >= stepsLength - 1,
    isPlaying,
    speed,
    setSpeed,
    nextStep,
    prevStep,
    goToStep,
    togglePlay,
    restart
  };
}
