"use client";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import { SyncDetail } from "@/types/sync";
import { Daily, Monthly, Weekly } from "@/constants/sync";

export default function SelectDetail(props: SyncDetail) {
  const handleChange = (event: SelectChangeEvent) => {
    props.setDetail(parseInt(event.target.value));
  };

  return (
    <div>
      <FormControl sx={{ m: 1, minWidth: 100, width: "15vw" }}>
        <Select
          labelId="demo-simple-select-helper-label"
          id="demo-simple-select-helper"
          value={String(props.detail)}
          onChange={handleChange}
          className="bg-white w-[100%]"
          disabled={props.status?false:true}
        >
          {props.type === "d"
            ? Daily.map((item, index) => (
                <MenuItem value={index} key={`daily-${index}`}>{item}</MenuItem>
              ))
            : props.type === "w"
            ? Weekly.map((item, index) => (
                <MenuItem value={index} key={`weekly-${index}`}>{item}</MenuItem>
              ))
            : Monthly.map((item, index) => (
                <MenuItem value={index} key={`monthly-${index}`}>{item}</MenuItem>
              ))}
        </Select>
      </FormControl>
    </div>
  );
}
