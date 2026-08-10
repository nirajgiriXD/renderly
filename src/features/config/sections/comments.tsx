/**
 * External dependencies.
 */
import { useMemo } from "react";
import { Heart, Pin, Plus, Reply, Trash2, UserPlus } from "lucide-react";

/**
 * Internal dependencies.
 */
import { DateTimeField } from "@/components/common/DateTimeField";
import {
  Field,
  FieldGrid,
  NumberField,
  SelectField,
  TextAreaField,
} from "@/components/common/fields";
import { PersonFields } from "@/components/common/PersonFields";
import { SortableList } from "@/components/common/SortableList";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Toggle } from "@/components/common/Toggle";
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

export const CommentPeopleSection = () => {
  const [users, setUsers] = useSection("comments", "users");

  const participants = useListEditor(users.participants, (next) =>
    setUsers({ participants: next })
  );

  return (
    <div className="space-y-6">
      <section className="space-y-3 rounded-xl border p-4">
        <h3 className="text-sm font-semibold">Creator</h3>
        <p className="-mt-2 text-xs text-muted-foreground">
          The account that owns the post. Their comments get the author badge.
        </p>
        <PersonFields
          person={users.creator}
          onChange={(patch) =>
            setUsers({ creator: { ...users.creator, ...patch } })
          }
        />
      </section>

      <section className="space-y-3">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-semibold">Commenters</h3>
            <Badge variant="secondary">{participants.items.length}</Badge>
          </div>
          <Button
            size="sm"
            variant="outline"
            onClick={() => participants.add(newPerson())}
          >
            <UserPlus />
            Add person
          </Button>
        </div>

        {participants.items.length === 0 ? (
          <p className="rounded-xl border border-dashed p-6 text-center text-sm text-muted-foreground">
            Add the people who reply to this post.
          </p>
        ) : (
          <ul className="space-y-4">
            {participants.items.map((person) => (
              <li key={person.id} className="space-y-3 rounded-xl border p-4">
                <div className="flex items-center justify-between gap-2">
                  <h4 className="text-sm font-medium">
                    {person.name.trim() || "Unnamed person"}
                  </h4>
                  <Button
                    size="icon"
                    variant="ghost"
                    aria-label="Remove person"
                    onClick={() => participants.remove(person.id)}
                  >
                    <Trash2 className="text-destructive" />
                  </Button>
                </div>
                <PersonFields
                  person={person}
                  showVerified={false}
                  onChange={(patch) => participants.update(person.id, patch)}
                />
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

  return (
    <div className="space-y-6">
      <FieldGrid>
        <NumberField
          label="Total comment count"
          hint="Shown in the thread header, independent of how many you list."
          value={thread.totalCount}
          onChange={(totalCount) => setThread({ totalCount })}
        />
        <SelectField
          label="Sort order"
          value={thread.sort}
          onChange={(sort) => setThread({ sort })}
          options={[
            { label: "Top comments", value: "top" },
            { label: "Newest first", value: "newest" },
          ]}
        />
      </FieldGrid>

      <section className="space-y-3">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-semibold">Comments</h3>
            <Badge variant="secondary">{comments.items.length}</Badge>
          </div>
          <Button
            size="sm"
            onClick={() => comments.add(newComment(users.creator.id))}
          >
            <Plus />
            Add comment
          </Button>
        </div>

        {comments.items.length === 0 ? (
          <p className="rounded-xl border border-dashed p-6 text-center text-sm text-muted-foreground">
            No comments yet. Add one to populate the thread.
          </p>
        ) : (
          <SortableList items={comments.items} onReorder={comments.move}>
            {(comment) => (
              <div className="space-y-4 p-4 pl-1">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <SelectField
                    label=""
                    className="min-w-40 flex-1 [&>label]:sr-only"
                    value={comment.authorId}
                    options={people}
                    onChange={(authorId) =>
                      comments.update(comment.id, { authorId })
                    }
                  />
                  <div className="flex items-center gap-1">
                    <Toggle
                      pressed={comment.pinned}
                      label="Pinned"
                      icon={Pin}
                      onPressedChange={(pinned) =>
                        comments.update(comment.id, { pinned })
                      }
                    />
                    <Toggle
                      pressed={comment.hearted}
                      label="Hearted by creator"
                      icon={Heart}
                      onPressedChange={(hearted) =>
                        comments.update(comment.id, { hearted })
                      }
                    />
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() =>
                        updateReplies(comment.id, [
                          ...comment.replies,
                          newReply(users.creator.id),
                        ])
                      }
                    >
                      <Reply />
                      Reply
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      aria-label="Delete comment"
                      onClick={() => comments.remove(comment.id)}
                    >
                      <Trash2 className="text-destructive" />
                    </Button>
                  </div>
                </div>

                <TextAreaField
                  label="Comment"
                  className="[&>label]:sr-only"
                  rows={3}
                  value={comment.text}
                  placeholder="Write a comment…"
                  onChange={(text) => comments.update(comment.id, { text })}
                />

                <FieldGrid>
                  <NumberField
                    label="Likes"
                    value={comment.likes}
                    onChange={(likes) => comments.update(comment.id, { likes })}
                  />
                  <DateTimeField
                    label="Posted"
                    value={comment.date}
                    onChange={(date) => comments.update(comment.id, { date })}
                  />
                </FieldGrid>

                {comment.replies.length > 0 && (
                  <Field label={`Replies (${comment.replies.length})`}>
                    <ul className="space-y-3 border-l-2 pl-3">
                      {comment.replies.map((reply) => (
                        <li key={reply.id} className="space-y-3">
                          <div className="flex flex-wrap items-center gap-2">
                            <SelectField
                              label=""
                              className="min-w-40 flex-1 [&>label]:sr-only"
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
                            />
                            <NumberField
                              label=""
                              className="w-24 [&>label]:sr-only"
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
                            <Button
                              size="icon"
                              variant="ghost"
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
                              <Trash2 className="text-destructive" />
                            </Button>
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
                  </Field>
                )}
              </div>
            )}
          </SortableList>
        )}
      </section>
    </div>
  );
};
