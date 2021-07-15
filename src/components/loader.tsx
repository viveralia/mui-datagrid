import { Box, CircularProgress } from "@material-ui/core";
import { FC } from "react";

export const Loader: FC = () => {
  return (
    <Box
      bgcolor="#eee"
      width="100%"
      height="100vh"
      display="flex"
      alignItems="center"
      justifyContent="center"
    >
      <CircularProgress color="primary" size="2rem" />
    </Box>
  );
};
