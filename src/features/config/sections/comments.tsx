/**
 * External dependencies.
 */
import { useMemo } from "react";
import {
  Heart,
  MessagesSquare,
  Pin,
  Plus,
  Reply,
  Trash2,
  UserPlus,
  Users,
} from "lucide-react";

/**
 * Internal dependencies.
 */
import { DateTimeField } from "@/components/common/DateTimeField";
import { Disclosure, DisclosureDot } from "@/components/common/Disclosure";
import { EmptyState } from "@/components/common/EmptyState";
import {
  FieldGrid,
  NumberField,
  SelectField,
  TextAreaField,
} from "@/components/common/fields";
import { GroupHeader, Panel } from "@/components/common/Panel";
import { PersonFields } from "@/components/common/PersonFields";
import {
  RowBody,
  RowHeader,
  SortableList,
} from "@/components/common/SortableList";
import { Toggle } from "@/components/common/Toggle";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Hint } from "@/components/ui/tooltip";
import { useListEditor } from "@/hooks";
import { createId } from "@/lib/id";
import { useSection } from "@/store";
import type { CommentNode, CommentReply, Person } from "@/types";

const newPerson = (): Person => ({
  id: createId("person"),
  name: "",
  username: "",
  avatar: null,
  verified: false,
});

const newComment = (authorId: string): CommentNode => ({
  id: createId("comment"),
  authorId,
  text: "",
  likes: 0,
  date: new Date().toISOString(),
  pinned: false,
  hearted: false,
  replies: [],
});

const newReply = (authorId: string): CommentReply => ({
  id: createId("reply"),
  authorId,
  text: "",
  likes: 0,
  date: new Date().toISOString(),
});

/** Compact author picker used in the header of a comment or reply row. */
const AuthorSelect = ({
  value,
  options,
  onChange,
  className,
}: {
  value: string;
  options: { value: string; label: string }[];
  onChange: (value: string) => void;
  className?: string;
}) => (
  <Select value={value} onValueChange={onChange}>
    <SelectTrigger
      size="sm"
      aria-label="Author"
      className={className ?? "min-w-0 max-w-44 flex-1 border-transparent bg-transparent shadow-none"}
    >
      <SelectValue placeholder="Author" />
    </SelectTrigger>
    <SelectContent>
      {options.map((option) => (
        <SelectItem key={option.value} value={option.value}>
          {option.label}
        </SelectItem>
      ))}
    </SelectContent>
  </Select>
);

export const CommentPeopleSection = () => {
  const [users, setUsers] = useSection("comments", "users");

  const participants = useListEditor(users.participants, (next) =>
    setUsers({ participants: next })
  );

  return (
    <div className="space-y-5">
      <Panel
        title="Creator"
        description="The account that owns the post. Their comments get the author badge."
      >
        <PersonFields
          person={users.creator}
          onChange={(patch) =>
            setUsers({ creator: { ...users.creator, ...patch } })
          }
        />
      </Panel>

      <section className="space-y-3">
        <GroupHeader
          title="Commenters"
          count={participants.items.length}
          description="Everyone else who can appear in the thread."
          actions={
            <Button
              size="sm"
              variant="outline"
              onClick={() => participants.add(newPerson())}
            >
              <UserPlus />
              Add person
            </Button>
          }
        />

        {participants.items.length === 0 ? (
          <EmptyState
            size="sm"
            icon={Users}
            title="No commenters yet"
            description="Add the people who reply to this post so you can assign comments to them."
            action={
              <Button size="sm" onClick={() => participants.add(newPerson())}>
                <UserPlus />
                Add the first person
              </Button>
            }
          />
        ) : (
          <ul className="space-y-2.5">
            {participants.items.map((person) => (
              <li
                key={person.id}
                className="group/row overflow-hidden rounded-xl border border-border bg-surface shadow-xs transition-colors hover:border-border-strong"
              >
                <div className="flex items-center gap-2 border-b border-border/70 bg-sunken/40 px-3.5 py-1.5">
                  <h4 className="min-w-0 flex-1 truncate text-[0.8125rem] font-medium">
                    {person.name.trim() || (
                      <span className="text-muted-foreground">
                        Unnamed person
                      </span>
                    )}
                  </h4>
                  <Hint label="Remove person">
                    <Button
                      size="icon-sm"
                      variant="destructive-ghost"
                      aria-label={`Remove ${person.name.trim() || "person"}`}
                      onClick={() => participants.remove(person.id)}
                    >
                      <Trash2 />
                    </Button>
                  </Hint>
                </div>
                <div className="p-3.5">
                  <PersonFields
                    person={person}
                    showVerified={false}
                    onChange={(patch) => participants.update(person.id, patch)}
                  />
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
};

export const CommentThreadSection = () => {
  const [users] = useSection("comments", "users");
  const [thread, setThread] = useSection("comments", "thread");

  const comments = useListEditor(thread.comments, (next) =>
    setThread({ comments: next })
  );

  const people = useMemo(
    () =>
      [users.creator, ...users.participants].map((person) => ({
        value: person.id,
        label: person.name.trim() || `@${person.username || "unnamed"}`,
      })),
    [users]
  );

  const updateReplies = (commentId: string, replies: CommentReply[]) =>
    comments.update(commentId, { replies });

  const addComment = () => comments.add(newComment(users.creator.id));

  return (
    <div className="space-y-5">
      <Panel title="Thread header">
        <FieldGrid>
          <NumberField
            label="Total comment count"
            hint="Shown in the header, independent of how many you list below."
            value={thread.totalCount}
            onChange={(totalCount) => setThread({ totalCount })}
          />
          <SelectField
            label="Sort order"
            hint="The label the platform shows above the thread."
            value={thread.sort}
            onChange={(sort) => setThread({ sort })}
            options={[
              { label: "Top comments", value: "top" },
              { label: "Newest first", value: "newest" },
            ]}
          />
        </FieldGrid>
      </Panel>

      <section className="space-y-3">
        <GroupHeader
          title="Comments"
          count={comments.items.length}
          description="Drag to reorder. Replies nest under their comment."
          actions={
            <Button size="sm" onClick={addComment}>
              <Plus />
              Add comment
            </Button>
          }
        />

        {comments.items.length === 0 ? (
          <EmptyState
            size="sm"
            icon={MessagesSquare}
            title="The thread is empty"
            description="Add a comment to populate the thread on every selected platform."
            action={
              <Button size="sm" onClick={addComment}>
                <Plus />
                Add the first comment
              </Button>
            }
          />
        ) : (
          <SortableList items={comments.items} onReorder={comments.move}>
            {(comment) => (
              <>
                <RowHeader
                  lead={
                    <AuthorSelect
                      value={comment.authorId}
                      options={people}
                      onChange={(authorId) =>
                        comments.update(comment.id, { authorId })
                      }
                    />
                  }
                  actions={
                    <>
                      <Toggle
                        pressed={comment.pinned}
                        label="Pinned by the creator"
                        icon={Pin}
                        onPressedChange={(pinned) =>
                          comments.update(comment.id, { pinned })
                        }
                      />
                      <Toggle
                        pressed={comment.hearted}
                        label="Hearted by the creator"
                        icon={Heart}
                        onPressedChange={(hearted) =>
                          comments.update(comment.id, { hearted })
                        }
                      />
                      <Hint label="Add a reply">
                        <Button
                          size="icon-sm"
                          variant="ghost"
                          aria-label="Add a reply"
                          onClick={() =>
                            updateReplies(comment.id, [
                              ...comment.replies,
                              newReply(users.creator.id),
                            ])
                          }
                        >
                          <Reply />
                        </Button>
                      </Hint>
                      <Hint label="Delete comment">
                        <Button
                          size="icon-sm"
                          variant="destructive-ghost"
                          aria-label="Delete comment"
                          onClick={() => comments.remove(comment.id)}
                        >
                          <Trash2 />
                        </Button>
                      </Hint>
                    </>
                  }
                />

                <RowBody>
                  <TextAreaField
                    label="Comment"
                    className="[&>label]:sr-only"
                    rows={2}
                    value={comment.text}
                    placeholder="Write a comment…"
                    onChange={(text) => comments.update(comment.id, { text })}
                  />

                  {comment.replies.length > 0 && (
                    <ul className="space-y-3 border-l-2 border-border pl-3">
                      {comment.replies.map((reply) => (
                        <li key={reply.id} className="group/row space-y-2">
                          <div className="flex items-center gap-1.5">
                            <AuthorSelect
                              value={reply.authorId}
                              options={people}
                              onChange={(authorId) =>
                                updateReplies(
                                  comment.id,
                                  comment.replies.map((entry) =>
                                    entry.id === reply.id
                                      ? { ...entry, authorId }
                                      : entry
                                  )
                                )
                              }
                              className="-ml-2 min-w-0 max-w-40 flex-1 border-transparent bg-transparent shadow-none"
                            />
                            <NumberField
                              label="Likes"
                              className="ml-auto w-20 [&>label]:sr-only"
                              value={reply.likes}
                              onChange={(likes) =>
                                updateReplies(
                                  comment.id,
                                  comment.replies.map((entry) =>
                                    entry.id === reply.id
                                      ? { ...entry, likes }
                                      : entry
                                  )
                                )
                              }
                            />
                            <Hint label="Delete reply">
                              <Button
                                size="icon-sm"
                                variant="destructive-ghost"
                                aria-label="Delete reply"
                                onClick={() =>
                                  updateReplies(
                                    comment.id,
                                    comment.replies.filter(
                                      (entry) => entry.id !== reply.id
                                    )
                                  )
                                }
                              >
                                <Trash2 />
                              </Button>
                            </Hint>
                          </div>
                          <TextAreaField
                            label="Reply"
                            className="[&>label]:sr-only"
                            rows={2}
                            value={reply.text}
                            placeholder="Write a reply…"
                            onChange={(text) =>
                              updateReplies(
                                comment.id,
                                comment.replies.map((entry) =>
                                  entry.id === reply.id
                                    ? { ...entry, text }
                                    : entry
                                )
                              )
                            }
                          />
                        </li>
                      ))}
                    </ul>
                  )}

                  <Disclosure
                    label="Likes and timing"
                    badge={
                      comment.likes > 0 ? (
                        <DisclosureDot title="This comment has likes" />
                      ) : undefined
                    }
                  >
                    <FieldGrid>
                      <NumberField
                        label="Likes"
                        value={comment.likes}
                        onChange={(likes) =>
                          comments.update(comment.id, { likes })
                        }
                      />
                      <DateTimeField
                        label="Posted"
                        value={comment.date}
                        onChange={(date) =>
                          comments.update(comment.id, { date })
                        }
                      />
                    </FieldGrid>
                  </Disclosure>
                </RowBody>
              </>
            )}
          </SortableList>
        )}
      </section>
    </div>
  );
};
