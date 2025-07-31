import React from "react";

interface KitchenObjectProps {
  icon: React.ReactNode;
  label: React.ReactNode;
  subLabel?: React.ReactNode;
  style?: React.CSSProperties;
  onClick?: () => void;
  onMouseEnter?: React.MouseEventHandler<HTMLDivElement>;
  onMouseLeave?: React.MouseEventHandler<HTMLDivElement>;
}

export default function KitchenObject({ icon, label, subLabel, style, onClick, onMouseEnter, onMouseLeave }: KitchenObjectProps) {
  return (
    <div
      onClick={onClick}
      style={style}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <div>{icon}</div>
      {typeof label === 'string' ? <div>{label}</div> : label}
      {subLabel && <div style={{ fontSize: '0.6rem', opacity: 0.7, marginTop: '0.3rem', textAlign: 'center' }}>{subLabel}</div>}
    </div>
  );
}
