import Container from "@mui/material/Container";
import Paper from "@mui/material/Paper";

import Header from "components/Header";

export default function Layout({ children }: { children: JSX.Element }) {
  return (
    <div className="layout-container">
      <Header />

      <Container
        maxWidth="xl"
        classes={{ root: "layout-container__main" }}
        disableGutters
      >
        <Paper sx={{ height: "100%" }} elevation={0}>
          {children}
        </Paper>
      </Container>
    </div>
  );
}
