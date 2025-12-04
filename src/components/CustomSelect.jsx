// components/CustomSelect.jsx
import React from "react";
import { Select, MenuItem } from "@mui/material";

const CustomSelect = ({
  value,
  onChange,
  options = [],
  label,
  className = "",
  ...rest
}) => {
  return (
    <Select
      value={value}
      onChange={onChange}
      displayEmpty
      className={className}
      required
      {...rest}
    >
      <MenuItem value="">
        <em>{label}</em>
      </MenuItem>
      {options.map((item, index) => (
        <MenuItem key={index} value={item}>
          {item}
        </MenuItem>
      ))}
    </Select>
  );
};

export default CustomSelect;