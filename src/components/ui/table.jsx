import React from 'react';

export const Table = ({ children, ...props }) => (
  <div className="w-full overflow-auto">
    <table className="w-full caption-bottom text-sm" {...props}>
      {children}
    </table>
  </div>
);

export const TableHeader = ({ children, ...props }) => (
  <thead className="[&_tr]:border-b" {...props}>
    {children}
  </thead>
);

export const TableBody = ({ children, ...props }) => (
  <tbody className="[&_tr:last-child]:border-0" {...props}>
    {children}
  </tbody>
);

export const TableRow = ({ children, ...props }) => (
  <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted" {...props}>
    {children}
  </tr>
);

export const TableHead = ({ children, ...props }) => (
  <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0" {...props}>
    {children}
  </th>
);

export const TableCell = ({ children, ...props }) => (
  <td className="p-4 align-middle [&:has([role=checkbox])]:pr-0" {...props}>
    {children}
  </td>
);