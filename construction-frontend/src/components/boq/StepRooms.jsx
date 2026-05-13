// components/boq/StepRooms.tsx
"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Trash2, Plus } from "lucide-react";

export default function StepRooms({
  project,
  addRoom,
  updateRoom,
  removeRoom,
}) {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Rooms Configuration</h3>
        <Button onClick={addRoom} variant="outline" size="sm">
          <Plus size={16} className="mr-1" /> Add Room
        </Button>
      </div>

      <div className="space-y-4">
        {project.rooms.map((room, idx) => (
          <div key={room.id} className="border rounded-xl p-4 bg-white">
            <div className="flex justify-between mb-3">
              <span className="font-medium">Room {idx + 1}</span>
              <Button variant="ghost" size="sm" onClick={() => removeRoom(idx)}>
                <Trash2 size={16} />
              </Button>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <div>
                <Label>Type</Label>
                <Select
                  value={room.type}
                  onValueChange={(v) => updateRoom(idx, { type: v })}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Bedroom">Bedroom</SelectItem>
                    <SelectItem value="Living Room">Living Room</SelectItem>
                    <SelectItem value="Kitchen">Kitchen</SelectItem>
                    <SelectItem value="Bathroom">Bathroom</SelectItem>
                    <SelectItem value="Balcony">Balcony</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Length (ft)</Label>
                <Input
                  type="number"
                  value={room.length}
                  onChange={(e) =>
                    updateRoom(idx, { length: Number(e.target.value) })
                  }
                />
              </div>

              <div>
                <Label>Width (ft)</Label>
                <Input
                  type="number"
                  value={room.width}
                  onChange={(e) =>
                    updateRoom(idx, { width: Number(e.target.value) })
                  }
                />
              </div>

              <div>
                <Label>Flooring</Label>
                <Select
                  value={room.flooring}
                  onValueChange={(v) => updateRoom(idx, { flooring: v })}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="vitrified_tile">
                      Vitrified Tile
                    </SelectItem>
                    <SelectItem value="marble">Marble</SelectItem>
                    <SelectItem value="wooden">Wooden</SelectItem>
                    <SelectItem value="granite">Granite</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        ))}

        {project.rooms.length === 0 && (
          <p className="text-center text-slate-500 py-8">
            No rooms added yet. Click "Add Room" to begin.
          </p>
        )}
      </div>
    </div>
  );
}
