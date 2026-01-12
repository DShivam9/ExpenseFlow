/**
 * Shiny Text Component
 * 
 * A premium text effect that adds a shimmering shine animation.
 * Recreated from ReactBits concept.
 */
const ShinyText = ({
    text,
    disabled = false,
    speed = 3,
    className = ''
}) => {
    const animationDuration = `${speed}s`;

    return (
        <div
            className={`relative inline-block overflow-hidden ${className}`}
            style={{
                backgroundSize: '200% 100%',
                WebkitBackgroundClip: 'text',
                backgroundClip: 'text',
                display: 'inline-block',
                animation: disabled ? 'none' : `shine ${animationDuration} linear infinite`
            }}
        >
            {text}
            <style jsx>{`
        @keyframes shine {
          0% { background-position: 100% 0; }
          100% { background-position: -100% 0; }
        }
      `}</style>
        </div>
    );
};

export default ShinyText;
