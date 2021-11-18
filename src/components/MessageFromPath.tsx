import { IMessage, MsgURL, useMessage } from "dal/message";
import Message, { IProps as IMessageProps } from "components/Message";

export interface IProps extends Omit<IMessageProps, "msg"> {
  path: MsgURL;
  onSuccess?: (msg: IMessage) => void;
}

// TODO call this MessageFromUrl
export default function MessageFromPath(props: IProps) {
  const { data: msg, isLoading } = useMessage(props.path, {
    onSuccess: (msg) => {
      props.onSuccess?.(msg);
    },
  });

  return (
    <Message
      msg={msg}
      isLoading={isLoading}
      address={props.address}
      isArchived={props.isArchived}
    />
  );
}
