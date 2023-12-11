import { Milestone } from "@/components/Envoke/types/envoke.types";
import { Post, Profile } from "../../../../graphql/generated";

export interface MakePostComment {
  content: string | undefined;
  images: {
    media: string;
    type: string;
  }[];
  videos: string[];
}

export interface Quest {
  publication: Post;
  milestones: Milestone[];
  players: Profile[];
  
}
