import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Check, Copy, ArrowUpRight, X, AlertCircle } from 'lucide-react';

const OverlayContent: React.FC = () => {
    const [isExpanded, setIsExpanded] = useState(false);
    const [copied, setCopied] = useState(false);
    const [formState, setFormState] = useState<'idle' | 'sending' | 'sent'>('idle');
    const [errors, setErrors] = useState<{ name?: string; email?: string; message?: string }>({});
    const email = "hello@uplo.ai";

    const nameRef = useRef<HTMLInputElement>(null);
    const emailRef = useRef<HTMLInputElement>(null);
    const messageRef = useRef<HTMLTextAreaElement>(null);

    const handleCopy = (e: React.MouseEvent) => {
        e.stopPropagation();
        navigator.clipboard.writeText(email);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleClose = (e: React.MouseEvent) => {
        e.stopPropagation();
        setIsExpanded(false);
        setFormState('idle');
        setErrors({});
    };

    const validateForm = () => {
        const newErrors: { name?: string; email?: string; message?: string } = {};

        if (!nameRef.current?.value.trim()) {
            newErrors.name = 'Name is required';
        }

        if (!emailRef.current?.value.trim()) {
            newErrors.email = 'Email is required';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailRef.current.value)) {
            newErrors.email = 'Please enter a valid email';
        }

        if (!messageRef.current?.value.trim()) {
            newErrors.message = 'Message is required';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        e.stopPropagation();

        if (!validateForm()) return;

        setFormState('sending');
        setTimeout(() => {
            setFormState('sent');
            setTimeout(() => {
                setIsExpanded(false);
                setFormState('idle');
                setErrors({});
            }, 2000);
        }, 1500);
    };

    const inputStyle = (hasError: boolean) => ({
        width: '100%',
        background: hasError ? 'rgba(239, 68, 68, 0.08)' : 'rgba(255, 255, 255, 0.03)',
        border: `1px solid ${hasError ? 'rgba(239, 68, 68, 0.4)' : 'rgba(255, 255, 255, 0.08)'}`,
        borderRadius: '12px',
        padding: '0.875rem 1rem',
        color: 'white',
        fontSize: '0.95rem',
        fontFamily: "'Inter', sans-serif",
        outline: 'none',
        transition: 'all 0.2s ease',
        boxSizing: 'border-box' as const,
    });

    const COLLAPSED_WIDTH = 185;
    const EXPANDED_WIDTH = 460;

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
                        onClick={() => !isExpanded && setIsExpanded(true)}
                        initial={false}
                        animate={{
                            y: isExpanded ? 0 : 180,
                            width: isExpanded ? EXPANDED_WIDTH : COLLAPSED_WIDTH,
                            borderRadius: isExpanded ? 24 : 100,
                        }}
                        transition={{
                            type: "spring",
                            stiffness: 350,
                            damping: 32,
                        }}
                        style={{
                            background: 'rgba(10, 10, 10, 0.95)',
                            backdropFilter: 'blur(20px)',
                            WebkitBackdropFilter: 'blur(20px)',
                            border: '1px solid rgba(255, 255, 255, 0.1)',
                            cursor: isExpanded ? 'default' : 'pointer',
                            overflow: 'hidden',
                            maxWidth: '90vw',
                            pointerEvents: 'auto',
                            boxShadow: isExpanded
                                ? '0 25px 60px rgba(0, 0, 0, 0.6)'
                                : '0 4px 20px rgba(0, 0, 0, 0.3)',
                        }}
                    >
                        <AnimatePresence mode="wait" initial={false}>
                            {isExpanded ? (
                                <motion.div
                                    key="expanded"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    transition={{ duration: 0.12 }}
                                    style={{ padding: '1.75rem' }}
                                >
                                    {/* Header */}
                                    <div
                                        style={{
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            alignItems: 'center',
                                            marginBottom: '1.5rem',
                                        }}
                                    >
                                        <h3
                                            style={{
                                                margin: 0,
                                                fontSize: '1.25rem',
                                                fontWeight: 600,
                                                color: 'white',
                                                letterSpacing: '-0.01em',
                                            }}
                                        >
                                            Get in Touch
                                        </h3>
                                        <motion.button
                                            onClick={handleClose}
                                            whileHover={{ scale: 1.1 }}
                                            whileTap={{ scale: 0.95 }}
                                            style={{
                                                background: 'transparent',
                                                border: 'none',
                                                color: 'rgba(255, 255, 255, 0.4)',
                                                cursor: 'pointer',
                                                padding: '4px',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                borderRadius: '8px',
                                                transition: 'color 0.2s',
                                            }}
                                            onMouseEnter={(e) => e.currentTarget.style.color = 'rgba(255, 255, 255, 0.8)'}
                                            onMouseLeave={(e) => e.currentTarget.style.color = 'rgba(255, 255, 255, 0.4)'}
                                        >
                                            <X size={20} />
                                        </motion.button>
                                    </div>

                                    {/* Email Copy Section */}
                                    <motion.div
                                        onClick={handleCopy}
                                        whileHover={{ backgroundColor: 'rgba(255, 255, 255, 0.06)' }}
                                        whileTap={{ scale: 0.99 }}
                                        style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'space-between',
                                            cursor: 'pointer',
                                            padding: '0.875rem 1rem',
                                            borderRadius: '12px',
                                            background: 'rgba(255, 255, 255, 0.03)',
                                            border: '1px solid rgba(255, 255, 255, 0.08)',
                                            marginBottom: '1.25rem',
                                            transition: 'background 0.2s',
                                        }}
                                    >
                                        <span
                                            style={{
                                                fontFamily: 'ui-monospace, monospace',
                                                fontSize: '0.9rem',
                                                color: 'rgba(255, 255, 255, 0.9)',
                                                letterSpacing: '0.01em',
                                            }}
                                        >
                                            {email}
                                        </span>
                                        <motion.div
                                            initial={false}
                                            animate={{ scale: copied ? [1, 1.2, 1] : 1 }}
                                            style={{ color: copied ? '#4ade80' : 'rgba(255, 255, 255, 0.35)' }}
                                        >
                                            {copied ? <Check size={16} /> : <Copy size={16} />}
                                        </motion.div>
                                    </motion.div>

                                    {/* Divider */}
                                    <div
                                        style={{
                                            height: '1px',
                                            background: 'rgba(255, 255, 255, 0.06)',
                                            margin: '0 0 1.25rem 0',
                                        }}
                                    />

                                    {/* Form */}
                                    {formState === 'sent' ? (
                                        <motion.div
                                            initial={{ opacity: 0, scale: 0.9 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            style={{
                                                textAlign: 'center',
                                                padding: '2rem 0',
                                            }}
                                        >
                                            <motion.div
                                                initial={{ scale: 0 }}
                                                animate={{ scale: 1 }}
                                                transition={{ type: 'spring', stiffness: 200, damping: 12 }}
                                                style={{
                                                    width: '56px',
                                                    height: '56px',
                                                    borderRadius: '50%',
                                                    background: 'rgba(74, 222, 128, 0.15)',
                                                    border: '2px solid rgba(74, 222, 128, 0.3)',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    margin: '0 auto 1rem',
                                                    color: '#4ade80',
                                                }}
                                            >
                                                <Check size={28} />
                                            </motion.div>
                                            <h4 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 500, color: 'white' }}>
                                                Message Sent
                                            </h4>
                                        </motion.div>
                                    ) : (
                                        <form onSubmit={handleSubmit} onClick={(e) => e.stopPropagation()} noValidate>
                                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
                                                {/* Name Field */}
                                                <div>
                                                    <input
                                                        ref={nameRef}
                                                        type="text"
                                                        placeholder="Name"
                                                        style={inputStyle(!!errors.name)}
                                                        onChange={() => errors.name && setErrors(e => ({ ...e, name: undefined }))}
                                                        onFocus={(e) => {
                                                            if (!errors.name) {
                                                                e.target.style.borderColor = 'rgba(255, 255, 255, 0.2)';
                                                                e.target.style.background = 'rgba(255, 255, 255, 0.05)';
                                                            }
                                                        }}
                                                        onBlur={(e) => {
                                                            if (!errors.name) {
                                                                e.target.style.borderColor = 'rgba(255, 255, 255, 0.08)';
                                                                e.target.style.background = 'rgba(255, 255, 255, 0.03)';
                                                            }
                                                        }}
                                                    />
                                                    <AnimatePresence>
                                                        {errors.name && (
                                                            <motion.div
                                                                initial={{ opacity: 0, y: -4 }}
                                                                animate={{ opacity: 1, y: 0 }}
                                                                exit={{ opacity: 0, y: -4 }}
                                                                style={{
                                                                    display: 'flex',
                                                                    alignItems: 'center',
                                                                    gap: '0.35rem',
                                                                    marginTop: '0.35rem',
                                                                    fontSize: '0.8rem',
                                                                    color: '#f87171',
                                                                }}
                                                            >
                                                                <AlertCircle size={12} />
                                                                {errors.name}
                                                            </motion.div>
                                                        )}
                                                    </AnimatePresence>
                                                </div>

                                                {/* Email Field */}
                                                <div>
                                                    <input
                                                        ref={emailRef}
                                                        type="email"
                                                        placeholder="Email"
                                                        style={inputStyle(!!errors.email)}
                                                        onChange={() => errors.email && setErrors(e => ({ ...e, email: undefined }))}
                                                        onFocus={(e) => {
                                                            if (!errors.email) {
                                                                e.target.style.borderColor = 'rgba(255, 255, 255, 0.2)';
                                                                e.target.style.background = 'rgba(255, 255, 255, 0.05)';
                                                            }
                                                        }}
                                                        onBlur={(e) => {
                                                            if (!errors.email) {
                                                                e.target.style.borderColor = 'rgba(255, 255, 255, 0.08)';
                                                                e.target.style.background = 'rgba(255, 255, 255, 0.03)';
                                                            }
                                                        }}
                                                    />
                                                    <AnimatePresence>
                                                        {errors.email && (
                                                            <motion.div
                                                                initial={{ opacity: 0, y: -4 }}
                                                                animate={{ opacity: 1, y: 0 }}
                                                                exit={{ opacity: 0, y: -4 }}
                                                                style={{
                                                                    display: 'flex',
                                                                    alignItems: 'center',
                                                                    gap: '0.35rem',
                                                                    marginTop: '0.35rem',
                                                                    fontSize: '0.8rem',
                                                                    color: '#f87171',
                                                                }}
                                                            >
                                                                <AlertCircle size={12} />
                                                                {errors.email}
                                                            </motion.div>
                                                        )}
                                                    </AnimatePresence>
                                                </div>

                                                {/* Message Field */}
                                                <div>
                                                    <textarea
                                                        ref={messageRef}
                                                        placeholder="Message"
                                                        rows={3}
                                                        style={{
                                                            ...inputStyle(!!errors.message),
                                                            resize: 'none',
                                                            lineHeight: 1.5,
                                                        }}
                                                        onChange={() => errors.message && setErrors(e => ({ ...e, message: undefined }))}
                                                        onFocus={(e) => {
                                                            if (!errors.message) {
                                                                e.target.style.borderColor = 'rgba(255, 255, 255, 0.2)';
                                                                e.target.style.background = 'rgba(255, 255, 255, 0.05)';
                                                            }
                                                        }}
                                                        onBlur={(e) => {
                                                            if (!errors.message) {
                                                                e.target.style.borderColor = 'rgba(255, 255, 255, 0.08)';
                                                                e.target.style.background = 'rgba(255, 255, 255, 0.03)';
                                                            }
                                                        }}
                                                    />
                                                    <AnimatePresence>
                                                        {errors.message && (
                                                            <motion.div
                                                                initial={{ opacity: 0, y: -4 }}
                                                                animate={{ opacity: 1, y: 0 }}
                                                                exit={{ opacity: 0, y: -4 }}
                                                                style={{
                                                                    display: 'flex',
                                                                    alignItems: 'center',
                                                                    gap: '0.35rem',
                                                                    marginTop: '0.35rem',
                                                                    fontSize: '0.8rem',
                                                                    color: '#f87171',
                                                                }}
                                                            >
                                                                <AlertCircle size={12} />
                                                                {errors.message}
                                                            </motion.div>
                                                        )}
                                                    </AnimatePresence>
                                                </div>
                                            </div>

                                            <motion.button
                                                type="submit"
                                                disabled={formState === 'sending'}
                                                whileHover={{ backgroundColor: 'rgba(255, 255, 255, 0.12)' }}
                                                whileTap={{ scale: 0.98 }}
                                                style={{
                                                    width: '100%',
                                                    background: 'rgba(255, 255, 255, 0.06)',
                                                    color: 'white',
                                                    border: '1px solid rgba(255, 255, 255, 0.1)',
                                                    padding: '0.8rem 1.5rem',
                                                    borderRadius: '12px',
                                                    fontSize: '0.9rem',
                                                    fontWeight: 500,
                                                    cursor: formState === 'sending' ? 'not-allowed' : 'pointer',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    gap: '0.4rem',
                                                    marginTop: '0.875rem',
                                                    opacity: formState === 'sending' ? 0.6 : 1,
                                                    transition: 'background 0.2s, opacity 0.2s',
                                                }}
                                            >
                                                {formState === 'sending' ? (
                                                    'Sending...'
                                                ) : (
                                                    <>
                                                        Send
                                                        <ArrowUpRight size={15} />
                                                    </>
                                                )}
                                            </motion.button>
                                        </form>
                                    )}
                                </motion.div>
                            ) : (
                                <motion.div
                                    key="collapsed"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    transition={{
                                        duration: 0.15,
                                        delay: 0.2,
                                    }}
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        gap: '0.5rem',
                                        whiteSpace: 'nowrap',
                                        padding: '0.875rem 1.5rem',
                                    }}
                                >
                                    <span style={{
                                        fontSize: '1rem',
                                        fontWeight: 500,
                                        letterSpacing: '0.01em',
                                    }}>
                                        Get in Touch
                                    </span>
                                    <ArrowRight size={16} style={{ opacity: 0.7 }} />
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
