import DialogTitle from "@mui/material/DialogTitle";
import Dialog from "@mui/material/Dialog";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import ListItemText from "@mui/material/ListItemText";
import { AbstractConnector } from "@web3-react/abstract-connector";
import Avatar from "@mui/material/Avatar";
import Image from "next/image";

import { useWeb3Session } from "hooks/web3";
import { injected, walletconnect } from "connectors";
import METAMASK_ICON_URL from "assets/images/metamask.png";
import WALLETCONNECT_ICON_URL from "assets/images/walletConnectIcon.svg";

export interface IProps {
  open: boolean;
  onClose: () => void;
}

export interface IOption {
  connector: AbstractConnector;
  img: any;
  description: string;
}

const OPTIONS: Array<IOption> = [
  {
    connector: injected,
    img: METAMASK_ICON_URL,
    description: "Easy-to-use browser extension.",
  },
  {
    connector: walletconnect,
    img: WALLETCONNECT_ICON_URL,
    description: "Connect to Trust Wallet, Rainbow Wallet and more...",
  },
];

export default function LoginModal(props: IProps) {
  const { activate, active, account } = useWeb3Session();

  async function onLogin(connector: AbstractConnector) {
    try {
      await activate(connector, undefined, true);
      props.onClose();
    } catch (error) {
      console.error("error login in", error);
    }
  }

  return (
    <Dialog onClose={props.onClose} open={props.open}>
      <DialogTitle>Login</DialogTitle>
      <List sx={{ pt: 0 }}>
        {OPTIONS.map((option, index) => (
          <ListItem
            button
            onClick={() => onLogin(option.connector)}
            key={index}
          >
            <ListItemAvatar>
              <Avatar
                variant="square"
                sx={
                  {
                    //bgcolor: blue[100], color: blue[600]
                  }
                }
              >
                <Image src={option.img} />
              </Avatar>
            </ListItemAvatar>
            <ListItemText primary={option.description} />
          </ListItem>
        ))}
      </List>
    </Dialog>
  );
}
