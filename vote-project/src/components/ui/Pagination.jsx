import React from 'react';

const Pagination = ({ 
  currentPage = 1, 
  totalItems = 36, 
  itemsPerPage = 12, 
  onPageChange 
}) => {
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  const handlePrevious = () => {
    if (currentPage > 1 && onPageChange) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages && onPageChange) {
      onPageChange(currentPage + 1);
    }
  };

  const handlePageClick = (page) => {
    if (onPageChange) {
      onPageChange(page);
    }
  };

  // Generate page numbers to display
  const getPageNumbers = () => {
    const pages = [];
    const maxPagesToShow = 3;
    
    if (totalPages <= maxPagesToShow) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      pages.push(1);
      if (currentPage > 2) pages.push(currentPage);
      if (currentPage < totalPages - 1) pages.push(totalPages);
    }
    
    return pages;
  };

  const pageNumbers = getPageNumbers();

  return (
    <div className="pagination-container" style={styles.container}>
      {/* Results info */}
      <div style={styles.resultsInfo}>
        <span style={styles.resultsText}>
          Showing {String(startItem).padStart(2, '0')}-{String(endItem).padStart(2, '0')} of {totalItems} results
        </span>
      </div>

      {/* Navigation controls */}
      <div style={styles.navigationContainer}>
        {/* Previous button */}
        <button
          onClick={handlePrevious}
          disabled={currentPage === 1}
          style={{
            ...styles.arrowButton,
            opacity: currentPage === 1 ? 0.5 : 1,
            cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
            transform: 'rotate(90deg)'
          }}
          aria-label="Previous page"
        >
          <svg
            viewBox="0 0 24 24"
            width="9"
            height="4.5"
            style={styles.arrowIcon}
          >
            <path d="M0 0 L9 4.5 L0 9" fill="none" stroke="#333333" strokeWidth="2" />
          </svg>
        </button>

        {/* Page numbers */}
        <div style={styles.numbersContainer}>
          {pageNumbers.map((page, index) => (
            <div key={page} style={styles.pageNumberWrapper}>
              <button
                onClick={() => handlePageClick(page)}
                style={{
                  ...styles.pageNumber,
                  ...(page === currentPage ? styles.pageNumberActive : styles.pageNumberInactive)
                }}
              >
                {page}
              </button>
              
              {/* Separator line between pages (except after last) */}
              {index < pageNumbers.length - 1 && (
                <div style={styles.separator}></div>
              )}
            </div>
          ))}
        </div>

        {/* Next button */}
        <button
          onClick={handleNext}
          disabled={currentPage === totalPages}
          style={{
            ...styles.arrowButton,
            opacity: currentPage === totalPages ? 0.5 : 1,
            cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
            transform: 'rotate(-90deg)'
          }}
          aria-label="Next page"
        >
          <svg
            viewBox="0 0 24 24"
            width="9"
            height="4.5"
            style={styles.arrowIcon}
          >
            <path d="M0 0 L9 4.5 L0 9" fill="none" stroke="#333333" strokeWidth="2" />
          </svg>
        </button>
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '0px 16px',
    gap: '13.93px',
    width: '100%',
    height: '24px',
    boxSizing: 'border-box'
  },
  
  resultsInfo: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: '142px',
    height: '18px',
    flex: 'none',
    order: 0,
    flexGrow: 0
  },
  
  resultsText: {
    fontFamily: "'Inter Tight'",
    fontStyle: 'normal',
    fontWeight: 400,
    fontSize: '12px',
    lineHeight: '18px',
    color: '#4F4F4F'
  },
  
  navigationContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    padding: '0px',
    gap: '24px',
    width: '151px',
    height: '24px',
    flex: 'none',
    order: 1,
    flexGrow: 0
  },
  
  arrowButton: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '0px',
    width: '24px',
    height: '24px',
    background: '#FCFCFC',
    borderRadius: '95.9996px',
    border: 'none',
    cursor: 'pointer',
    flex: 'none',
    flexGrow: 0,
    transition: 'background-color 0.2s ease'
  },
  
  arrowIcon: {
    width: '9px',
    height: '4.5px'
  },
  
  numbersContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '0px',
    gap: '16px',
    width: 'auto',
    height: '19px',
    flex: 'none',
    order: 1,
    flexGrow: 0
  },
  
  pageNumberWrapper: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '0px',
    width: 'auto',
    height: '19px',
    flex: 'none',
    flexGrow: 0
  },
  
  pageNumber: {
    width: 'auto',
    height: '18px',
    border: 'none',
    background: 'transparent',
    fontFamily: "'Inter Tight'",
    fontStyle: 'normal',
    fontSize: '12px',
    lineHeight: '18px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
    textTransform: 'uppercase',
    cursor: 'pointer',
    padding: '0 4px',
    transition: 'color 0.2s ease'
  },
  
  pageNumberActive: {
    fontWeight: 700,
    color: '#0D0D0D'
  },
  
  pageNumberInactive: {
    fontWeight: 400,
    color: '#4F4F4F'
  },
  
  separator: {
    width: '8px',
    height: '1px',
    background: '#080808',
    flex: 'none',
    order: 1,
    flexGrow: 0
  }
};

export default Pagination;
