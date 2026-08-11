/**
 * Internal dependencies.
 */
import { DateTimeField } from "@/components/common/DateTimeField";
import {
  FieldGrid,
  NumberField,
  TextAreaField,
  TextField,
} from "@/components/common/fields";
import { MediaField } from "@/components/common/MediaField";
import { Panel } from "@/components/common/Panel";
import { PersonFields } from "@/components/common/PersonFields";
import { useSection } from "@/store";

export const PostAuthorSection = () => {
  const [author, setAuthor] = useSection("posts", "author");

  return (
    <Panel
      title="Identity"
      description="Shown at the top of the post on every platform."
    >
      <PersonFields
        person={author}
        onChange={setAuthor}
        extra={
          <>
            <TextField
              label="Headline"
              hint="Used by LinkedIn; ignored by networks with no headline."
              value={author.jobTitle}
              placeholder="Mathematician · Analytical engines"
              onChange={(jobTitle) => setAuthor({ jobTitle })}
            />
            <NumberField
              label="Followers"
              hint="Shown by LinkedIn and TikTok."
              value={author.followers}
              onChange={(followers) => setAuthor({ followers })}
            />
          </>
        }
      />
    </Panel>
  );
};

export const PostContentSection = () => {
  const [content, setContent] = useSection("posts", "content");

  return (
    <div className="space-y-4">
      <Panel title="The post">
        <TextAreaField
          label="Caption"
          hint="Hashtags, @mentions and links are highlighted automatically."
          rows={6}
          value={content.caption}
          placeholder="What do you want to say?"
          onChange={(caption) => setContent({ caption })}
        />

        <MediaField
          label="Media"
          hint="Images and video. Several attachments tile the way each feed does."
          value={content.media}
          max={10}
          onChange={(media) => setContent({ media })}
        />
      </Panel>

      <Panel
        title="Platform extras"
        description="Only used by the platforms that have these fields; the rest ignore them."
      >
        <FieldGrid>
          <TextField
            label="Title"
            hint="Reddit only. Falls back to the caption's first line."
            value={content.title}
            placeholder="Post title"
            onChange={(title) => setContent({ title })}
          />
          <TextField
            label="Subreddit"
            hint="Reddit only."
            prefix="r/"
            value={content.subreddit}
            placeholder="programming"
            onChange={(subreddit) => setContent({ subreddit })}
          />
        </FieldGrid>

        <TextField
          label="Sound"
          hint="TikTok only. Shown on the sound row above the action rail."
          value={content.soundName}
          placeholder="original sound - adalovelace"
          onChange={(soundName) => setContent({ soundName })}
        />
      </Panel>
    </div>
  );
};

export const PostMetricsSection = () => {
  const [metrics, setMetrics] = useSection("posts", "metrics");

  return (
    <div className="space-y-4">
      <Panel
        title="Engagement"
        description="Each platform shows the counts it actually has."
      >
        <FieldGrid>
          <NumberField
            label="Reactions"
            hint="Likes, upvotes or reactions."
            value={metrics.reactions}
            onChange={(reactions) => setMetrics({ reactions })}
          />
          <NumberField
            label="Comments"
            value={metrics.comments}
            onChange={(comments) => setMetrics({ comments })}
          />
          <NumberField
            label="Reposts"
            hint="Shares, retweets or reposts."
            value={metrics.reposts}
            onChange={(reposts) => setMetrics({ reposts })}
          />
          <NumberField
            label="Views"
            value={metrics.views}
            onChange={(views) => setMetrics({ views })}
          />
          <NumberField
            label="Saves"
            hint="Bookmarks on X, favourites on TikTok."
            value={metrics.bookmarks}
            onChange={(bookmarks) => setMetrics({ bookmarks })}
          />
        </FieldGrid>
      </Panel>

      <Panel title="Timing">
        <DateTimeField
          label="Published"
          hint="Drives the relative timestamp. Leave empty to show it as just now."
          value={metrics.date}
          onChange={(date) => setMetrics({ date })}
        />
      </Panel>
    </div>
  );
};
