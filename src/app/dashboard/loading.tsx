import { Box, CircularProgress } from '@mui/material'
import React from 'react'

const loading = () => {
  return (
      <Box
          sx={{
              maxWidth: "var(--Content-maxWidth)",
              m: "var(--Content-margin)",
              p: "var(--Content-padding)",
              width: "var(--Content-width)",
          }}
      >
        <CircularProgress />
      </Box>
  )
}

export default loading