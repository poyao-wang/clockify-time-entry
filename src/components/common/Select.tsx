import React from "react";

interface SelectProps {
  name: any; //TODO: fix any
  label: any; //TODO: fix any
  options: [any]; //TODO: fix any
  error: any; //TODO: fix any
}

const Select: React.FC<SelectProps> = ({
  name,
  label,
  options,
  error,
  ...rest
}) => {
  return (
    <div className="form-group">
      <label htmlFor={name}>{label}</label>
      <select name={name} id={name} {...rest} className="form-control">
        <option value="" />
        {options.map((option) => (
          <option key={option._id} value={option._id}>
            {option.name}
          </option>
        ))}
      </select>
      {error && <div className="alert alert-danger">{error}</div>}
    </div>
  );
};

export default Select;
