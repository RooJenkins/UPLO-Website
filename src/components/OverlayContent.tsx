import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Check, Copy, ArrowUpRight, X } from 'lucide-react';

const OverlayContent: React.FC = () => {
    const [isExpanded, setIsExpanded] = useState(false);
    const [copied, setCopied] = useState(false);
    const [formState, setFormState] = useState<'idle' | 'sending' | 'sent'>('idle');
    const email = "hello@uplo.ai";

    const handleCopy = (e: React.MouseEvent) => {
        e.stopPropagation();
        navigator.clipboard.writeText(email);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setFormState('sending');
        setTimeout(() => {
            setFormState('sent');
            setTimeout(() => {
                setIsExpanded(false);
                setFormState('idle');
            }, 2000);
        }, 1500);
    };

    const inputStyle = {
        width: '100%',
        background: 'rgba(0, 0, 0, 0.2)',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        borderRadius: '8px',
        padding: '1rem',
        color: 'white',
        fontSize: '0.95rem',
        fontFamily: "'Inter', sans-serif",
        outline: 'none',
        transition: 'all 0.3s ease',
        marginBottom: '0.8rem',
    };

    return (
        <>
            <div
                style={{
                    position: 'relative',
                    zIndex: 1,
                    height: '100vh',
                    width: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    color: 'white',
                    pointerEvents: 'none',
                }}
            >
                {/* Header Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: 'easeOut' }}
                    style={{
                        textAlign: 'center',
                        marginBottom: '2rem',
                        transform: 'translateY(-40px)',
                    }}
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
                            marginBottom: 0,
                            color: 'rgba(255, 255, 255, 0.8)',
                            fontFamily: 'monospace',
                        }}
                    >
                        &lt;Fullstack Development&gt;
                    </h2>
                </motion.div>

                {/* Interactive Section */}
                <div
                    style={{
                        position: 'absolute',
                        left: 0,
                        right: 0,
                        height: '100%',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        pointerEvents: 'none',
                        zIndex: 10,
                        padding: '0 1rem',
                    }}
                >
                    <motion.div
                        layout
                        onClick={() => !isExpanded && setIsExpanded(true)}
                        style={{
                            background: 'rgba(10, 10, 10, 0.95)',
                            backdropFilter: 'blur(20px)',
                            border: isExpanded ? '1px solid rgba(255, 255, 255, 0.1)' : '1px solid rgba(255, 255, 255, 0.15)',
                            borderRadius: '32px',
                            padding: 0,
                            cursor: isExpanded ? 'default' : 'pointer',
                            overflow: 'hidden',
                            width: isExpanded ? '450px' : 'auto',
                            maxWidth: '90vw',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            pointerEvents: 'auto',
                            boxShadow: isExpanded ? '0 20px 50px rgba(0, 0, 0, 0.8)' : '0 4px 20px rgba(0,0,0,0.3)',
                            position: 'relative',
                        }}
                        animate={{
                            y: isExpanded ? 0 : 180,
                        }}
                        transition={{
                            type: "spring",
                            stiffness: 300,
                            damping: 28,
                            mass: 0.8
                        }}
                    >
                        <AnimatePresence mode="wait">
                            {isExpanded ? (
                                <motion.div
                                    key="content"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    transition={{ duration: 0.2 }}
                                    style={{ width: '100%', padding: '2.5rem' }}
                                >
                                    {/* Header with Close Button */}
                                    <div style={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                        marginBottom: '2rem',
                                        padding: '0 0.2rem'
                                    }}>
                                        <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 500, color: 'white', letterSpacing: '0.02em' }}>Get in Touch</h3>
                                        <button
                                            onClick={(e) => { e.stopPropagation(); setIsExpanded(false); }}
                                            style={{
                                                background: 'transparent',
                                                border: 'none',
                                                color: 'rgba(255,255,255,0.6)',
                                                cursor: 'pointer',
                                                padding: '0.5rem',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                transition: 'color 0.2s',
                                                marginRight: '-0.5rem'
                                            }}
                                            onMouseEnter={(e) => e.currentTarget.style.color = 'white'}
                                            onMouseLeave={(e) => e.currentTarget.style.color = 'rgba(255,255,255,0.6)'}
                                        >
                                            <X size={22} />
                                        </button>
                                    </div>

                                    {/* Email Copy Section */}
                                    <motion.div
                                        onClick={handleCopy}
                                        whileHover={{ scale: 1.01, backgroundColor: 'rgba(255, 255, 255, 0.05)' }}
                                        whileTap={{ scale: 0.99 }}
                                        style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'space-between',
                                            cursor: 'pointer',
                                            marginBottom: '2rem',
                                            padding: '1rem 1.2rem',
                                            borderRadius: '12px',
                                            background: 'rgba(0, 0, 0, 0.3)',
                                            border: '1px solid rgba(255, 255, 255, 0.08)',
                                            transition: 'border-color 0.2s'
                                        }}
                                    >
                                        <span style={{ fontFamily: 'monospace', fontSize: '1rem', color: '#fff', opacity: 0.9 }}>{email}</span>
                                        {copied ? <Check size={18} color="#fff" /> : <Copy size={18} style={{ opacity: 0.5 }} />}
                                    </motion.div>

                                    {/* Form Section */}
                                    {formState === 'sent' ? (
                                        <motion.div
                                            initial={{ opacity: 0, scale: 0.8 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            style={{ textAlign: 'center', padding: '2rem 0', color: 'white' }}
                                        >
                                            <motion.div
                                                initial={{ scale: 0 }}
                                                animate={{ scale: 1 }}
                                                transition={{ type: 'spring', stiffness: 200 }}
                                            >
                                                <Check size={40} style={{ margin: '0 auto 1rem', opacity: 0.8 }} />
                                            </motion.div>
                                            <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 500 }}>Message Sent</h3>
                                        </motion.div>
                                    ) : (
                                        <form onSubmit={handleSubmit} onClick={(e) => e.stopPropagation()}>
                                            <input
                                                type="text"
                                                placeholder="Name"
                                                required
                                                style={inputStyle}
                                                onFocus={(e) => {
                                                    e.target.style.borderColor = 'rgba(255, 255, 255, 0.3)';
                                                    e.target.style.background = 'rgba(0, 0, 0, 0.4)';
                                                }}
                                                onBlur={(e) => {
                                                    e.target.style.borderColor = 'rgba(255, 255, 255, 0.08)';
                                                    e.target.style.background = 'rgba(0, 0, 0, 0.2)';
                                                }}
                                            />
                                            <input
                                                type="email"
                                                placeholder="Email"
                                                required
                                                style={inputStyle}
                                                onFocus={(e) => {
                                                    e.target.style.borderColor = 'rgba(255, 255, 255, 0.3)';
                                                    e.target.style.background = 'rgba(0, 0, 0, 0.4)';
                                                }}
                                                onBlur={(e) => {
                                                    e.target.style.borderColor = 'rgba(255, 255, 255, 0.08)';
                                                    e.target.style.background = 'rgba(0, 0, 0, 0.2)';
                                                }}
                                            />
                                            <textarea
                                                placeholder="Message"
                                                required
                                                rows={4}
                                                style={{ ...inputStyle, resize: 'none' }}
                                                onFocus={(e) => {
                                                    e.target.style.borderColor = 'rgba(255, 255, 255, 0.3)';
                                                    e.target.style.background = 'rgba(0, 0, 0, 0.4)';
                                                }}
                                                onBlur={(e) => {
                                                    e.target.style.borderColor = 'rgba(255, 255, 255, 0.08)';
                                                    e.target.style.background = 'rgba(0, 0, 0, 0.2)';
                                                }}
                                            />
                                            <motion.button
                                                type="submit"
                                                disabled={formState === 'sending'}
                                                whileHover={{ scale: 1.01, backgroundColor: 'white', color: 'black' }}
                                                whileTap={{ scale: 0.99 }}
                                                style={{
                                                    width: '100%',
                                                    background: 'rgba(255, 255, 255, 0.1)',
                                                    color: 'white',
                                                    border: '1px solid rgba(255, 255, 255, 0.2)',
                                                    padding: '1rem',
                                                    borderRadius: '8px',
                                                    fontSize: '0.95rem',
                                                    fontWeight: 500,
                                                    cursor: 'pointer',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    gap: '0.6rem',
                                                    marginTop: '1rem',
                                                    opacity: formState === 'sending' ? 0.7 : 1,
                                                    transition: 'all 0.2s',
                                                }}
                                            >
                                                {formState === 'sending' ? 'Sending...' : <>Send <ArrowUpRight size={18} /></>}
                                            </motion.button>
                                        </form>
                                    )}
                                </motion.div>
                            ) : (
                                <motion.div
                                    key="button"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    transition={{ duration: 0.2 }}
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '0.8rem',
                                        whiteSpace: 'nowrap',
                                        padding: '1rem 2.5rem',
                                    }}
                                >
                                    <span style={{ fontSize: '1.1rem', fontWeight: 400, letterSpacing: '0.02em' }}>Get in Touch</span>
                                    <ArrowRight size={18} style={{ opacity: 0.8 }} />
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </motion.div>
                </div>
            </div>
        </>
    );
};

export default OverlayContent;
