import { tags, tagsAsStrings } from "../constants/tags.constants";

export type TagAsStrings = (typeof tagsAsStrings)[number];
export type Tag = (typeof tags)[number];
