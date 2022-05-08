import React from "react";

export interface OptionProps {
  _id: number;
  name: string;
  value: number;
}

interface SelectProps {
  name: any; //TODO: fix any
  label: any; //TODO: fix any
  options: OptionProps[];
  error: any; //TODO: fix any
  value: any; //TODO: fix any
  onChange: any; //TODO: fix any
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
        {options.map((option) => (
          <option key={option._id} value={option.value}>
            {option.name}
          </option>
        ))}
      </select>
      {error && <div className="alert alert-danger">{error}</div>}
    </div>
  );
};

export default Select;
