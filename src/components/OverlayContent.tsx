import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

const OverlayContent: React.FC = () => {
    return (
        <div
            style={{
                position: 'relative',
                zIndex: 1,
                height: '100vh',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                color: 'white',
                pointerEvents: 'none', // Allow clicks to pass through to canvas if needed, but we need pointer-events-auto on interactive elements
            }}
        >
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: 'easeOut' }}
                style={{ textAlign: 'center' }}
            >
                <h1
                    style={{
                        fontSize: 'clamp(4rem, 10vw, 8rem)',
                        fontFamily: "'Inter', sans-serif",
                        fontWeight: 800,
                        letterSpacing: '-0.02em',
                        margin: 0,
                        color: 'white',
                        textShadow: '0 0 30px rgba(255, 255, 255, 0.3)',
                    }}
                >
                    UPLO
                </h1>
                <h2
                    style={{
                        fontSize: 'clamp(1.5rem, 4vw, 2.5rem)',
                        fontWeight: 400,
                        letterSpacing: '0.05em',
                        marginTop: '0.5rem',
                        marginBottom: '2rem',
                        color: 'rgba(255, 255, 255, 0.8)',
                        fontFamily: 'monospace', // Code-like feel for fullstack dev
                    }}
                >
                    &lt;Fullstack Development&gt;
                </h2>
            </motion.div>

            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5, duration: 0.5 }}
                style={{ pointerEvents: 'auto', marginTop: '2rem' }}
            >
                <a
                    href="mailto:hello@uplo.ai"
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        padding: '1rem 2rem',
                        background: 'rgba(255, 255, 255, 0.1)',
                        backdropFilter: 'blur(10px)',
                        border: '1px solid rgba(255, 255, 255, 0.2)',
                        borderRadius: '50px',
                        color: 'white',
                        textDecoration: 'none',
                        fontSize: '1.2rem',
                        fontWeight: 500,
                        transition: 'all 0.3s ease',
                    }}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)';
                        e.currentTarget.style.transform = 'scale(1.05)';
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
                        e.currentTarget.style.transform = 'scale(1)';
                    }}
                >
                    Get in Touch <ArrowRight size={20} />
                </a>
            </motion.div>
        </div>
    );
};

export default OverlayContent;
