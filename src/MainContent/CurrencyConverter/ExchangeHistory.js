import { useMemo, useCallback } from "react";

import {
  Box,
  TextField,
  Typography,
  Autocomplete,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";

const ExchangeHistory = ({ historyData, days, setDays, busy}) => {

  const calculateStatistics = useCallback(() => {
    let lowest = historyData[0]?.rate;
    let heighest = historyData[0]?.rate;
    let average = 0;
    historyData.forEach((item) => {
      if (item.rate < lowest) {
        lowest = item.rate
      } else if (item.rate > heighest) {
        heighest = item.rate
      }

      average += Number(item.rate)
    });

    return [
      {
        label: "Lowest",
        rate: lowest, 
      },
      {
        label: "Heighest",
        rate: heighest, 
      },
      {
        label: "Average",
        rate: historyData.length ? (average / historyData.length) : 0, 
      },
    ]
  }, [historyData])

  const statistics = useMemo(calculateStatistics, [calculateStatistics])
  
  return (
    <Box marginTop="20px">
      <Typography variant="h5" sx={{ fontWeight: "bold" }}>
        Exchange History
      </Typography>

      <Box marginTop="20px">
        <Autocomplete
          value={days}
          onChange={setDays}
          disableClearable
          options={['7', '14', '30']}
          getOptionLabel={(option) => `${option} days`}
          sx={{ width: 300 }}
          renderInput={(params) => (
            <TextField required variant="standard" {...params} label="From" />
          )}
          disabled={busy}
        />
      </Box>

      <Box display="flex" justifyContent="space-between" marginTop="20px">
        <TableContainer sx={{ maxHeight: "520px", width: "48%" }} component={Paper}>
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell sx={{ backgroundColor: "#fff"}}><Typography color="text.secondary">Date</Typography></TableCell>
                <TableCell sx={{ backgroundColor: "#fff"}}><Typography color="text.secondary">Exchange Rate</Typography></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {
                historyData.map((item) => {
                  return (
                    <TableRow key={item.date}>
                      <TableCell>{item.date}</TableCell>
                      <TableCell>{item.rate}</TableCell>
                    </TableRow>
                  )
                })
              }
            </TableBody>
          </Table>
        </TableContainer>

        <TableContainer sx={{ width: "48%", height: "fit-content" }} component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell><Typography color="text.secondary">Statistics</Typography></TableCell>
                <TableCell></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {
                statistics.map((item) => {
                  return (
                    <TableRow key={item.label}>
                      <TableCell>{item.label}</TableCell>
                      <TableCell>{item.rate}</TableCell>
                    </TableRow>
                  )
                })
              }
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </Box>
  )
}

export default ExchangeHistory;