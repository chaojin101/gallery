import { useState } from "react";

export enum SelectImgToCollectionStatus {
  none = 0,
  selecting = 1,
  adding = 2,
}

export const useSelectImgToCollectionStepper = () => {
  const [selectImgToCollectionStatus, setSelectImgToCollectionStatus] =
    useState(SelectImgToCollectionStatus.none);

  const toggleSelectImgToCollection = () => {
    if (selectImgToCollectionStatus === SelectImgToCollectionStatus.none) {
      setSelectImgToCollectionStatus(SelectImgToCollectionStatus.selecting);
    } else {
      setSelectImgToCollectionStatus(SelectImgToCollectionStatus.none);
    }
  };

  return {
    selectImgToCollectionStatus,
    toggleSelectImgToCollection,
    setSelectImgToCollectionStatus,
  };
};
