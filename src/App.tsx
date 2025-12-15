import { Routes, Route } from "react-router-dom"
import { Box, Container } from "@mui/material"

import Home from "@/routes/Home"

function App() {
  return (
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <Container component="main" sx={{ flex: 1, py: 4 }}>
        <Routes>
          <Route path="/" element={<Home />} />
        </Routes>
      </Container>
    </Box>
  )
}

export default App
