import { FC } from "react";

interface IProps {
  children: FC | string | number;
  className?: string;
  onClick: (...args: any[]) => void;
  onClickArgs?: any[];
  disabled?: boolean;
}

const defaultClassName: string =
  "px-4 sm:px-6 py-2 sm:py-3 rounded-md bg-red-700 hover:bg-red-600 text-gray-100 hover:text-white";

const SecondaryButton: FC<IProps> = ({
  className = defaultClassName,
  onClick,
  children,
  onClickArgs = [],
  disabled = false,
}) => {
  const handleClick = () => {
    onClick(...onClickArgs!);
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      className={className}
      disabled={disabled}
    >
      {children}
    </button>
  );
};

export default SecondaryButton;