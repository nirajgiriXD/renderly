/**
 * Internal dependencies.
 */
import { AvatarField } from "./AvatarField";
import { Field, FieldGrid, SwitchField, TextField } from "./fields";
import type { Person } from "@/types";

/**
 * Name / handle / avatar / verified — the identity block reused by post
 * authors, comment participants and chat members.
 */
export const PersonFields = ({
  person,
  onChange,
  namePlaceholder = "Ada Lovelace",
  handlePlaceholder = "adalovelace",
  showVerified = true,
  extra,
}: {
  person: Person;
  onChange: (patch: Partial<Person>) => void;
  namePlaceholder?: string;
  handlePlaceholder?: string;
  showVerified?: boolean;
  /** Category-specific fields rendered inside the same grid. */
  extra?: React.ReactNode;
}) => (
  <div className="space-y-4">
    <Field label="Profile picture">
      <AvatarField
        value={person.avatar}
        name={person.name}
        onChange={(avatar) => onChange({ avatar })}
      />
    </Field>

    <FieldGrid>
      <TextField
        label="Display name"
        value={person.name}
        placeholder={namePlaceholder}
        onChange={(name) => onChange({ name })}
      />
      <TextField
        label="Username"
        prefix="@"
        value={person.username}
        placeholder={handlePlaceholder}
        onChange={(username) => onChange({ username })}
      />
      {extra}
    </FieldGrid>

    {showVerified && (
      <SwitchField
        label="Verified badge"
        hint="Shows the platform's verification mark next to the name."
        checked={person.verified}
        onChange={(verified) => onChange({ verified })}
      />
    )}
  </div>
);
