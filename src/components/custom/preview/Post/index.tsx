/**
 * Internal dependencies.
 */
import type { PostsConfig } from "@/types";
import { FacebookPost } from "./FacebookPost";
import { InstagramPost } from "./InstagramPost";
import { LinkedInPost } from "./LinkedInPost";
import { RedditPost } from "./RedditPost";
import { TiktokPost } from "./TiktokPost";
import { TwitterPost } from "./TwitterPost";

export const Post = ({ data }: { data: PostsConfig }) => {
  return (
    <div className="flex flex-col items-center gap-4 h-full w-full p-4">
      {data.apps.selectedApps.facebook && <FacebookPost data={data} />}
      {data.apps.selectedApps.instagram && <InstagramPost data={data} />}
      {data.apps.selectedApps.linkedin && <LinkedInPost data={data} />}
      {data.apps.selectedApps.reddit && <RedditPost data={data} />}
      {data.apps.selectedApps.tiktok && <TiktokPost data={data} />}
      {data.apps.selectedApps.twitter && <TwitterPost data={data} />}
    </div>
  );
};
