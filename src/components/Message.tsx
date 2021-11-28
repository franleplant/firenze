import { useEffect, useRef } from "react";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";

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
    borderBottomLeftRadius: "5px",
  };
  if (isFromLocalUser) {
    border = {
      borderBottomRightRadius: "5px",
    };
  }

  return (
    <Card
      elevation={24}
      sx={{
        maxWidth: "500px",
        // TODO use theme
        background: isFromLocalUser ? "#3b3232" : "#454545",
        alignSelf: isFromLocalUser ? "flex-end" : "flex-start",
        borderRadius: "20px",
        ...border,
      }}
    >
      <CardContent>
        <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
          {props.timestamp}
          {` ${props.status}`}
        </Typography>
        {link && (
          <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
            <a href={link} target="__blank">
              ipfs: ...{link.slice(-10)}
            </a>
          </Typography>
        )}

        <Typography variant="body2">
          {props.isLoading ? "Loading..." : props.msg?.content}
        </Typography>
      </CardContent>
    </Card>
  );
}
