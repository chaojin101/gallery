export class QUERY_KEY {
  static ADD_COLLECTION_CARD = "addCollectionCard";
}

export class ANIMATION {
  static keyFrames: Keyframe[] = [
    { transform: "scale(1)" },
    { transform: "scale(1.4)" },
  ];

  static options: KeyframeEffectOptions = { duration: 3000, fill: "forwards" };
}
