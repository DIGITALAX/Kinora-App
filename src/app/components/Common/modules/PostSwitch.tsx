import {
  ArticleMetadata,
  ImageMetadata,
  Post,
  StoryMetadata,
  TextOnlyMetadata,
} from "@lens-protocol/client";
import { FunctionComponent, JSX } from "react";
import { PostSwitchProps } from "../types/common.types";
import Text from "./Text";
import Media from "./Media";

const PostSwitch: FunctionComponent<PostSwitchProps> = ({
  item,
  disabled,
}): JSX.Element => {
  switch (
    item?.__typename === "Repost"
      ? item?.repostOf?.metadata?.__typename
      : (item as Post)?.metadata?.__typename
  ) {
    case "ArticleMetadata":
    case "TextOnlyMetadata":
    case "StoryMetadata":
      return (
        <Text
          metadata={
            (item?.__typename === "Repost"
              ? item?.repostOf?.metadata
              : (item as Post)?.metadata) as
              | ArticleMetadata
              | StoryMetadata
              | TextOnlyMetadata
          }
          disabled={disabled!}
        />
      );

    default:
      return (
        <Media
          metadata={
            (item?.__typename === "Repost"
              ? item?.repostOf?.metadata
              : (item as Post)?.metadata) as ImageMetadata
          }
          disabled={disabled}
          postId={
            item?.__typename === "Repost"
              ? item?.repostOf?.id
              : (item as Post)?.id
          }
        />
      );
  }
};

export default PostSwitch;
