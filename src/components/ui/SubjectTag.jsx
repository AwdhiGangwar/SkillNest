import React from 'react';

const SubjectTag = ({ tags = [] }) => {
  const tagVariants = {
    coding: {
      background: '#F0E5FB',
      color: '#9B51E0'
    },
    design: {
      background: '#E0F0FA',
      color: '#2D9CDB'
    },
    default: {
      background: '#F5F5F5',
      color: '#666666'
    }
  };

  const getTagStyle = (variant) => {
    return tagVariants[variant?.toLowerCase()] || tagVariants.default;
  };

  return (
    <div style={styles.container}>
      {tags.length === 0 ? (
        <p style={styles.emptyText}>No tags added</p>
      ) : (
        tags.map((tag, index) => (
          <div
            key={index}
            style={{
              ...styles.tag,
              background: getTagStyle(tag.variant).background,
              color: getTagStyle(tag.variant).color
            }}
          >
            {tag.label}
          </div>
        ))
      )}
    </div>
  );
};

const styles = {
  container: {
    boxSizing: 'border-box',
    position: 'relative',
    width: '97px',
    height: '108px',
    background: '#FFFFFF',
    border: '1px dashed #8A38F5',
    borderRadius: '5px',
    padding: '12px',
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    overflow: 'hidden'
  },

  tag: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '4px 8px',
    gap: '10px',
    width: 'fit-content',
    height: '24px',
    borderRadius: '4px',
    fontFamily: "'General Sans'",
    fontStyle: 'normal',
    fontWeight: 500,
    fontSize: '12px',
    lineHeight: '16px',
    whiteSpace: 'nowrap',
    transition: 'all 0.2s ease'
  },

  emptyText: {
    fontFamily: "'General Sans'",
    fontSize: '12px',
    color: '#999999',
    textAlign: 'center',
    marginTop: '12px'
  }
};

export default SubjectTag;
