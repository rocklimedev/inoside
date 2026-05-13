"use client";

import { Plus, Trash2, ChevronRight, ChevronDown } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export function BoqTreeView({
  sections,
  onAddSection,
  onAddSubheading,
  onEditItem,
  onDeleteItem,
}) {
  const [expandedSections, setExpandedSections] = useState(new Set());

  const toggleSection = (id) => {
    const newSet = new Set(expandedSections);
    if (newSet.has(id)) newSet.delete(id);
    else newSet.add(id);
    setExpandedSections(newSet);
  };

  return (
    <Card className="p-4 h-fit sticky top-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold">BOQ Structure</h3>
        <Button size="sm" onClick={onAddSection}>
          <Plus className="h-4 w-4 mr-1" /> Section
        </Button>
      </div>

      <div className="space-y-2">
        {sections.length === 0 && (
          <div className="text-center py-8 text-muted-foreground text-sm">
            No sections yet. Add your first section.
          </div>
        )}

        {sections.map((section, sIndex) => {
          const isExpanded = expandedSections.has(section.id || section.title);
          return (
            <div
              key={section.id || sIndex}
              className="border rounded-lg overflow-hidden"
            >
              <div
                className="flex items-center justify-between bg-muted/50 px-3 py-2 cursor-pointer hover:bg-muted"
                onClick={() => toggleSection(section.id || section.title)}
              >
                <div className="flex items-center gap-2 font-medium">
                  {isExpanded ? (
                    <ChevronDown size={16} />
                  ) : (
                    <ChevronRight size={16} />
                  )}
                  {section.title}
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    onAddSubheading(section.id || section.title);
                  }}
                >
                  <Plus size={14} />
                </Button>
              </div>

              {isExpanded && (
                <div className="pl-6 pr-3 py-2 space-y-3">
                  {section.subheadings.map((sub, shIndex) => (
                    <div
                      key={sub.id || shIndex}
                      className="border-l-2 border-border pl-4"
                    >
                      <div className="font-medium text-sm mb-2 flex items-center justify-between">
                        {sub.title}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() =>
                            onAddSubheading(section.id || section.title)
                          } // Reuse for simplicity or make separate
                        >
                          <Plus size={14} />
                        </Button>
                      </div>

                      <div className="space-y-1">
                        {sub.items.map((item, iIndex) => (
                          <div
                            key={item.id || iIndex}
                            className="flex items-center justify-between bg-white border rounded p-2 text-sm group hover:border-primary/50"
                          >
                            <div
                              className="cursor-pointer flex-1 truncate"
                              onClick={() =>
                                onEditItem(
                                  section.id || section.title,
                                  sub.id || sub.title,
                                  item,
                                )
                              }
                            >
                              {item.item_name}
                            </div>
                            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() =>
                                  onEditItem(
                                    section.id || section.title,
                                    sub.id || sub.title,
                                    item,
                                  )
                                }
                              >
                                <Edit3 size={14} />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="text-destructive"
                                onClick={() =>
                                  onDeleteItem(
                                    section.id || section.title,
                                    sub.id || sub.title,
                                    item.id,
                                  )
                                }
                              >
                                <Trash2 size={14} />
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </Card>
  );
}
