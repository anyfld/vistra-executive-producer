import { Box, Grid, Button } from "@mui/material"

export default function Home() {
  return (
    <Box>
      <Grid container spacing={2}>
        <Grid size={12}>
          <h1>Home</h1>
          <p>This is the home page</p>
          <Button variant="contained" color="primary">
            Click me
          </Button>
        </Grid>
      </Grid>
    </Box>
  )
}
