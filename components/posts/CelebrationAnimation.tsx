'use client';

import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

interface CelebrationAnimationProps {
  isVisible: boolean;
  onComplete?: () => void;
}

interface Particle {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  color: string;
  size: number;
  rotation: number;
  rotationSpeed: number;
}

const colors = ['#10B981', '#3B82F6', '#F59E0B', '#EF4444', '#8B5CF6', '#06B6D4'];
const emojis = ['🎉', '✨', '🎊', '💚', '🌟', '🏆'];

export function CelebrationAnimation({ isVisible, onComplete }: CelebrationAnimationProps) {
  const [particles, setParticles] = useState<Particle[]>([]);
  const [showMessage, setShowMessage] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!isVisible) return;

    // Create particles
    const newParticles: Particle[] = [];
    for (let i = 0; i < 50; i++) {
      newParticles.push({
        id: i,
        x: window.innerWidth / 2,
        y: window.innerHeight / 2,
        vx: (Math.random() - 0.5) * 15,
        vy: (Math.random() - 0.5) * 15 - 5,
        color: colors[Math.floor(Math.random() * colors.length)],
        size: Math.random() * 8 + 4,
        rotation: Math.random() * 360,
        rotationSpeed: (Math.random() - 0.5) * 10,
      });
    }
    setParticles(newParticles);
    setShowMessage(true);

    // Animate particles
    const interval = setInterval(() => {
      setParticles(prev => prev.map(particle => ({
        ...particle,
        x: particle.x + particle.vx,
        y: particle.y + particle.vy,
        vy: particle.vy + 0.3, // gravity
        rotation: particle.rotation + particle.rotationSpeed,
      })));
    }, 16);

    // Hide animation after 3 seconds
    const timeout = setTimeout(() => {
      setParticles([]);
      setShowMessage(false);
      if (onComplete) {
        onComplete();
      }
    }, 3000);

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, [isVisible, onComplete]);

  if (!mounted || !isVisible) return null;

  const CelebrationContent = () => (
    <div className="fixed inset-0 z-50 pointer-events-none">
      {/* Particles */}
      {particles.map(particle => (
        <div
          key={particle.id}
          className="absolute w-2 h-2 rounded-full"
          style={{
            left: particle.x,
            top: particle.y,
            backgroundColor: particle.color,
            width: particle.size,
            height: particle.size,
            transform: `rotate(${particle.rotation}deg)`,
          }}
        />
      ))}

      {/* Center message */}
      {showMessage && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="bg-white rounded-2xl shadow-2xl border-4 border-green-500 p-8 text-center animate-bounce max-w-md mx-4">
            <div className="text-6xl mb-4">🎉</div>
            <h2 className="text-2xl font-bold text-green-600 mb-2">
              Cleanup Complete!
            </h2>
            <p className="text-gray-600 mb-4">
              Amazing work! This area is now cleaner thanks to your efforts.
            </p>
            <div className="flex justify-center space-x-2 text-2xl">
              {emojis.map((emoji, index) => (
                <span 
                  key={index} 
                  className="animate-pulse"
                  style={{ animationDelay: `${index * 0.2}s` }}
                >
                  {emoji}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Background overlay */}
      {showMessage && (
        <div className="absolute inset-0 bg-black bg-opacity-20" />
      )}
    </div>
  );

  return createPortal(<CelebrationContent />, document.body);
}