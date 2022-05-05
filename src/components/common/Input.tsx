import React from "react";

interface InputProps {
  name: any; //TODO: fix any
  label: any; //TODO: fix any
  error: any; //TODO: fix any
}

const Input: React.FC<InputProps> = ({ name, label, error, ...rest }) => {
  return (
    <div className="form-group">
      <label htmlFor={name}>{label}</label>
      <input {...rest} name={name} id={name} className="form-control" />
      {error && <div className="alert alert-danger">{error}</div>}
    </div>
  );
};

export default Input;
