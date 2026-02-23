import React, { useState } from 'react';

const Sidebar = () => {
  const [isExpanded, setIsExpanded] = useState(true);

  const menuItems = [
    { id: 'dashboard', icon: '📊', label: 'Dashboard', isActive: true },
    { id: 'calendar', icon: '📅', label: 'Calendar', isActive: false },
    { id: 'students', icon: '👥', label: 'Students', isActive: false },
    { id: 'earning', icon: '💰', label: 'Earning', isActive: false },
    { id: 'settings', icon: '⚙️', label: 'Settings', isActive: false }
  ];

  return (
    <div style={{ ...styles.container, width: isExpanded ? '240px' : '104px' }}>
      {/* Top Section */}
      <div style={styles.topSection}>
        {/* Logo */}
        <div style={styles.logoSection}>
          <div style={styles.logoIcon}>
            <div style={styles.logoGradient}>SN</div>
          </div>
          {isExpanded && <div style={styles.logoText}>Skill Nest</div>}
        </div>

        {/* Menu Items */}
        <div style={styles.menuContainer}>
          {menuItems.map((item) => (
            <div
              key={item.id}
              style={{
                ...styles.menuItem,
                ...(item.isActive ? styles.menuItemActive : styles.menuItemInactive)
              }}
            >
              <div style={styles.iconWrapper}>{item.icon}</div>
              {isExpanded && <span style={styles.menuLabel}>{item.label}</span>}
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Section */}
      <div style={styles.bottomSection}>
        {/* Privacy & Terms */}
        <div style={styles.privacySection}>
          {isExpanded && <span style={styles.privacyText}>Privacy & Terms</span>}
        </div>

        {/* Logout */}
        <div
          style={{
            ...styles.menuItem,
            ...styles.logoutItem
          }}
        >
          <div style={styles.iconWrapper}>🚪</div>
          {isExpanded && <span style={styles.menuLabel}>Logout</span>}
        </div>
      </div>

      {/* Collapse/Expand Button */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        style={styles.collapseButton}
        title={isExpanded ? 'Collapse' : 'Expand'}
      >
        ‹
      </button>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '24px',
    gap: '40px',
    height: '1024px',
    background: '#0D2232',
    borderRadius: '16px',
    position: 'relative',
    transition: 'all 0.3s ease',
    boxSizing: 'border-box',
    overflow: 'hidden'
  },

  topSection: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '48px',
    width: '100%',
    flex: 'none'
  },

  logoSection: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    gap: '8px',
    width: '100%',
    padding: '8px 0px 8px 12px',
    boxSizing: 'border-box'
  },

  logoIcon: {
    width: '32px',
    height: '32px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flex: 'none'
  },

  logoGradient: {
    width: '100%',
    height: '100%',
    background: 'linear-gradient(195.32deg, #67A3F4 13.75%, #4798E9 95.03%)',
    borderRadius: '6px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontFamily: "'General Sans'",
    fontWeight: 600,
    fontSize: '14px',
    color: '#FFFFFF'
  },

  logoText: {
    fontFamily: "'General Sans'",
    fontStyle: 'normal',
    fontWeight: 600,
    fontSize: '16px',
    lineHeight: '22px',
    color: '#FFFFFF',
    whiteSpace: 'nowrap',
    flex: 'none'
  },

  menuContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
    width: '100%',
    alignItems: 'flex-start'
  },

  menuItem: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    padding: '16px',
    gap: '24px',
    width: '100%',
    height: '56px',
    borderRadius: '12px',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    boxSizing: 'border-box'
  },

  menuItemActive: {
    background: '#144778',
    borderRadius: '12px'
  },

  menuItemInactive: {
    background: 'transparent',
    borderRadius: '16px'
  },

  iconWrapper: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: '24px',
    height: '24px',
    flex: 'none',
    fontSize: '18px'
  },

  menuLabel: {
    fontFamily: "'General Sans'",
    fontStyle: 'normal',
    fontWeight: 500,
    fontSize: '16px',
    lineHeight: '22px',
    color: '#FFFFFF',
    whiteSpace: 'nowrap',
    flex: 1
  },

  bottomSection: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    width: '100%',
    alignItems: 'center',
    flex: 'none'
  },

  privacySection: {
    display: 'flex',
    padding: '0px 16px',
    width: '100%'
  },

  privacyText: {
    fontFamily: "'Inter Tight'",
    fontStyle: 'normal',
    fontWeight: 700,
    fontSize: '12px',
    lineHeight: '15px',
    textDecoration: 'underline',
    color: '#BDBDBD',
    cursor: 'pointer'
  },

  logoutItem: {
    marginTop: '8px'
  },

  collapseButton: {
    position: 'absolute',
    right: '-16px',
    top: 'calc(50% - 16px)',
    width: '32px',
    height: '32px',
    background: '#FFFFFF',
    border: '0.5px solid #E0E0E0',
    borderRadius: '50%',
    boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.25)',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '18px',
    color: '#E6500E',
    fontWeight: 'bold',
    transition: 'all 0.3s ease',
    zIndex: 2,
    borderWidth: 'none'
  }
};

export default Sidebar;
