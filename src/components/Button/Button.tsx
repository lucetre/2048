import React from "react";
import "./button.less";

type Props = {
  children: any;
  onClick?: () => void;
  disabled?: boolean;
};

export const Button = ({ children, onClick, disabled }: Props) => {
  return (
    <button className="button" onClick={onClick} disabled={disabled}>
      {children}
    </button>
  );
};
