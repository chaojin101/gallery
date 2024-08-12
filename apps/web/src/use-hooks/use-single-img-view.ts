import { useState } from "react";

type Props = {
  imgCount: number;
};

export const useSingleImgView = ({ imgCount }: Props) => {
  const [isSingleImgView, setIsSingleImgView] = useState(false);
  const [singleImgIndex, setSingleImgIndex] = useState(0);

  const nextImg = () => {
    if (singleImgIndex < imgCount - 1) {
      setSingleImgIndex(singleImgIndex + 1);
    } else {
      setSingleImgIndex(0);
    }
  };

  const prevImg = () => {
    if (singleImgIndex > 0) {
      setSingleImgIndex(singleImgIndex - 1);
    } else {
      setSingleImgIndex(imgCount - 1);
    }
  };

  return {
    isSingleImgView,
    setIsSingleImgView,
    singleImgIndex,
    setSingleImgIndex,
    nextImg,
    prevImg,
  };
};
