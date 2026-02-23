import React from 'react';

const EarningStatus = ({ status = 'paid' }) => {
  const statusConfig = {
    paid: {
      background: 'rgba(39, 174, 96, 0.15)',
      color: '#27AE60',
      label: 'Paid'
    },
    processing: {
      background: '#E0F0FA',
      color: '#2D9CDB',
      label: 'Processing'
    },
    failed: {
      background: 'rgba(200, 51, 51, 0.15)',
      color: '#C83333',
      label: 'Failed'
    }
  };

  const config = statusConfig[status] || statusConfig.paid;

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
    width: '221px',
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
    fontFamily: "'General Sans'",
    fontStyle: 'normal',
    fontWeight: 500,
    fontSize: '12px',
    lineHeight: '16px',
    minWidth: '60px',
    textAlign: 'center'
  }
};

export default EarningStatus;
