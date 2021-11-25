import useENSName from "hooks/useENSName";

export interface IProps {
  address: string;

  onClick: () => void;
  isSelected?: boolean;
}

export default function ConvoItem(props: IProps) {
  const ENSName = useENSName(props.address);

  return (
    <div
      key={props.address}
      className="contact__item"
      onClick={props.onClick}
      style={{
        background: props.isSelected ? "grey" : "white",
      }}
    >
      <div>{props.address}</div>
      {ENSName && <div>{ENSName}</div>}
    </div>
  );
}
