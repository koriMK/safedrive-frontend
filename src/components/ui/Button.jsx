export function Button({ children, variant = 'primary', size = 'md', className = '', ...props }) {
  const baseClasses = 'inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none';
  
  const variants = {
    primary: 'text-white hover:opacity-90',
    secondary: 'text-white hover:opacity-90', 
    outline: 'border hover:text-white',
    ghost: 'hover:bg-gray-100 text-gray-900',
  };
  
  const sizes = {
    sm: 'h-9 px-3 text-sm',
    md: 'h-10 py-2 px-4',
    lg: 'h-11 px-8',
  };
  
  const getStyle = () => {
    if (variant === 'primary') return { backgroundColor: '#0E1F40' };
    if (variant === 'secondary') return { backgroundColor: '#2AD7A1' };
    if (variant === 'outline') return { borderColor: '#0E1F40', color: '#0E1F40' };
    return {};
  };

  return (
    <button
      className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`}
      style={getStyle()}
      {...props}
    >
      {children}
    </button>
  );
}