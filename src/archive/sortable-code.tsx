/**
 * External dependencies.
 */
import { GripVertical, Plus } from "lucide-react";
import { useState } from "react";

/**
 * Internal dependencies.
 */
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Sortable,
  SortableContent,
  SortableItem,
  SortableOverlay,
  SortableItemHandle,
} from "@/components/ui/sortable";

export const Users = () => {
  const [users, setUsers] = useState([
    {
      id: "1",
      name: "John Doe",
      username: "johndoe",
    },
    { id: "2", name: "Jane Smith", username: "janesmith" },
  ]);

  return (
    <div className="space-y-4 md:space-y-6">
      <div className="space-y-2">
        <Label className="text-base font-semibold">Creator / Author</Label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border p-4 rounded-md">
          <div className="space-y-2">
            <Label htmlFor="creator-name">Name</Label>
            <Input type="text" id="creator-name" placeholder="Name" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="creator-username">Username</Label>
            <Input type="text" id="creator-username" placeholder="Username" />
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between gap-2">
          <Label className="text-base font-semibold">Commenters</Label>
          <Button size="sm" className="cursor-pointer">
            <Plus />
            Add New
          </Button>
        </div>
        <Sortable
          value={users}
          onValueChange={setUsers}
          orientation="vertical"
          getItemValue={(item) => item.id}
        >
          <SortableContent className="space-y-4">
            {users.map((user) => (
              <SortableItem key={user.id} value={user.id} asChild>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border p-4 rounded-md relative">
                  <SortableItemHandle asChild>
                    <button
                      type="button"
                      aria-label="Reorder user"
                      className="absolute top-9 -left-2 text-muted-foreground hover:text-foreground"
                    >
                      <GripVertical className="h-4 w-4 cursor-grab active:cursor-grabbing" />
                    </button>
                  </SortableItemHandle>
                  <div className="space-y-2">
                    <Label htmlFor="commenter-name">Name</Label>
                    <Input
                      type="text"
                      id="commenter-name"
                      placeholder="Name"
                      value={user.name}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="commenter-username">Username</Label>
                    <Input
                      type="text"
                      id="commenter-username"
                      placeholder="Username"
                      value={user.username}
                    />
                  </div>
                </div>
              </SortableItem>
            ))}
          </SortableContent>
          <SortableOverlay>
            <div className="size-full rounded-md bg-primary/10" />
          </SortableOverlay>
        </Sortable>
      </div>
    </div>
  );
};
