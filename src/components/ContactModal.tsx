import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, Check } from 'lucide-react';

interface ContactModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const ContactModal: React.FC<ContactModalProps> = ({ isOpen, onClose }) => {
    const [formState, setFormState] = useState<'idle' | 'sending' | 'sent'>('idle');

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

    const inputStyle = {
        width: '100%',
        background: 'transparent',
        border: 'none',
        borderBottom: '1px solid rgba(255, 255, 255, 0.2)',
        padding: '1rem 0',
        color: 'white',
        fontSize: '1rem',
        fontFamily: "'Inter', sans-serif",
        outline: 'none',
        transition: 'border-color 0.3s',
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
                        onClick={onClose}
                        style={{
                            position: 'fixed',
                            top: 0,
                            left: 0,
                            width: '100%',
                            height: '100%',
                            background: 'rgba(0, 0, 0, 0.8)',
                            backdropFilter: 'blur(10px)',
                            zIndex: 10,
                        }}
                    />

                    {/* Modal */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        style={{
                            position: 'fixed',
                            top: '50%',
                            left: '50%',
                            transform: 'translate(-50%, -50%)',
                            width: '90%',
                            maxWidth: '600px',
                            zIndex: 11,
                        }}
                    >
                        <button
                            onClick={onClose}
                            style={{
                                position: 'absolute',
                                top: '-3rem',
                                right: 0,
                                background: 'none',
                                border: 'none',
                                color: 'rgba(255, 255, 255, 0.5)',
                                cursor: 'pointer',
                            }}
                        >
                            <X size={24} />
                        </button>

                        {formState === 'sent' ? (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                style={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    height: '300px',
                                    color: '#00f2ff',
                                }}
                            >
                                <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{ type: 'spring', stiffness: 200, damping: 10 }}
                                >
                                    <Check size={64} />
                                </motion.div>
                                <h3 style={{ marginTop: '1rem', fontSize: '1.5rem', color: 'white' }}>Message Sent</h3>
                            </motion.div>
                        ) : (
                            <form onSubmit={handleSubmit}>
                                <h2 style={{
                                    fontSize: '2.5rem',
                                    fontWeight: 700,
                                    marginBottom: '2rem',
                                    background: 'linear-gradient(to right, #fff, #aaa)',
                                    WebkitBackgroundClip: 'text',
                                    WebkitTextFillColor: 'transparent',
                                }}>
                                    Say Hello.
                                </h2>

                                <div style={{ marginBottom: '1.5rem' }}>
                                    <input
                                        type="text"
                                        placeholder="Your Name"
                                        required
                                        style={inputStyle}
                                        onFocus={(e) => e.target.style.borderBottomColor = '#00f2ff'}
                                        onBlur={(e) => e.target.style.borderBottomColor = 'rgba(255, 255, 255, 0.2)'}
                                    />
                                </div>

                                <div style={{ marginBottom: '1.5rem' }}>
                                    <input
                                        type="email"
                                        placeholder="Your Email"
                                        required
                                        style={inputStyle}
                                        onFocus={(e) => e.target.style.borderBottomColor = '#00f2ff'}
                                        onBlur={(e) => e.target.style.borderBottomColor = 'rgba(255, 255, 255, 0.2)'}
                                    />
                                </div>

                                <div style={{ marginBottom: '3rem' }}>
                                    <textarea
                                        placeholder="Your Message"
                                        required
                                        rows={3}
                                        style={{ ...inputStyle, resize: 'none' }}
                                        onFocus={(e) => e.target.style.borderBottomColor = '#00f2ff'}
                                        onBlur={(e) => e.target.style.borderBottomColor = 'rgba(255, 255, 255, 0.2)'}
                                    />
                                </div>

                                <motion.button
                                    type="submit"
                                    disabled={formState === 'sending'}
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    style={{
                                        background: 'white',
                                        color: 'black',
                                        border: 'none',
                                        padding: '1rem 3rem',
                                        borderRadius: '50px',
                                        fontSize: '1.1rem',
                                        fontWeight: 600,
                                        cursor: 'pointer',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '0.5rem',
                                        opacity: formState === 'sending' ? 0.7 : 1,
                                    }}
                                >
                                    {formState === 'sending' ? 'Sending...' : <>Send Message <Send size={18} /></>}
                                </motion.button>
                            </form>
                        )}
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};

export default ContactModal;
