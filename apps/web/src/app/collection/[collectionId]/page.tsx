"use client";

import { backend } from "@/backend";
import { AddCollectionCard } from "@/components/my/add-collection-card";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";

import { useCheckboxes } from "@/use-hooks/use-checkboxes";
import {
  SelectImgToCollectionStatus,
  useSelectImgToCollectionStepper,
} from "@/use-hooks/use-select-img-to-collection-stepper";
import { useSingleImgView } from "@/use-hooks/use-single-img-view";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";

const page = () => {
  const params = useParams<{ collectionId: string }>();

  const q = useQuery({
    queryKey: ["collection/id", params.collectionId],
    queryFn: async () => {
      return await backend.api.v1.galleries({ id: params.collectionId }).get();
    },
  });

  const {
    isSingleImgView,
    setIsSingleImgView,
    singleImgIndex,
    setSingleImgIndex,
    nextImg,
    prevImg,
  } = useSingleImgView({ imgCount: q.data?.data?.imgs.length || 0 });

  const { checkboxes, toggleCheckbox } = useCheckboxes({
    count: q.data?.data?.imgs.length || 0,
  });

  const selectedImgIds = checkboxes
    .map((checked, index) =>
      checked ? q.data?.data?.imgs[index].id : undefined
    )
    .filter((id) => id !== undefined);

  const {
    selectImgToCollectionStatus,
    toggleSelectImgToCollection,
    setSelectImgToCollectionStatus,
  } = useSelectImgToCollectionStepper();

  const handleAddSelectedImgsToCollectionBtn = async () => {
    if (selectedImgIds.length === 0) {
      toast({ title: "Please select at least one image" });
      return;
    }

    setSelectImgToCollectionStatus(SelectImgToCollectionStatus.adding);
  };

  if (q.isLoading) {
    return <div>Loading...</div>;
  }

  if (q.isError) {
    return <div>Error: {q.error.message}</div>;
  }

  return (
    <>
      <div className="grid gap-2">
        <div>{checkboxes.length}</div>

        <h1 className="pt-2">
          {q.data?.data?.gallery.name} {` (${q.data?.data?.imgs.length}) `}
        </h1>

        <section className="flex gap-2">
          <Button onClick={toggleSelectImgToCollection}>
            Select imgs to collection
          </Button>
          {selectImgToCollectionStatus >=
            SelectImgToCollectionStatus.selecting && (
            <Button onClick={handleAddSelectedImgsToCollectionBtn}>
              Add selected imgs to collection
            </Button>
          )}
        </section>

        <section className="grid-container">
          {q.data?.data?.imgs.map((img, index) => (
            <div
              key={img.id}
              className="relative aspect-[3/4] cursor-pointer  hover:scale-[1.01] transition-all"
            >
              {selectImgToCollectionStatus >=
                SelectImgToCollectionStatus.selecting && (
                <div className="absolute top-0 left-0 w-5 h-5 flex items-center justify-center">
                  <input
                    type="checkbox"
                    className=" w-full h-full"
                    checked={checkboxes[index]}
                    onChange={() => toggleCheckbox(index)}
                  />
                </div>
              )}

              <img
                onClick={() => {
                  setSingleImgIndex(index);
                  setIsSingleImgView(true);
                }}
                className="object-cover w-full h-full"
                src={img.url}
                alt=""
                loading="lazy"
              />
            </div>
          ))}
        </section>
      </div>

      {isSingleImgView && (
        <section>
          <div className="fixed top-0 left-0 w-full h-full flex justify-center items-center bg-black select-none">
            <div className="flex flex-col w-full h-full">
              <div className=" text-white">
                <p>{` (${singleImgIndex + 1} / ${q.data?.data?.imgs.length}) `}</p>
              </div>

              <img
                onClick={() => setIsSingleImgView(false)}
                className="object-contain w-full h-full"
                src={q.data?.data?.imgs[singleImgIndex].url}
                alt=""
                loading="lazy"
              />
            </div>

            <div
              onClick={prevImg}
              className="absolute top-0 left-0 h-full w-48 text-white flex justify-center items-center cursor-pointer"
            >{`<<<`}</div>

            <div
              onClick={nextImg}
              className="absolute top-0 right-0 h-full w-48 text-white flex justify-center items-center cursor-pointer"
            >{`>>>`}</div>
          </div>
        </section>
      )}

      {selectImgToCollectionStatus === SelectImgToCollectionStatus.adding && (
        <section>
          <div
            onClick={() =>
              setSelectImgToCollectionStatus(
                SelectImgToCollectionStatus.selecting
              )
            }
            className="fixed top-0 left-0 w-full h-full flex justify-center items-center bg-black bg-opacity-50 select-none"
          >
            <AddCollectionCard selectedImgIds={selectedImgIds} />
          </div>
        </section>
      )}
    </>
  );
};

export default page;
