// src/components/ui/Modal.jsx
import React, { useEffect } from "react";
import PropTypes from "prop-types";

/**
 * Modal Component
 * Reusable modal dialog for confirmations, forms, etc.
 *
 * Usage:
 * <Modal
 *   isOpen={open}
 *   title="Confirm Action"
 *   onClose={handleClose}
 * >
 *   <p>Are you sure?</p>
 *   <button onClick={handleClose}>Cancel</button>
 *   <button onClick={handleConfirm}>Confirm</button>
 * </Modal>
 */
function Modal({ 
  isOpen = true, 
  title, 
  children, 
  onClose, 
  size = "md",
  showClose = true 
}) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const sizeClasses = {
    sm: "max-w-sm",
    md: "max-w-md",
    lg: "max-w-lg",
    xl: "max-w-xl",
    full: "max-w-4xl",
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal Content */}
      <div className={`relative ${sizeClasses[size]} w-full mx-4 glass-card p-6 animate-slide-up`}>
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <h2 className="text-xl font-display font-bold text-white">{title}</h2>
          {showClose && (
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-white transition-colors p-1"
            >
              ✕
            </button>
          )}
        </div>

        {/* Body */}
        <div className="text-slate-300">
          {children}
        </div>
      </div>
    </div>
  );
}

Modal.propTypes = {
  isOpen: PropTypes.bool,
  title: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
  onClose: PropTypes.func.isRequired,
  size: PropTypes.oneOf(["sm", "md", "lg", "xl", "full"]),
  showClose: PropTypes.bool,
};

export default Modal;
