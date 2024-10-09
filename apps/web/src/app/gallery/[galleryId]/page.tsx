"use client";

import { backend } from "@/backend";
import { AddCollectionCard } from "@/components/my/add-collection-card";
import { SingleImg } from "@/components/my/single-img";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { useAuth } from "@/context/useAuth";

import { useCheckboxes } from "@/use-hooks/use-checkboxes";
import {
  SelectImgToCollectionStatus,
  useSelectImgToCollectionStepper,
} from "@/use-hooks/use-select-img-to-collection-stepper";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import { useParams } from "next/navigation";
import { useState } from "react";
import { useEventListener } from "usehooks-ts";

const Page = () => {
  const params = useParams<{ galleryId: string }>();

  const q = useQuery({
    queryKey: ["gallery", params.galleryId],
    queryFn: async () => {
      return await backend.api.v1.galleries({ id: params.galleryId }).get();
    },
  });

  const [curImgIndex, setCurImgIndex] = useState(0);
  const [isSingleImgView, setIsSingleImgView] = useState(false);

  const { checkboxes, setCheckboxes, toggleCheckbox } = useCheckboxes({
    count: q.data?.data?.data.gallery.imgs.length || 0,
  });

  const selectedImgIds = checkboxes
    .map((checked, index) =>
      checked ? q.data?.data?.data.gallery.imgs[index].id : undefined
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

  useEventListener("keydown", (e) => {
    if (
      e.key === "Enter" &&
      selectImgToCollectionStatus === SelectImgToCollectionStatus.selecting
    ) {
      toggleCheckbox(curImgIndex);
    }
  });

  const { tokenPayload } = useAuth();

  if (q.isLoading) {
    return <div>Loading...</div>;
  }

  if (q.isError) {
    return <div>Error: {q.error.message}</div>;
  }

  return (
    <>
      <div className="grid gap-2">
        <h1 className="pt-2">
          {q.data?.data?.data.gallery.name}{" "}
          {` (${q.data?.data?.data.gallery.imgs.length}) `}
        </h1>

        <section className="flex gap-2">
          {tokenPayload.email !== "" && (
            <Button onClick={toggleSelectImgToCollection}>
              Select imgs to collection
            </Button>
          )}

          {selectImgToCollectionStatus >=
            SelectImgToCollectionStatus.selecting && (
            <>
              <Button
                onClick={() =>
                  setCheckboxes(
                    new Array(q.data?.data?.data.gallery.imgs.length).fill(
                      !checkboxes[0]
                    )
                  )
                }
              >
                Select All
              </Button>
              <Button onClick={handleAddSelectedImgsToCollectionBtn}>
                Add selected imgs to collection
              </Button>
            </>
          )}
        </section>

        <section className="grid-container">
          {q.data?.data?.data.gallery.imgs.map((img, index) => (
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

              <Image
                onClick={() => {
                  setCurImgIndex(index);
                  setIsSingleImgView(true);
                }}
                className="object-cover w-full h-full"
                src={img.url}
                alt=""
                width={300}
                height={400}
                loading="lazy"
                priority={false}
              />
            </div>
          ))}
        </section>
      </div>

      {isSingleImgView && (
        <SingleImg
          curImgIndex={curImgIndex}
          setCurImgIndex={setCurImgIndex}
          imgUrls={q.data?.data?.data.gallery.imgs.map((img) => img.url) || []}
          handleClose={() => setIsSingleImgView(false)}
          TopBar={
            selectImgToCollectionStatus >=
              SelectImgToCollectionStatus.selecting && (
              <div className="w-5 h-5 flex items-center">
                <input
                  type="checkbox"
                  className=" w-full h-full"
                  checked={checkboxes[curImgIndex]}
                  onChange={() => toggleCheckbox(curImgIndex)}
                />
              </div>
            )
          }
        />
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

export default Page;
