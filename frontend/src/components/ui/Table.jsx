// src/components/ui/Table.jsx
import PropTypes from "prop-types";

/**
 * Table Component
 * Responsive table component for displaying data sets
 *
 * Usage:
 * <Table
 *   columns={['ID', 'Name', 'Email', 'Status']}
 *   data={[
 *     { id: 1, name: 'John', email: 'john@example.com', status: 'active' },
 *     ...
 *   ]}
 *   renderRow={(row) => (
 *     <tr>
 *       <td>{row.id}</td>
 *       <td>{row.name}</td>
 *       <td>{row.email}</td>
 *       <td><Badge label={row.status} /></td>
 *     </tr>
 *   )}
 * />
 */
function Table({ 
  columns = [], 
  data = [], 
  renderRow = null,
  loading = false,
  className = "" 
}) {
  if (loading) {
    return (
      <div className="glass-card overflow-hidden">
        <div className="divide-y divide-surface-border">
          {Array(5).fill(0).map((_, i) => (
            <div key={i} className="p-4 flex gap-4 animate-pulse">
              <div className="h-4 bg-surface-border rounded flex-1" />
              <div className="h-4 bg-surface-border rounded flex-1" />
              <div className="h-4 bg-surface-border rounded flex-1" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="glass-card p-8 text-center">
        <p className="text-slate-400">No data to display</p>
      </div>
    );
  }

  return (
    <div className={`glass-card overflow-x-auto ${className}`}>
      <table className="w-full">
        {/* Table Header */}
        {columns && columns.length > 0 && (
          <thead>
            <tr className="border-b border-surface-border">
              {columns.map((col, i) => (
                <th
                  key={i}
                  className="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wide"
                >
                  {col}
                </th>
              ))}
            </tr>
          </thead>
        )}

        {/* Table Body */}
        <tbody className="divide-y divide-surface-border">
          {data.map((row, i) => (
            renderRow ? (
              renderRow(row, i)
            ) : (
              <tr key={i} className="hover:bg-surface-hover/50 transition-colors">
                {columns && columns.map((col, j) => (
                  <td key={j} className="px-4 py-3 text-sm text-slate-300">
                    {typeof row === "object" ? row[col.toLowerCase()] : row}
                  </td>
                ))}
              </tr>
            )
          ))}
        </tbody>
      </table>
    </div>
  );
}

Table.propTypes = {
  columns: PropTypes.arrayOf(PropTypes.string),
  data: PropTypes.array,
  renderRow: PropTypes.func,
  loading: PropTypes.bool,
  className: PropTypes.string,
};

export default Table;
