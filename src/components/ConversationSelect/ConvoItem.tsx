import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import Avatar from "@mui/material/Avatar";
import Typography from "@mui/material/Typography";

import useENSName from "hooks/useENSName";

export interface IProps {
  address: string;

  onClick: () => void;
  isSelected?: boolean;
}

export default function ConvoItem(props: IProps) {
  const { address } = props;
  const ENSName = useENSName(props.address);

  const shortAddress = `${address.slice(0, 6)}...${address.slice(-20)}`;

  return (
    <ListItem
      alignItems="flex-start"
      selected={props.isSelected}
      onClick={props.onClick}
    >
      <ListItemAvatar>
        <Avatar
          alt={ENSName || props.address}
          src="/static/images/avatar/1.jpg"
        />
      </ListItemAvatar>
      <ListItemText
        primary={ENSName || shortAddress}
        primaryTypographyProps={{
          color: "text.primary",
        }}
        secondary={
          <>
            <Typography
              sx={{ display: "inline" }}
              component="span"
              variant="body2"
              color="text.primary"
            >
              {ENSName ? shortAddress : ""}
            </Typography>
            {/*
                {" — I'll be in your neighborhood doing errands this…"}
                  */}
          </>
        }
      />
    </ListItem>
  );
}
