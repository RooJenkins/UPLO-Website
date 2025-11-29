import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Check, Copy, Send, X } from 'lucide-react';

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
        border: '1px solid rgba(255, 255, 255, 0.1)',
        borderRadius: '12px',
        padding: '1rem',
        color: 'white',
        fontSize: '1rem',
        fontFamily: "'Inter', sans-serif",
        outline: 'none',
        transition: 'all 0.3s ease',
        marginBottom: '1rem',
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
                <motion.div
                    style={{
                        position: 'absolute',
                        left: 0,
                        right: 0,
                        display: 'flex',
                        justifyContent: 'center',
                        pointerEvents: 'none',
                        zIndex: 10,
                        padding: '0 1rem'
                    }}
                    animate={{
                        top: isExpanded ? '50%' : '65%',
                        y: isExpanded ? '-50%' : '0%'
                    }}
                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                >
                    <motion.div
                        layout
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.5, duration: 0.5 }}
                        style={{ pointerEvents: 'auto' }}
                    >
                        <motion.div
                            layout
                            onClick={() => !isExpanded && setIsExpanded(true)}
                            style={{
                                background: 'rgba(10, 10, 10, 0.9)',
                                backdropFilter: 'blur(20px)',
                                border: isExpanded ? '1px solid rgba(0, 242, 255, 0.3)' : '1px solid rgba(255, 255, 255, 0.15)',
                                borderRadius: '40px',
                                padding: 0,
                                cursor: isExpanded ? 'default' : 'pointer',
                                overflow: 'hidden',
                                width: isExpanded ? 'min(450px, 90vw)' : 'auto',
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                boxShadow: isExpanded ? '0 20px 50px rgba(0, 0, 0, 0.6), 0 0 30px rgba(0, 242, 255, 0.15)' : '0 4px 20px rgba(0,0,0,0.2)',
                            }}
                            transition={{
                                type: "spring",
                                stiffness: 400,
                                damping: 25,
                                mass: 0.8
                            }}
                        >
                            <AnimatePresence mode="wait">
                                {isExpanded ? (
                                    <motion.div
                                        key="content"
                                        initial={{ opacity: 0, scale: 0.95, y: 10 }}
                                        animate={{ opacity: 1, scale: 1, y: 0 }}
                                        exit={{ opacity: 0, scale: 0.95, y: 10 }}
                                        transition={{ duration: 0.2 }}
                                        style={{ width: '100%', padding: '2.5rem' }}
                                    >
                                        {/* Header with Close Button */}
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                                            <h3 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 600, color: 'white' }}>Get in Touch</h3>
                                            <button
                                                onClick={(e) => { e.stopPropagation(); setIsExpanded(false); }}
                                                style={{
                                                    background: 'rgba(255,255,255,0.1)',
                                                    border: 'none',
                                                    color: 'white',
                                                    cursor: 'pointer',
                                                    padding: '0.5rem',
                                                    borderRadius: '50%',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    transition: 'background 0.2s'
                                                }}
                                                onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.2)'}
                                                onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
                                            >
                                                <X size={20} />
                                            </button>
                                        </div>

                                        {/* Email Copy Section */}
                                        <motion.div
                                            onClick={handleCopy}
                                            whileHover={{ scale: 1.02, backgroundColor: 'rgba(0, 242, 255, 0.05)', borderColor: 'rgba(0, 242, 255, 0.3)' }}
                                            whileTap={{ scale: 0.98 }}
                                            style={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'space-between',
                                                cursor: 'pointer',
                                                marginBottom: '2.5rem',
                                                padding: '1.2rem',
                                                borderRadius: '16px',
                                                background: 'rgba(0, 0, 0, 0.3)',
                                                border: '1px solid rgba(255, 255, 255, 0.1)',
                                                transition: 'border-color 0.2s'
                                            }}
                                        >
                                            <span style={{ fontFamily: 'monospace', fontSize: '1.1rem', color: '#00f2ff', letterSpacing: '0.05em' }}>{email}</span>
                                            {copied ? <Check size={20} color="#00f2ff" /> : <Copy size={20} style={{ opacity: 0.7 }} />}
                                        </motion.div>

                                        {/* Form Section */}
                                        {formState === 'sent' ? (
                                            <motion.div
                                                initial={{ opacity: 0, scale: 0.8 }}
                                                animate={{ opacity: 1, scale: 1 }}
                                                style={{ textAlign: 'center', padding: '2rem 0', color: '#00f2ff' }}
                                            >
                                                <motion.div
                                                    initial={{ scale: 0 }}
                                                    animate={{ scale: 1 }}
                                                    transition={{ type: 'spring', stiffness: 200 }}
                                                >
                                                    <Check size={48} style={{ margin: '0 auto 1rem' }} />
                                                </motion.div>
                                                <h3 style={{ margin: 0, color: 'white' }}>Message Sent</h3>
                                            </motion.div>
                                        ) : (
                                            <form onSubmit={handleSubmit} onClick={(e) => e.stopPropagation()}>
                                                <input
                                                    type="text"
                                                    placeholder="Your Name"
                                                    required
                                                    style={inputStyle}
                                                    onFocus={(e) => {
                                                        e.target.style.borderColor = '#00f2ff';
                                                        e.target.style.background = 'rgba(0, 242, 255, 0.05)';
                                                    }}
                                                    onBlur={(e) => {
                                                        e.target.style.borderColor = 'rgba(255, 255, 255, 0.1)';
                                                        e.target.style.background = 'rgba(0, 0, 0, 0.2)';
                                                    }}
                                                />
                                                <input
                                                    type="email"
                                                    placeholder="Your Email"
                                                    required
                                                    style={inputStyle}
                                                    onFocus={(e) => {
                                                        e.target.style.borderColor = '#00f2ff';
                                                        e.target.style.background = 'rgba(0, 242, 255, 0.05)';
                                                    }}
                                                    onBlur={(e) => {
                                                        e.target.style.borderColor = 'rgba(255, 255, 255, 0.1)';
                                                        e.target.style.background = 'rgba(0, 0, 0, 0.2)';
                                                    }}
                                                />
                                                <textarea
                                                    placeholder="Your Message"
                                                    required
                                                    rows={4}
                                                    style={{ ...inputStyle, resize: 'none' }}
                                                    onFocus={(e) => {
                                                        e.target.style.borderColor = '#00f2ff';
                                                        e.target.style.background = 'rgba(0, 242, 255, 0.05)';
                                                    }}
                                                    onBlur={(e) => {
                                                        e.target.style.borderColor = 'rgba(255, 255, 255, 0.1)';
                                                        e.target.style.background = 'rgba(0, 0, 0, 0.2)';
                                                    }}
                                                />
                                                <motion.button
                                                    type="submit"
                                                    disabled={formState === 'sending'}
                                                    whileHover={{ scale: 1.02, boxShadow: '0 0 20px rgba(0, 242, 255, 0.4)' }}
                                                    whileTap={{ scale: 0.98 }}
                                                    style={{
                                                        width: '100%',
                                                        background: 'linear-gradient(135deg, #00f2ff 0%, #00a8ff 100%)',
                                                        color: 'black',
                                                        border: 'none',
                                                        padding: '1rem',
                                                        borderRadius: '12px',
                                                        fontSize: '1rem',
                                                        fontWeight: 700,
                                                        cursor: 'pointer',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                        gap: '0.5rem',
                                                        marginTop: '1rem',
                                                        opacity: formState === 'sending' ? 0.7 : 1,
                                                        boxShadow: '0 0 10px rgba(0, 242, 255, 0.2)',
                                                    }}
                                                >
                                                    {formState === 'sending' ? 'Sending...' : <>Send Message <Send size={18} strokeWidth={2.5} /></>}
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
                                        <span style={{ fontSize: '1.2rem', fontWeight: 500 }}>Get in Touch</span>
                                        <ArrowRight size={20} />
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </motion.div>
                    </motion.div>
                </motion.div>
            </div>
        </>
    );
};

export default OverlayContent;
