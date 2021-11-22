import { useEffect } from "react";

import { IMessage, MsgURL, useMessage } from "dal/message";
import Message, { IProps as IMessageProps } from "components/Message";

export interface IProps extends Omit<IMessageProps, "msg" | "msgURL"> {
  msgURL: MsgURL;
  onSuccess?: (msg: IMessage) => void;
}

// TODO call this MessageFromUrl
export default function MessageFromPath(props: IProps) {
  const { onSuccess, ...messageProps } = props;

  const { data: msg, isLoading } = useMessage(messageProps.msgURL, {
    onSuccess: (msg) => {
      props.onSuccess?.(msg);
    },
  });

  useEffect(() => {
    if (!msg) {
      return;
    }
    // TODO wrap this into a stable ref
    props.onSuccess?.(msg);
  }, [msg]);

  return <Message msg={msg} isLoading={isLoading} {...messageProps} />;
}
