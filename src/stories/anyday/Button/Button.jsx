import React from "react";
import PropTypes from "prop-types";

export const Button = ({
  primary,
  backgroundColor,
  size,
  label,
  flat,
  ...props
}) => {
  const mode = primary
    ? "bg-primary border border-black border-2 px-3 py-2 rounded-full font-semibold text-on-primary hover:bg-primary hover:text-on-primary active:bg-tertiary-container"
    : "border border-black border-2 px-3 py-2 rounded-full font-semibold text-black hover:bg-primary hover:text-on-primary active:bg-tertiary-container";

  const style = flat ? "px-8 py-1" : "";

  const sizeClasses = {
    small: "text-xs",
    medium: "text-sm",
    karge: "text-lg",
  };

  return (
    <button
      type="button"
      className={`${mode} ${sizeClasses[size]} ${style}`}
      style={backgroundColor && { backgroundColor }}
      {...props}
    >
      {label}
    </button>
  );
};

Button.propTypes = {
  primary: PropTypes.bool,
  backgroundColor: PropTypes.string,
  size: PropTypes.oneOf(["small", "medium", "large"]),
  label: PropTypes.string.isRequired,
  flat: PropTypes.bool,
  onclick: PropTypes.func,
};

Button.defaultProps = {
  backgroundColor: null,
  primary: false,
  size: "medium",
  flat: false,
  onClick: undefined,
};
