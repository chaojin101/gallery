"use client";

import { backend } from "@/backend";

import { useSingleImgView } from "@/use-hooks/use-single-img-view";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";

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

  const {
    isSingleImgView,
    setIsSingleImgView,
    singleImgIndex,
    setSingleImgIndex,
    nextImg,
    prevImg,
  } = useSingleImgView({
    imgCount: q.data?.data?.data.collection.imgs.length || 0,
  });

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
                <p>{` (${singleImgIndex + 1} / ${q.data?.data?.data.collection.imgs.length}) `}</p>
              </div>

              <img
                onClick={() => setIsSingleImgView(false)}
                className="object-contain w-full h-full"
                src={q.data?.data?.data.collection.imgs[singleImgIndex].url}
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
    </>
  );
};

export default page;
