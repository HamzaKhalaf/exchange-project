import { useState, useCallback } from "react"
import {
  Box,
  Typography,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
  Button
} from "@mui/material"
import { DeleteForever, RemoveRedEye } from "@mui/icons-material/";
import { useNavigate } from 'react-router-dom'
import { format } from 'date-fns'

const ConversionHistory = () => {
  const navigate = useNavigate();
  const [converstionHistory, setConverstionHistory] = useState(JSON.parse(localStorage.getItem("convertHistory")) || [])
  
  const viewButtonCB = useCallback((amount, from, to) => () => {
    navigate(`/converter?amount=${amount}&from=${from}&to=${to}`)
  }, [navigate])

  const deleteButtonCB = useCallback((date) => () => {
    const newConversionHistory = converstionHistory.filter((item) => item.date !== date);
    localStorage.setItem("convertHistory", JSON.stringify(newConversionHistory))
    setConverstionHistory(newConversionHistory)
  }, [converstionHistory])

  return (
      <Box marginTop="25px">
        <Typography variant="h3" sx={{ fontWeight: "bold" }}>Conversion History</Typography>

        <TableContainer sx={{ marginTop: "25px" }} component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell width="30%"><Typography color="text.secondary">Date</Typography></TableCell>
                <TableCell width="40%"><Typography color="text.secondary">Event</Typography></TableCell>
                <TableCell width="30%"><Typography color="text.secondary">Actions</Typography></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {
                converstionHistory.map((item, index) => {
                  const { amount, from, to, date } = item;
                  return (
                    <TableRow key={date}>
                      <TableCell width="30%">{format(new Date(date), "dd/MM/yyyy '@' HH:mm")}</TableCell>
                      <TableCell width="40%">{`Converted an amount of ${amount} from ${from} to ${to}`}</TableCell>
                      <TableCell width="30%">
                        <Box display="flex" justifyContent="space-between">
                          <Button sx={{textTransform: "none"}} variant="text" onClick={viewButtonCB(amount, from, to)}>
                            <RemoveRedEye fontSize="small"/>
                            <Typography fontSize="small">View</Typography>
                          </Button>
                          <Button sx={{textTransform: "none"}} color="error" variant="text" onClick={deleteButtonCB(date)}>
                            <DeleteForever fontSize="small"/>
                            <Typography fontSize="small" noWrap>Delete from history</Typography>
                          </Button>
                        </Box>
                      </TableCell>
                    </TableRow>
                  )
                })
              }
            </TableBody>
          </Table>
        </TableContainer>

      </Box>
  )
}

export default ConversionHistory