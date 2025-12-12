export const Table = ({ children }) => <table className="min-w-full">{children}</table>;
export const TableHeader = ({ children }) => <thead className="bg-gray-50">{children}</thead>;
export const TableBody = ({ children }) => <tbody className="divide-y divide-gray-200">{children}</tbody>;
export const TableRow = ({ children, className = "" }) => <tr className={className}>{children}</tr>;
export const TableHead = ({ children, className = "", ...props }) => (
  <th scope="col" className={`px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider ${className}`} {...props}>
    {children}
  </th>
);
export const TableCell = ({ children, className = "" }) => (
  <td className={`px-6 py-3 whitespace-nowrap text-sm text-gray-700 ${className}`}>{children}</td>
);