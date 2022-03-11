import { useState, useCallback, useEffect } from "react"
import { Box, Tabs, Tab, Typography } from "@mui/material"
import {
  Routes,
  Route,
  Link,
  useLocation,
} from "react-router-dom";
import { FindReplace } from "@mui/icons-material/";

import CurrencyConverter from "./CurrencyConverter";
import ConversionHistory from "./ConversionHistory";

const MainContent = (props) => {
  const location = useLocation();
  const [selectedTab, setSelectedTab] = useState(location.pathname === "/converter" ? 0 : 1);
  const updateSelectedTabCB = useCallback((_, value) => {
    setSelectedTab(value);
  }, []);

  useEffect(() => {
    setSelectedTab(location.pathname === "/history" ? 1 : 0)
  }, [location])

  return (
    <Box display="flex" flexDirection="column"  maxWidth="1080px" width="100%" margin="0 auto">
      <Box display="flex" alignItems="center" justifyContent="space-between">
        <Box display="flex" alignItems="center">
          <FindReplace color="primary"/>
          <Typography>Currency</Typography>
          <Typography sx={{ fontWeight: "bold" }}>Exchange</Typography>
          <Tabs value={selectedTab} onChange={updateSelectedTabCB} textColor="inherit">
            <Tab sx={{ fontWeight: "bold" }} label="CURRENCY CONVERTER" component={Link} to={"/converter"}/>
            <Tab sx={{ fontWeight: "bold" }} label="VIEW CONVERTION HISTORY" component={Link} to={"/history"}/>
          </Tabs>
        </Box>

        <Typography color="primary" sx={{ fontWeight: "bold" }}>LOGOUT</Typography>
      </Box>

      <Routes>
        <Route path="/" element={<CurrencyConverter />} />
        <Route path="converter" element={<CurrencyConverter />} />
        <Route path="history" element={<ConversionHistory />} />
        <Route path="*" element={<>404</>} />
      </Routes>
      
    </Box>
  )
}

export default MainContent
