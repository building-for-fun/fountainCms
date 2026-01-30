import React from 'react';

type RoleMinimal = { id: string };

interface RoleCardProps {
  role: RoleMinimal;
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

const RoleCard: React.FC<RoleCardProps> = ({ role, children, className, style }) => {
  const applyHover = (el: HTMLDivElement | null, hover: boolean) => {
    if (!el) return;
    el.style.borderColor = hover ? 'var(--color-primary)' : 'var(--color-border)';
    el.style.boxShadow = hover ? '0 4px 12px rgba(0, 0, 0, 0.08)' : 'none';
  };

  const handleMouseEnter = (e: React.MouseEvent<HTMLDivElement>) =>
    applyHover(e.currentTarget, true);
  const handleMouseLeave = (e: React.MouseEvent<HTMLDivElement>) =>
    applyHover(e.currentTarget, false);

  const defaultStyle: React.CSSProperties = {
    background: 'var(--color-surface)',
    borderRadius: 'var(--radius-md)',
    padding: '1.25rem',
    border: '1px solid var(--color-border)',
    marginBottom: '1rem',
    transition: 'all 0.2s ease',
  };

  return (
    <div
      data-role-id={role.id}
      className={className}
      style={{ ...defaultStyle, ...style }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {children}
    </div>
  );
};

export default RoleCard;
