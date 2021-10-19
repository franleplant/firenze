import { FC, useState } from "react";

interface IProps {
  children: FC | string | number;
  className?: string;
  onClick: (...args: any[]) => void;
  onClickArgs?: any[];
  disabled?: boolean;
  helpText?: string;
  helpTextClassName?: string;
}

const defaultClassName: string =
  "relative px-4 sm:px-6 py-2 sm:py-3 rounded-md bg-blue-700 hover:bg-blue-600 text-gray-100 hover:text-white";

const PrimaryButton: FC<IProps> = ({
  className = defaultClassName,
  onClick,
  children,
  onClickArgs = [],
  disabled = false,
  helpText,
  helpTextClassName = "absolute py-2 px-4 rounded-2xl bg-gray-500 text-white z-10 top-14 shadow-xl",
}) => {
  const [hover, setHover] = useState<boolean>(false);

  const onHover = () => {
    setHover(true);
  };

  const onLeave = () => {
    setHover(false);
  };

  const handleClick = () => {
    onClick(...onClickArgs!);
  };

  return (
    <section className="relative flex justify-center m-auto">
      {helpText && hover && <div className={helpTextClassName}>{helpText}</div>}

      <button
        type="button"
        onClick={handleClick}
        className={className}
        disabled={disabled}
        onMouseEnter={onHover}
        onMouseLeave={onLeave}
      >
        {children}
      </button>
    </section>
  );
};

export default PrimaryButton;
