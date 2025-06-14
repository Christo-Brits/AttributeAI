import React from "react";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({ children, ...props }) => (
  <button style={{ padding: '8px 16px', borderRadius: 4, background: '#0070f3', color: '#fff', border: 'none' }} {...props}>
    {children}
  </button>
);
