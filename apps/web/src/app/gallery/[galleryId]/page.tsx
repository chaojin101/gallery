"use client";

import { backend } from "@/backend";
import NewCollectionFormBtn from "@/components/my/new-collection-form";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { useCheckboxes } from "@/use-hooks/use-checkboxes";
import {
  SelectImgToCollectionStatus,
  useSelectImgToCollectionStepper,
} from "@/use-hooks/use-select-img-to-collection-stepper";
import { useSingleImgView } from "@/use-hooks/use-single-img-view";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";

const page = () => {
  const params = useParams<{ galleryId: string }>();

  const q = useQuery({
    queryKey: ["gallery", params.galleryId],
    queryFn: async () => {
      return await backend.api.v1
        .galleries({ id: params.galleryId })
        .get({ query: { page: 1, limit: 100 } });
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

  const {
    selectImgToCollectionStatus,
    toggleSelectImgToCollection,
    setSelectImgToCollectionStatus,
  } = useSelectImgToCollectionStepper();

  if (q.isLoading) {
    return <div>Loading...</div>;
  }

  if (q.isError) {
    return <div>Error: {q.error.message}</div>;
  }

  return (
    <>
      <div className="grid gap-2">
        <h1 className="pt-2">{q.data?.data?.gallery.name}</h1>

        <section className="flex gap-2">
          <Button onClick={toggleSelectImgToCollection}>
            Select imgs to collection
          </Button>
          {selectImgToCollectionStatus >=
            SelectImgToCollectionStatus.selecting && (
            <Button
              onClick={() =>
                setSelectImgToCollectionStatus(
                  SelectImgToCollectionStatus.adding
                )
              }
            >
              Add selected imgs to collection
            </Button>
          )}
        </section>

        <section className="grid-container">
          {q.data?.data?.imgs.map((img, index) => (
            <div
              key={img.id}
              className="relative aspect-[3/4] cursor-pointer  hover:scale-[1.05] transition-all"
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
            <img
              onClick={() => setIsSingleImgView(false)}
              className="object-contain w-full h-full"
              src={q.data?.data?.imgs[singleImgIndex].url}
              alt=""
              loading="lazy"
            />
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
            <Card
              className="max-w-[600px]"
              onClick={(e) => e.stopPropagation()}
            >
              <CardHeader>
                <CardTitle>Collections</CardTitle>
              </CardHeader>
              <CardContent>
                <NewCollectionFormBtn />
              </CardContent>
            </Card>
          </div>
        </section>
      )}
    </>
  );
};

export default page;
