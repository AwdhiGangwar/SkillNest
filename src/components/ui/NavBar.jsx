import React, { useState } from 'react';

const NavBar = ({ items = [], onItemClick, selectedId = null, isExpanded = true }) => {
  const [hoveredId, setHoveredId] = useState(null);

  const getItemStyle = (item) => {
    const isSelected = selectedId === item.id;
    const isHovered = hoveredId === item.id;

    if (isExpanded) {
      // Expanded states
      if (isSelected) {
        return styles.itemExpandedSelected;
      } else if (isHovered) {
        return styles.itemExpandedHover;
      } else {
        return styles.itemExpandedUnselected;
      }
    } else {
      // Collapsed states
      if (isSelected) {
        return styles.itemCollapsedSelected;
      } else if (isHovered) {
        return styles.itemCollapsedHover;
      } else {
        return styles.itemCollapsedUnselected;
      }
    }
  };

  const getIconStyle = (item) => {
    const isSelected = selectedId === item.id;
    const isHovered = hoveredId === item.id;

    if (isSelected || isHovered) {
      return { ...styles.icon, background: '#FFFFFF' };
    } else {
      return { ...styles.icon, background: '#869098' };
    }
  };

  const getTextStyle = (item) => {
    const isSelected = selectedId === item.id;
    const isHovered = hoveredId === item.id;

    if (isSelected || isHovered) {
      return { ...styles.label, color: '#FFFFFF' };
    } else {
      return { ...styles.label, color: '#C2C8CC' };
    }
  };

  return (
    <div style={{ ...styles.container, width: isExpanded ? '292px' : '356px' }}>
      {items.map((item, index) => (
        <div
          key={item.id}
          style={{ ...getItemStyle(item), top: `${20 + index * 76}px` }}
          onMouseEnter={() => setHoveredId(item.id)}
          onMouseLeave={() => setHoveredId(null)}
          onClick={() => onItemClick?.(item.id)}
          role="button"
          tabIndex={0}
        >
          {/* Icon */}
          <div style={getIconStyle(item)}>
            {item.icon}
          </div>

          {/* Label (Only in expanded mode) */}
          {isExpanded && (
            <span style={getTextStyle(item)}>
              {item.label}
            </span>
          )}
        </div>
      ))}
    </div>
  );
};

const styles = {
  container: {
    boxSizing: 'border-box',
    position: 'relative',
    height: '248px',
    background: '#0D2232',
    border: '1px dashed #9747FF',
    borderRadius: '5px',
    padding: '20px'
  },

  // Expanded states
  itemExpandedUnselected: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    padding: '16px',
    gap: '24px',
    position: 'absolute',
    width: '252px',
    height: '56px',
    left: '20px',
    borderRadius: '16px',
    cursor: 'pointer',
    transition: 'all 0.2s ease'
  },

  itemExpandedSelected: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    padding: '16px',
    gap: '24px',
    position: 'absolute',
    width: '252px',
    height: '56px',
    left: '20px',
    background: '#144778',
    borderRadius: '12px',
    cursor: 'pointer',
    transition: 'all 0.2s ease'
  },

  itemExpandedHover: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    padding: '16px',
    gap: '24px',
    position: 'absolute',
    width: '252px',
    height: '56px',
    left: '20px',
    borderRadius: '16px',
    cursor: 'pointer',
    transition: 'all 0.2s ease'
  },

  // Collapsed states
  itemCollapsedUnselected: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '16px',
    gap: '24px',
    position: 'absolute',
    width: '56px',
    height: '56px',
    left: '295px',
    borderRadius: '16px',
    cursor: 'pointer',
    transition: 'all 0.2s ease'
  },

  itemCollapsedSelected: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '16px',
    gap: '24px',
    position: 'absolute',
    width: '56px',
    height: '56px',
    left: '295px',
    background: '#144778',
    borderRadius: '16px',
    cursor: 'pointer',
    transition: 'all 0.2s ease'
  },

  itemCollapsedHover: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '16px',
    gap: '24px',
    position: 'absolute',
    width: '56px',
    height: '56px',
    left: '295px',
    borderRadius: '16px',
    cursor: 'pointer',
    transition: 'all 0.2s ease'
  },

  icon: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '0px',
    gap: '10px',
    width: '24px',
    height: '24px',
    borderRadius: '4px',
    fontSize: '18px',
    transition: 'all 0.2s ease',
    flex: 'none'
  },

  label: {
    fontFamily: "'General Sans'",
    fontStyle: 'normal',
    fontWeight: 500,
    fontSize: '16px',
    lineHeight: '22px',
    transition: 'all 0.2s ease',
    flex: 1,
    whiteSpace: 'nowrap'
  }
};

export default NavBar;
