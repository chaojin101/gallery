"use client";

import { backend } from "@/backend";
import { SingleImg } from "@/components/my/single-img";

import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import { useState } from "react";

const page = () => {
  const params = useParams<{ collectionId: string }>();

  const q = useQuery({
    queryKey: ["collection/id", params.collectionId],
    queryFn: async () => {
      return await backend.api.v1
        .collections({ id: params.collectionId })
        .get();
    },
  });

  const [curImgIndex, setCurImgIndex] = useState(0);
  const [isSingleImgView, setIsSingleImgView] = useState(false);

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
          {q.data?.data?.data.collection.name}{" "}
          {` (${q.data?.data?.data.collection.imgs.length}) `}
        </h1>

        <section className="grid-container">
          {q.data?.data?.data.collection.imgs.map((img, index) => (
            <div
              key={img.id}
              className="relative aspect-[3/4] cursor-pointer  hover:scale-[1.01] transition-all"
            >
              <img
                onClick={() => {
                  setCurImgIndex(index);
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
        <SingleImg
          curImgIndex={curImgIndex}
          setCurImgIndex={setCurImgIndex}
          imgUrls={
            q.data?.data?.data.collection.imgs.map((img) => img.url) || []
          }
          handleClose={() => setIsSingleImgView(false)}
        />
      )}
    </>
  );
};

export default page;
