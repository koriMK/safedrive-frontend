export function Badge({ children, variant = 'default', className = '', ...props }) {
  const variants = {
    default: 'bg-gray-900 text-white',
    secondary: 'bg-gray-100 text-gray-900',
    destructive: 'bg-red-500 text-white',
    outline: 'text-gray-900 border border-gray-300 bg-white',
  };

  return (
    <div
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}