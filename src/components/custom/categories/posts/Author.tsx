/**
 * Internal dependencies.
 */
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useStore } from "@/hooks";

export const Author = () => {
  const { form, handleFormChange } = useStore();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="space-y-2">
        <Label htmlFor="username" className="w-fit">
          Username
        </Label>
        <Input
          type="text"
          id="username"
          placeholder="Username"
          value={form.posts.author.username}
          onChange={(e) => handleFormChange("username", e.target.value)}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="display-name" className="w-fit">
          Display Name
        </Label>
        <Input
          type="text"
          id="display-name"
          placeholder="Display Name"
          value={form.posts.author.name}
          onChange={(e) => handleFormChange("name", e.target.value)}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="job-title" className="w-fit">
          Job Title
        </Label>
        <Input
          type="text"
          id="job-title"
          placeholder="Job Title"
          value={form.posts.author.jobTitle}
          onChange={(e) => handleFormChange("jobTitle", e.target.value)}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="verified-badge" className="w-fit">
          Verified Badge
        </Label>
        <Select
          value={form.posts.author.verificationStatus}
          onValueChange={(value) =>
            handleFormChange("verificationStatus", value)
          }
        >
          <SelectTrigger className="w-full" id="verified-badge">
            <SelectValue placeholder="Badge" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="verified">Verified</SelectItem>
            <SelectItem value="unverified">Unverified</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-2">
        <Label htmlFor="profile-picture" className="w-fit">
          Profile Picture
        </Label>
        <Input
          type="file"
          accept="image/*"
          id="profile-picture"
          placeholder="Select an image"
          onChange={(e) =>
            handleFormChange(
              "profilePicture",
              e.target.files ? e.target.files[0] : null
            )
          }
        />
      </div>
    </div>
  );
};
