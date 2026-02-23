import React from 'react';

const GeneralStatusTag = ({ statuses = [] }) => {
  const statusConfig = {
    running: {
      background: 'rgba(39, 174, 96, 0.15)',
      color: '#27AE60',
      label: 'Running'
    },
    success: {
      background: 'rgba(39, 174, 96, 0.15)',
      color: '#27AE60',
      label: 'Deployed Successfully'
    },
    stopped: {
      background: '#F2F2F2',
      color: '#4F4F4F',
      label: 'Stopped'
    },
    preview: {
      background: '#F2F2F2',
      color: '#4F4F4F',
      label: 'Preview'
    },
    draft: {
      background: 'rgba(45, 156, 219, 0.15)',
      color: '#2D9CDB',
      label: 'Draft'
    },
    coding: {
      background: 'rgba(155, 81, 224, 0.15)',
      color: '#9B51E0',
      label: 'Coding'
    },
    testing: {
      background: 'rgba(45, 156, 219, 0.15)',
      color: '#2D9CDB',
      label: 'Testing'
    },
    paused: {
      background: 'rgba(242, 201, 76, 0.25)',
      color: '#AF8C1F',
      label: 'Paused'
    },
    deploying: {
      background: 'rgba(242, 201, 76, 0.25)',
      color: '#AF8C1F',
      label: 'Deploying'
    },
    destroying: {
      background: 'rgba(242, 201, 76, 0.25)',
      color: '#AF8C1F',
      label: 'Destroying'
    },
    error: {
      background: 'rgba(200, 51, 51, 0.15)',
      color: '#C83333',
      label: 'Error'
    },
    destroyed: {
      background: 'rgba(200, 51, 51, 0.15)',
      color: '#C83333',
      label: 'Destroyed'
    }
  };

  return (
    <div style={styles.container}>
      {statuses.length === 0 ? (
        <p style={styles.emptyText}>No statuses</p>
      ) : (
        statuses.map((status, index) => {
          const config = statusConfig[status] || statusConfig.stopped;
          return (
            <div
              key={index}
              style={{
                ...styles.badge,
                background: config.background,
                color: config.color
              }}
            >
              {config.label}
            </div>
          );
        })
      )}
    </div>
  );
};

const styles = {
  container: {
    boxSizing: 'border-box',
    position: 'relative',
    width: '252px',
    height: '364px',
    background: '#FFFFFF',
    border: '1px dashed #9747FF',
    borderRadius: '5px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'center',
    padding: '20px',
    gap: '12px',
    overflow: 'auto'
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
    minWidth: '60px',
    textAlign: 'center'
  },

  emptyText: {
    fontFamily: "'General Sans'",
    fontSize: '12px',
    color: '#999999',
    textAlign: 'center'
  }
};

export default GeneralStatusTag;
