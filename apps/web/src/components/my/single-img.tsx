import { ANIMATION } from "@/lib/constant";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { Dispatch, SetStateAction, useRef } from "react";
import {
  FullScreen,
  FullScreenHandle,
  useFullScreenHandle,
} from "react-full-screen";
import { useEventListener } from "usehooks-ts";

type props = {
  curImgIndex: number;
  setCurImgIndex: Dispatch<SetStateAction<number>>;
  imgUrls: string[];
  handleClose: () => void;
  TopBar?: React.ReactNode;
};

export function SingleImg(props: props) {
  const getNextImgIndex = (curImgIndex: number) => {
    const nextImgIndex = curImgIndex + 1;
    if (nextImgIndex >= props.imgUrls.length) {
      return 0;
    }
    return nextImgIndex;
  };

  const getPrevImgIndex = (curImgIndex: number) => {
    const prevImgIndex = curImgIndex - 1;
    if (prevImgIndex < 0) {
      return props.imgUrls.length - 1;
    }
    return prevImgIndex;
  };

  useEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      props.handleClose();
    } else if (e.key === "ArrowRight") {
      props.setCurImgIndex((i) => getNextImgIndex(i));
    } else if (e.key === "ArrowLeft") {
      props.setCurImgIndex((i) => getPrevImgIndex(i));
    }
  });

  const fullScreenHandle = useFullScreenHandle();

  const animation = useRef(new Animation());
  const imgRef = useRef<HTMLImageElement>(document.createElement("img"));
  const isPlaying = useRef(false);

  const handlePlayBtn = async () => {
    console.debug("handlePlayBtn is called");

    await fullScreenHandle.enter();
    isPlaying.current = true;

    const runAnimation = () => {
      console.debug("runAnimation is called");

      if (isPlaying.current) {
        console.debug("call imgRef.current.animate");
        animation.current = imgRef.current.animate(
          ANIMATION.keyFrames,
          ANIMATION.options
        );

        animation.current.onfinish = () => {
          console.debug("animation.current.onfinish is called");
          props.setCurImgIndex((i) => getNextImgIndex(i));
        };
      }
    };

    runAnimation();

    imgRef.current.onload = (e) => {
      console.debug("imgRef.current.onload is called");

      runAnimation();
    };
  };

  const handleFullScreenChange = (
    isFullScreen: boolean,
    handle: FullScreenHandle
  ) => {
    if (!isFullScreen) {
      isPlaying.current = false;
      animation.current.cancel();
    }
  };

  return (
    <section>
      <div className="fixed top-0 left-0 w-full h-full flex justify-center items-center bg-black select-none">
        <div className="absolute top-0 left-0 w-full h-full flex flex-col py-2">
          <Image
            onClick={props.handleClose}
            className="object-contain w-full h-full"
            src={props.imgUrls[props.curImgIndex]}
            alt=""
            loading="lazy"
            width={300}
            height={400}
            priority={false}
          />
        </div>

        <div
          onClick={() => props.setCurImgIndex((i) => getPrevImgIndex(i))}
          className="absolute top-0 left-0 h-full w-48 text-white flex justify-center items-center cursor-pointer"
        >{`<<<`}</div>

        <div
          onClick={() => props.setCurImgIndex((i) => getNextImgIndex(i))}
          className="absolute top-0 right-0 h-full w-48 text-white flex justify-center items-center cursor-pointer"
        >{`>>>`}</div>

        <div className="absolute top-0 left-0 w-full flex flex-col">
          <div className="flex text-white items-center px-4 py-2 gap-4">
            <p>{` (${props.curImgIndex + 1} / ${props.imgUrls.length}) `}</p>
            <button onClick={handlePlayBtn}>Play</button>
            {props.TopBar}
          </div>
        </div>

        <FullScreen
          handle={fullScreenHandle}
          onChange={handleFullScreenChange}
          className="w-full h-full"
        >
          <div
            className={cn("absolute top-0 left-0 w-full h-full flex flex-col", {
              hidden: !fullScreenHandle.active,
            })}
          >
            <Image
              onClick={() => fullScreenHandle.exit()}
              className="object-contain w-full h-full"
              src={props.imgUrls[props.curImgIndex]}
              ref={imgRef}
              alt=""
              width={300}
              height={400}
              loading="lazy"
              priority={false}
            />
            <Image
              onClick={() => fullScreenHandle.exit()}
              className="hidden"
              src={props.imgUrls[getNextImgIndex(props.curImgIndex)]}
              alt=""
              width={300}
              height={400}
              loading="lazy"
              priority={false}
            />
          </div>
        </FullScreen>
      </div>
    </section>
  );
}
