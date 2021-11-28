import { useEffect, useRef } from "react";
import Card from "@mui/material/Card";
import CircularProgress from "@mui/material/CircularProgress";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import { useTheme } from "@mui/material/styles";
import moment from "moment";
import DoneAllIcon from "@mui/icons-material/DoneAll";
import DoneIcon from "@mui/icons-material/Done";
import HourglassEmptyIcon from "@mui/icons-material/HourglassEmpty";
import CloudIcon from "@mui/icons-material/Cloud";
import Link from "@mui/material/Link";
import Tooltip from "@mui/material/Tooltip";

import { getIpfsPath, IMessage, MsgURL } from "dal/message";

export interface IProps {
  msg?: IMessage;
  style?: any;
  address: string;
  status: "sending" | "archiving" | "archived";
  isLoading?: boolean;
  timestamp: string;
  msgURL?: MsgURL;
  onMount?: () => void;
}

// TODO styling
export default function Message(props: IProps) {
  const isFromLocalUser = props.msg?.from === props.address;

  const theme = useTheme();

  const onMount = useRef(props.onMount);
  useEffect(() => {
    onMount?.current?.();
  }, [onMount]);

  let link;
  if (props.msgURL) {
    // TODO support more protocols
    const path = getIpfsPath(props.msgURL);
    link = `${process.env.NEXT_PUBLIC_IPFS_GATEWAY}/ipfs/${path}`;
  }

  let border: any = {
    borderBottomLeftRadius: "2px",
  };
  if (isFromLocalUser) {
    border = {
      borderBottomRightRadius: "2px",
    };
  }

  const time = moment(props.timestamp).format("HH:mm YYYY-MM-DD");

  let statusIcon = <DoneAllIcon color="success" />;
  if (props.status === "sending") {
    statusIcon = <HourglassEmptyIcon />;
  }
  if (props.status === "archiving") {
    statusIcon = <DoneIcon color="info" />;
  }

  return (
    <Card
      elevation={2}
      sx={{
        maxWidth: "500px",
        background: isFromLocalUser
          ? theme.palette.grey[900]
          : theme.palette.grey[800],
        alignSelf: isFromLocalUser ? "flex-end" : "flex-start",
        borderRadius: "20px",
        ...border,
      }}
    >
      <CardContent>
        <Stack
          direction="row"
          spacing={2}
          justifyContent="center"
          alignItems="center"
        >
          <Typography sx={{ fontSize: 14 }} color={theme.palette.grey[400]}>
            {time}{" "}
          </Typography>

          {link && (
            <Tooltip title={link}>
              <Link href={link} target="__blank" rel="noopener" sx={{lineHeight: "1px"}}>
                <CloudIcon titleAccess={`open ipfs link`} color="action"/>
              </Link>
            </Tooltip>
          )}

          <Tooltip title={props.status}>
          {statusIcon}
          </Tooltip>
        </Stack>

        <Typography variant="body1" color="inherit" sx={{ marginTop: "10px" }}>
          {props.isLoading ? <CircularProgress /> : props.msg?.content}
        </Typography>
      </CardContent>
    </Card>
  );
}
