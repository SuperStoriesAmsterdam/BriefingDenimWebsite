import { useState } from "react";
import type { TeamMember } from "@/lib/team-members";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { X, Plus } from "lucide-react";

interface TeamManagerProps {
  members: TeamMember[];
  onChange: (members: TeamMember[]) => void;
}

export function TeamManager({ members, onChange }: TeamManagerProps) {
  const [newName, setNewName] = useState("");
  const [newRole, setNewRole] = useState("");

  const add = () => {
    const name = newName.trim();
    if (!name) return;
    if (members.some((m) => m.name === name)) return;
    onChange([...members, { name, role: newRole.trim() }]);
    setNewName("");
    setNewRole("");
  };

  const remove = (index: number) => {
    onChange(members.filter((_, i) => i !== index));
  };

  return (
    <div className="p-5">
      <h2 className="text-lg font-bold text-foreground mb-1">Team Members</h2>
      <p className="text-sm text-muted-foreground mb-4">
        Add your team here. Names are visible on annotations. Roles are only visible on this page.
      </p>

      {/* Existing members */}
      <div className="space-y-2 mb-4">
        {members.map((m, i) => (
          <div key={i} className="flex items-center gap-2 rounded-lg border bg-white px-3 py-2">
            <span className="text-sm font-medium text-foreground flex-1">{m.name}</span>
            {m.role && (
              <span className="text-xs text-muted-foreground bg-muted rounded px-2 py-0.5">{m.role}</span>
            )}
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 text-muted-foreground/40 hover:text-destructive"
              onClick={() => remove(i)}
            >
              <X className="h-3.5 w-3.5" />
            </Button>
          </div>
        ))}
        {members.length === 0 && (
          <div className="rounded-lg border-2 border-dashed border-muted-foreground/20 py-8 text-center text-sm text-muted-foreground">
            No team members yet. Add someone below.
          </div>
        )}
      </div>

      {/* Add form */}
      <form
        onSubmit={(e) => { e.preventDefault(); add(); }}
        className="flex items-center gap-2"
      >
        <Input
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          placeholder="Name"
          className="flex-1"
        />
        <Input
          value={newRole}
          onChange={(e) => setNewRole(e.target.value)}
          placeholder="Role (optional, internal only)"
          className="flex-1"
        />
        <Button type="submit" disabled={!newName.trim()} size="sm">
          <Plus className="h-4 w-4 mr-1" />
          Add
        </Button>
      </form>
    </div>
  );
}
