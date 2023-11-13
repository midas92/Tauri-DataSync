"use client";
import * as React from "react";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormHelperText from "@mui/material/FormHelperText";
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";

export default function SelectLabels() {
  const [age, setAge] = React.useState("");

  const handleChange = (event: SelectChangeEvent) => {
    setAge(event.target.value);
  };

  return (
    <div>
      <FormControl sx={{ m: 1, minWidth: 300 }}>
        <Select
          labelId="demo-simple-select-helper-label"
          id="demo-simple-select-helper"
          value={age}
          onChange={handleChange}
          defaultValue={"d"}
          className="bg-white"
        >
          <MenuItem value={"d"}>Daily</MenuItem>
          <MenuItem value={"w"}>Weekly</MenuItem>
          <MenuItem value={"m"}>Monthly</MenuItem>
          <MenuItem value={"y"}>Yearly</MenuItem>
        </Select>
      </FormControl>
    </div>
  );
}
