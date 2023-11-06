// src/components/Confetti.tsx

const Confetti: React.FC = () => {
  const confettiCount = 100;
  const confettis = Array.from({ length: confettiCount }).map((_, index) => ({
    id: index,
    animationClass: `animation-${Math.ceil(Math.random() * 6)}`
  }));

  return (
    <div className="confetti-container">
      {confettis.map(confetti => (
        <div key={confetti.id} className={`confetti ${confetti.animationClass}`} />
      ))}
    </div>
  );
};

export default Confetti;
