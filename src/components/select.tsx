"use client";
import * as React from "react";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import { SyncType } from "@/types/sync";
import { syncTypes } from "@/constants/sync";

export default function SelectLabels(props : SyncType) {

  const handleChange = (event: SelectChangeEvent) => {
    props.settype(event.target.value);
  };

  return (
    <div>
      <FormControl sx={{ m: 1, minWidth: 100,width:"15vw" }}>
        <Select
          labelId="demo-simple-select-helper-label"
          id="demo-simple-select-helper"
          value={props.type}
          onChange={handleChange}
          defaultValue={"d"}
          className="bg-white w-[100%]"
          disabled={props.status?false:true}
        >
          {
            syncTypes.map((item, index)=>{
              return <MenuItem value={item.value} key={`type-${index}`}>{item.type}</MenuItem>
            })
          }
        </Select>
      </FormControl>
    </div>
  );
}
