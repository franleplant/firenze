import CircularProgress from "@mui/material/CircularProgress";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";

import { useIpfs } from "components/IPFS";
import { useSelfID } from "components/SelfID";
import { useWeb3Session } from "hooks/web3";

export default function Landing({
  children,
}: {
  children: JSX.Element | null;
}) {
  const { selfID } = useSelfID();
  const { ipfs } = useIpfs();
  const { account } = useWeb3Session();

  if (!ipfs || !account || !selfID) {
    let ipfsStatus = null;
    if (!ipfs) {
      ipfsStatus = (
        <p>Something went terribly wrong with IPFS, please try again.</p>
      );
    }

    let selfIDStatus = null;
    if (!selfID) {
      selfIDStatus = (
        <>
          <Typography
            variant="body1"
            color="textPrimary"
            textAlign="center"
            gutterBottom
          >
            Connecting to your Ceramic profile, also called 3ID Connect. Follow
            the instructions on screen.
          </Typography>
          <Container sx={{ textAlign: "center" }}>
            <CircularProgress />
          </Container>
          <Typography
            variant="body1"
            color="textPrimary"
            textAlign="center"
            gutterBottom
          >
            If this is your first time you might need to create a new profile,
            but do not worry, the process is super easy.
          </Typography>
        </>
      );
    }

    return (
      <Container sx={{ paddingTop: "20px" }}>
        <Typography
          variant="h2"
          color="textPrimary"
          textAlign="center"
          gutterBottom
        >
          Welcome to Firenze
        </Typography>
        <Typography
          variant="h4"
          color="textPrimary"
          textAlign="center"
          gutterBottom
        >
          An open communication tool for the web3
        </Typography>
        {ipfsStatus}
        {selfIDStatus}
      </Container>
    );
  }

  return children;
}
