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

export const Author = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="space-y-2">
        <Label htmlFor="username" className="w-fit">
          Username
        </Label>
        <Input type="text" id="username" placeholder="Username" />
      </div>
      <div className="space-y-2">
        <Label htmlFor="display-name" className="w-fit">
          Display Name
        </Label>
        <Input type="text" id="display-name" placeholder="Display Name" />
      </div>
      <div className="space-y-2">
        <Label htmlFor="job-title" className="w-fit">
          Job Title
        </Label>
        <Input type="text" id="job-title" placeholder="Job Title" />
      </div>
      <div className="space-y-2">
        <Label htmlFor="verified-badge" className="w-fit">
          Verified Badge
        </Label>
        <Select defaultValue="unverified">
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
        <Label htmlFor="profile-image" className="w-fit">
          Profile Image
        </Label>
        <Input
          type="file"
          accept="image/*"
          id="profile-image"
          placeholder="Select an image"
        />
      </div>
    </div>
  );
};
