import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, Check, Mail, User, MessageSquare } from 'lucide-react';

interface ContactModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const ContactModal: React.FC<ContactModalProps> = ({ isOpen, onClose }) => {
    const [formState, setFormState] = useState<'idle' | 'sending' | 'sent'>('idle');
    const [focusedField, setFocusedField] = useState<string | null>(null);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setFormState('sending');
        setTimeout(() => {
            setFormState('sent');
            setTimeout(() => {
                onClose();
                setFormState('idle');
            }, 2000);
        }, 1500);
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        onClick={onClose}
                        style={{
                            position: 'fixed',
                            inset: 0,
                            background: 'rgba(0, 0, 0, 0.7)',
                            backdropFilter: 'blur(8px)',
                            WebkitBackdropFilter: 'blur(8px)',
                            zIndex: 100,
                        }}
                    />

                    {/* Modal */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        transition={{ duration: 0.25, ease: [0.23, 1, 0.32, 1] }}
                        style={{
                            position: 'fixed',
                            top: '50%',
                            left: '50%',
                            transform: 'translate(-50%, -50%)',
                            width: '90%',
                            maxWidth: '480px',
                            zIndex: 101,
                        }}
                    >
                        {/* Modal Card */}
                        <div
                            style={{
                                background: 'rgba(20, 20, 25, 0.95)',
                                borderRadius: '20px',
                                border: '1px solid rgba(255, 255, 255, 0.08)',
                                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(255, 255, 255, 0.05) inset',
                                padding: '2.5rem',
                                position: 'relative',
                            }}
                        >
                            {/* Close Button */}
                            <motion.button
                                onClick={onClose}
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.95 }}
                                style={{
                                    position: 'absolute',
                                    top: '1.25rem',
                                    right: '1.25rem',
                                    background: 'rgba(255, 255, 255, 0.05)',
                                    border: '1px solid rgba(255, 255, 255, 0.1)',
                                    borderRadius: '50%',
                                    width: '36px',
                                    height: '36px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    color: 'rgba(255, 255, 255, 0.5)',
                                    cursor: 'pointer',
                                    transition: 'all 0.2s ease',
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
                                    e.currentTarget.style.color = 'rgba(255, 255, 255, 0.8)';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
                                    e.currentTarget.style.color = 'rgba(255, 255, 255, 0.5)';
                                }}
                            >
                                <X size={18} />
                            </motion.button>

                            {formState === 'sent' ? (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    style={{
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        padding: '3rem 0',
                                    }}
                                >
                                    <motion.div
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        transition={{ type: 'spring', stiffness: 200, damping: 12, delay: 0.1 }}
                                        style={{
                                            width: '80px',
                                            height: '80px',
                                            borderRadius: '50%',
                                            background: 'linear-gradient(135deg, rgba(74, 222, 128, 0.2), rgba(34, 197, 94, 0.1))',
                                            border: '2px solid rgba(74, 222, 128, 0.3)',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            color: '#4ade80',
                                        }}
                                    >
                                        <Check size={40} strokeWidth={2.5} />
                                    </motion.div>
                                    <motion.h3
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.2 }}
                                        style={{
                                            marginTop: '1.5rem',
                                            fontSize: '1.5rem',
                                            fontWeight: 600,
                                            color: 'white',
                                            marginBottom: '0.5rem',
                                        }}
                                    >
                                        Message Sent!
                                    </motion.h3>
                                    <motion.p
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ delay: 0.3 }}
                                        style={{
                                            color: 'rgba(255, 255, 255, 0.5)',
                                            fontSize: '0.95rem',
                                        }}
                                    >
                                        We'll get back to you soon.
                                    </motion.p>
                                </motion.div>
                            ) : (
                                <form onSubmit={handleSubmit}>
                                    {/* Header */}
                                    <div style={{ marginBottom: '2rem' }}>
                                        <h2
                                            style={{
                                                fontSize: '1.75rem',
                                                fontWeight: 700,
                                                color: 'white',
                                                marginBottom: '0.5rem',
                                                letterSpacing: '-0.02em',
                                            }}
                                        >
                                            Get in Touch
                                        </h2>
                                        <p
                                            style={{
                                                color: 'rgba(255, 255, 255, 0.5)',
                                                fontSize: '0.95rem',
                                                margin: 0,
                                            }}
                                        >
                                            We'd love to hear from you.
                                        </p>
                                    </div>

                                    {/* Name Field */}
                                    <div style={{ marginBottom: '1.25rem' }}>
                                        <div
                                            style={{
                                                position: 'relative',
                                                display: 'flex',
                                                alignItems: 'center',
                                                background: focusedField === 'name' ? 'rgba(255, 255, 255, 0.08)' : 'rgba(255, 255, 255, 0.03)',
                                                borderRadius: '12px',
                                                border: `1px solid ${focusedField === 'name' ? 'rgba(255, 255, 255, 0.2)' : 'rgba(255, 255, 255, 0.08)'}`,
                                                transition: 'all 0.2s ease',
                                            }}
                                        >
                                            <div
                                                style={{
                                                    padding: '0 1rem',
                                                    color: focusedField === 'name' ? 'rgba(255, 255, 255, 0.6)' : 'rgba(255, 255, 255, 0.3)',
                                                    transition: 'color 0.2s ease',
                                                }}
                                            >
                                                <User size={18} />
                                            </div>
                                            <input
                                                type="text"
                                                placeholder="Your name"
                                                required
                                                onFocus={() => setFocusedField('name')}
                                                onBlur={() => setFocusedField(null)}
                                                style={{
                                                    flex: 1,
                                                    background: 'transparent',
                                                    border: 'none',
                                                    padding: '1rem 1rem 1rem 0',
                                                    color: 'white',
                                                    fontSize: '0.95rem',
                                                    fontFamily: "'Inter', sans-serif",
                                                    outline: 'none',
                                                    width: '100%',
                                                }}
                                            />
                                        </div>
                                    </div>

                                    {/* Email Field */}
                                    <div style={{ marginBottom: '1.25rem' }}>
                                        <div
                                            style={{
                                                position: 'relative',
                                                display: 'flex',
                                                alignItems: 'center',
                                                background: focusedField === 'email' ? 'rgba(255, 255, 255, 0.08)' : 'rgba(255, 255, 255, 0.03)',
                                                borderRadius: '12px',
                                                border: `1px solid ${focusedField === 'email' ? 'rgba(255, 255, 255, 0.2)' : 'rgba(255, 255, 255, 0.08)'}`,
                                                transition: 'all 0.2s ease',
                                            }}
                                        >
                                            <div
                                                style={{
                                                    padding: '0 1rem',
                                                    color: focusedField === 'email' ? 'rgba(255, 255, 255, 0.6)' : 'rgba(255, 255, 255, 0.3)',
                                                    transition: 'color 0.2s ease',
                                                }}
                                            >
                                                <Mail size={18} />
                                            </div>
                                            <input
                                                type="email"
                                                placeholder="Your email"
                                                required
                                                onFocus={() => setFocusedField('email')}
                                                onBlur={() => setFocusedField(null)}
                                                style={{
                                                    flex: 1,
                                                    background: 'transparent',
                                                    border: 'none',
                                                    padding: '1rem 1rem 1rem 0',
                                                    color: 'white',
                                                    fontSize: '0.95rem',
                                                    fontFamily: "'Inter', sans-serif",
                                                    outline: 'none',
                                                    width: '100%',
                                                }}
                                            />
                                        </div>
                                    </div>

                                    {/* Message Field */}
                                    <div style={{ marginBottom: '1.75rem' }}>
                                        <div
                                            style={{
                                                position: 'relative',
                                                display: 'flex',
                                                alignItems: 'flex-start',
                                                background: focusedField === 'message' ? 'rgba(255, 255, 255, 0.08)' : 'rgba(255, 255, 255, 0.03)',
                                                borderRadius: '12px',
                                                border: `1px solid ${focusedField === 'message' ? 'rgba(255, 255, 255, 0.2)' : 'rgba(255, 255, 255, 0.08)'}`,
                                                transition: 'all 0.2s ease',
                                            }}
                                        >
                                            <div
                                                style={{
                                                    padding: '1rem 1rem 0 1rem',
                                                    color: focusedField === 'message' ? 'rgba(255, 255, 255, 0.6)' : 'rgba(255, 255, 255, 0.3)',
                                                    transition: 'color 0.2s ease',
                                                }}
                                            >
                                                <MessageSquare size={18} />
                                            </div>
                                            <textarea
                                                placeholder="Your message"
                                                required
                                                rows={4}
                                                onFocus={() => setFocusedField('message')}
                                                onBlur={() => setFocusedField(null)}
                                                style={{
                                                    flex: 1,
                                                    background: 'transparent',
                                                    border: 'none',
                                                    padding: '1rem 1rem 1rem 0',
                                                    color: 'white',
                                                    fontSize: '0.95rem',
                                                    fontFamily: "'Inter', sans-serif",
                                                    outline: 'none',
                                                    resize: 'none',
                                                    width: '100%',
                                                    lineHeight: 1.5,
                                                }}
                                            />
                                        </div>
                                    </div>

                                    {/* Submit Button */}
                                    <motion.button
                                        type="submit"
                                        disabled={formState === 'sending'}
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        style={{
                                            width: '100%',
                                            background: formState === 'sending'
                                                ? 'rgba(255, 255, 255, 0.1)'
                                                : 'linear-gradient(135deg, #fff 0%, #e5e5e5 100%)',
                                            color: formState === 'sending' ? 'rgba(255, 255, 255, 0.5)' : '#000',
                                            border: 'none',
                                            padding: '1rem 2rem',
                                            borderRadius: '12px',
                                            fontSize: '1rem',
                                            fontWeight: 600,
                                            cursor: formState === 'sending' ? 'not-allowed' : 'pointer',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            gap: '0.5rem',
                                            transition: 'all 0.2s ease',
                                            boxShadow: formState === 'sending'
                                                ? 'none'
                                                : '0 4px 14px rgba(255, 255, 255, 0.1)',
                                        }}
                                    >
                                        {formState === 'sending' ? (
                                            <>
                                                <motion.div
                                                    animate={{ rotate: 360 }}
                                                    transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                                                    style={{
                                                        width: '18px',
                                                        height: '18px',
                                                        border: '2px solid rgba(255, 255, 255, 0.3)',
                                                        borderTopColor: 'rgba(255, 255, 255, 0.8)',
                                                        borderRadius: '50%',
                                                    }}
                                                />
                                                Sending...
                                            </>
                                        ) : (
                                            <>
                                                Send Message
                                                <Send size={18} />
                                            </>
                                        )}
                                    </motion.button>

                                    {/* Email fallback */}
                                    <p
                                        style={{
                                            textAlign: 'center',
                                            marginTop: '1.25rem',
                                            fontSize: '0.85rem',
                                            color: 'rgba(255, 255, 255, 0.4)',
                                        }}
                                    >
                                        Or email us directly at{' '}
                                        <a
                                            href="mailto:hello@uplo.ai"
                                            style={{
                                                color: 'rgba(255, 255, 255, 0.6)',
                                                textDecoration: 'none',
                                                borderBottom: '1px solid rgba(255, 255, 255, 0.3)',
                                                transition: 'all 0.2s ease',
                                            }}
                                            onMouseEnter={(e) => {
                                                e.currentTarget.style.color = 'white';
                                                e.currentTarget.style.borderBottomColor = 'white';
                                            }}
                                            onMouseLeave={(e) => {
                                                e.currentTarget.style.color = 'rgba(255, 255, 255, 0.6)';
                                                e.currentTarget.style.borderBottomColor = 'rgba(255, 255, 255, 0.3)';
                                            }}
                                        >
                                            hello@uplo.ai
                                        </a>
                                    </p>
                                </form>
                            )}
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};

export default ContactModal;
