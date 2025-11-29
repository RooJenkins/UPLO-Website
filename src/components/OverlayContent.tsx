import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Check, Copy, Send } from 'lucide-react';

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
        background: 'rgba(255, 255, 255, 0.05)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        borderRadius: '8px',
        padding: '0.8rem',
        color: 'white',
        fontSize: '0.9rem',
        fontFamily: "'Inter', sans-serif",
        outline: 'none',
        transition: 'border-color 0.3s',
        marginBottom: '0.8rem',
    };

    return (
        <>
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
                    pointerEvents: 'none',
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
                            fontFamily: 'monospace',
                        }}
                    >
                        &lt;Fullstack Development&gt;
                    </h2>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.5, duration: 0.5 }}
                    style={{
                        pointerEvents: 'auto',
                        marginTop: '2rem',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'flex-start', // Align to top so it expands downwards
                        minHeight: '60px' // Reserve space
                    }}
                >
                    <motion.div
                        layout
                        onClick={() => !isExpanded && setIsExpanded(true)}
                        style={{
                            background: 'rgba(20, 20, 20, 0.6)', // Darker background for better contrast
                            backdropFilter: 'blur(20px)',
                            border: isExpanded ? '1px solid rgba(0, 242, 255, 0.3)' : '1px solid rgba(255, 255, 255, 0.2)',
                            borderRadius: isExpanded ? '20px' : '50px',
                            padding: isExpanded ? '2rem' : '1rem 2rem',
                            cursor: isExpanded ? 'default' : 'pointer',
                            overflow: 'hidden',
                            width: isExpanded ? '400px' : 'auto',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            boxShadow: isExpanded ? '0 10px 40px rgba(0, 0, 0, 0.5)' : 'none',
                        }}
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    >
                        <AnimatePresence mode="wait">
                            {isExpanded ? (
                                <motion.div
                                    key="content"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    style={{ width: '100%' }}
                                >
                                    {/* Email Copy Section */}
                                    <div
                                        onClick={handleCopy}
                                        style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            gap: '0.8rem',
                                            cursor: 'pointer',
                                            marginBottom: '1.5rem',
                                            padding: '0.5rem',
                                            borderRadius: '8px',
                                            background: 'rgba(255, 255, 255, 0.05)',
                                            border: '1px solid rgba(255, 255, 255, 0.1)',
                                        }}
                                    >
                                        {copied ? (
                                            <>
                                                <Check size={18} color="#00f2ff" />
                                                <span style={{ color: '#00f2ff', fontWeight: 600, fontSize: '0.9rem' }}>Copied!</span>
                                            </>
                                        ) : (
                                            <>
                                                <span style={{ fontFamily: 'monospace', fontSize: '1rem' }}>{email}</span>
                                                <Copy size={16} style={{ opacity: 0.7 }} />
                                            </>
                                        )}
                                    </div>

                                    {/* Divider */}
                                    <div style={{
                                        height: '1px',
                                        background: 'rgba(255, 255, 255, 0.1)',
                                        marginBottom: '1.5rem',
                                        width: '100%'
                                    }} />

                                    {/* Form Section */}
                                    {formState === 'sent' ? (
                                        <motion.div
                                            initial={{ opacity: 0, scale: 0.8 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            style={{ textAlign: 'center', padding: '2rem 0', color: '#00f2ff' }}
                                        >
                                            <Check size={48} style={{ margin: '0 auto 1rem' }} />
                                            <h3 style={{ margin: 0, color: 'white' }}>Message Sent</h3>
                                        </motion.div>
                                    ) : (
                                        <form onSubmit={handleSubmit} onClick={(e) => e.stopPropagation()}>
                                            <input
                                                type="text"
                                                placeholder="Your Name"
                                                required
                                                style={inputStyle}
                                                onFocus={(e) => e.target.style.borderColor = '#00f2ff'}
                                                onBlur={(e) => e.target.style.borderColor = 'rgba(255, 255, 255, 0.1)'}
                                            />
                                            <input
                                                type="email"
                                                placeholder="Your Email"
                                                required
                                                style={inputStyle}
                                                onFocus={(e) => e.target.style.borderColor = '#00f2ff'}
                                                onBlur={(e) => e.target.style.borderColor = 'rgba(255, 255, 255, 0.1)'}
                                            />
                                            <textarea
                                                placeholder="Your Message"
                                                required
                                                rows={3}
                                                style={{ ...inputStyle, resize: 'none' }}
                                                onFocus={(e) => e.target.style.borderColor = '#00f2ff'}
                                                onBlur={(e) => e.target.style.borderColor = 'rgba(255, 255, 255, 0.1)'}
                                            />
                                            <motion.button
                                                type="submit"
                                                disabled={formState === 'sending'}
                                                whileHover={{ scale: 1.02 }}
                                                whileTap={{ scale: 0.98 }}
                                                style={{
                                                    width: '100%',
                                                    background: 'white',
                                                    color: 'black',
                                                    border: 'none',
                                                    padding: '0.8rem',
                                                    borderRadius: '8px',
                                                    fontSize: '1rem',
                                                    fontWeight: 600,
                                                    cursor: 'pointer',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    gap: '0.5rem',
                                                    opacity: formState === 'sending' ? 0.7 : 1,
                                                }}
                                            >
                                                {formState === 'sending' ? 'Sending...' : <>Send Message <Send size={16} /></>}
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
                                    style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', whiteSpace: 'nowrap' }}
                                >
                                    Get in Touch <ArrowRight size={20} />
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </motion.div>
                </motion.div>
            </div>
        </>
    );
};

export default OverlayContent;
