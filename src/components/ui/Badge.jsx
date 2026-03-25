export default function Badge({ children, variant = 'default', className = '' }) {
  const variants = {
    default: 'bg-gray-100 text-gray-600',
    success: 'bg-green-100 text-green-700',
    warning: 'bg-amber-100 text-amber-700',
    danger: 'bg-red-100 text-red-600',
    rose: 'bg-[#F2DADA] text-[#B8787A]',
    gold: 'bg-[#E8D5B0] text-[#8A6A30]',
  };
  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-xl text-xs font-medium ${variants[variant]} ${className}`}>
      {children}
    </span>
  );
}

export function StatusBadge({ status }) {
  const map = {
    confirmed: { label: 'Confirmado', variant: 'success' },
    pending: { label: 'Pendente', variant: 'warning' },
    cancelled: { label: 'Cancelado', variant: 'danger' },
    completed: { label: 'Concluído', variant: 'gold' },
  };
  const { label, variant } = map[status] || { label: status, variant: 'default' };
  return <Badge variant={variant}>{label}</Badge>;
}
