import { useEffect, useState } from "react";

type Props = {
  count: number;
};

export const useCheckboxes = ({ count }: Props) => {
  const [checkboxes, setCheckboxes] = useState<boolean[]>(
    new Array<boolean>(count).fill(false)
  );

  useEffect(() => {
    setCheckboxes(new Array<boolean>(count).fill(false));
  }, [count]);

  const toggleCheckbox = (index: number) => {
    const newCheckboxes = [...checkboxes];
    newCheckboxes[index] = !newCheckboxes[index];
    setCheckboxes(newCheckboxes);
  };

  return { checkboxes, toggleCheckbox };
};
