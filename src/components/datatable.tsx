import * as React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { Datas } from "@/types/logs";
import { isNull, isUndefined } from "lodash";


export default function Datatable(props: Datas) {
  let id = (props.currentPage-1) *5 || 0;
  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead className="bg-gray-100 p-2">
          <TableRow>
            <TableCell>ID</TableCell>
            <TableCell align="right">Sync Path</TableCell>
            <TableCell align="right">Sync Type</TableCell>
            <TableCell align="right">Cloud</TableCell>
            <TableCell align="right">Time</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {isNull(props.datas) || isUndefined(props.datas) ? (
            <div>Loading ...</div>
          ) : (
            props.datas.map((row) => {
              ++id;
              return (
                <TableRow
                  key={row.id}
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  <TableCell component="th" scope="row">
                    {id}
                  </TableCell>
                  <TableCell align="right">{row.path}</TableCell>
                  <TableCell align="right">{row.type}</TableCell>
                  <TableCell align="right">{row.drive}</TableCell>
                  <TableCell align="right">{row.create_on}</TableCell>
                </TableRow>
              );
            })
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
