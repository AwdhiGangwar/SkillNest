import React from 'react';

const GradeNote = ({ grade = 'good' }) => {
  const gradeConfig = {
    good: {
      background: 'rgba(39, 174, 96, 0.15)',
      color: '#27AE60',
      label: 'Good'
    },
    average: {
      background: '#FBF1D2',
      color: '#AF8C1F',
      label: 'Average'
    },
    poor: {
      background: 'rgba(200, 51, 51, 0.15)',
      color: '#C83333',
      label: 'Poor'
    }
  };

  const config = gradeConfig[grade] || gradeConfig.good;

  return (
    <div style={styles.container}>
      <div style={{ ...styles.badge, background: config.background, color: config.color }}>
        {config.label}
      </div>
    </div>
  );
};

const styles = {
  container: {
    boxSizing: 'border-box',
    position: 'relative',
    width: '114px',
    height: '142px',
    background: '#FFFFFF',
    border: '1px dashed #8A38F5',
    borderRadius: '5px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '20px'
  },

  badge: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '4px 8px',
    gap: '10px',
    borderRadius: '4px',
    fontFamily: "'Inter Tight'",
    fontStyle: 'normal',
    fontWeight: 400,
    fontSize: '12px',
    lineHeight: '18px',
    minWidth: '50px',
    textAlign: 'center'
  }
};

export default GradeNote;
