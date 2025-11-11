"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Plus, Trash2, Save, Download } from "lucide-react";
import { useHotkeys } from "react-hotkeys-hook";
import { format } from "date-fns";

interface Item {
  id: string;
  itemNo: string;
  description: string;
  unit: string;
  quantity: number;
  rate: number;
  amount: number;
}

interface Section {
  id: string;
  name: string;
  items: Item[];
  subtotal: number;
}

type UnitType =
  | "sqft"
  | "percentage"
  | "nos"
  | "rm"
  | "kg"
  | "lumpsum"
  | "m3"
  | "m";

const unitOptions: { value: UnitType; label: string }[] = [
  { value: "sqft", label: "Sq.Ft" },
  { value: "percentage", label: "%" },
  { value: "nos", label: "Nos" },
  { value: "rm", label: "R.M" },
  { value: "kg", label: "Kg" },
  { value: "lumpsum", label: "Lumpsum" },
  { value: "m3", label: "Cu.M" },
  { value: "m", label: "M" },
];

const sectionsData = [
  { id: "civil", name: "CIVIL WORK", css: "civil" },
  { id: "mechanical", name: "MECHANICAL WORK", css: "mechanical" },
  { id: "electrical", name: "ELECTRICAL WORK", css: "electrical" },
  { id: "plumbing", name: "PLUMBING WORK", css: "plumbing" },
  { id: "paint", name: "PAINT WORK", css: "paint" },
  { id: "finishing", name: "FINISHING WORK", css: "finishing" },
];

export default function BOQCalculator() {
  const [sections, setSections] = useState<Record<string, Section>>({});
  const [activeSection, setActiveSection] = useState<string>("civil");
  const [projectName, setProjectName] = useState("New Project");
  const [clientName, setClientName] = useState("");
  const [projectArea, setProjectArea] = useState(0);

  /* ---------- Persistence ---------- */
  useEffect(() => {
    const saved = localStorage.getItem("boq-calculator");
    if (saved) {
      const parsed = JSON.parse(saved);
      setSections(parsed.sections ?? {});
      setProjectName(parsed.projectName ?? "New Project");
      setClientName(parsed.clientName ?? "");
      setProjectArea(parsed.projectArea ?? 0);
    } else {
      const init: Record<string, Section> = {};
      sectionsData.forEach((s) => {
        init[s.id] = { id: s.id, name: s.name, items: [], subtotal: 0 };
      });
      setSections(init);
    }
  }, []);

  useEffect(() => {
    const data = {
      sections,
      projectName,
      clientName,
      projectArea,
      savedAt: new Date().toISOString(),
    };
    localStorage.setItem("boq-calculator", JSON.stringify(data));
  }, [sections, projectName, clientName, projectArea]);

  /* ---------- Calculations ---------- */
  const calculateItemAmount = (
    qty: number,
    rate: number,
    unit: UnitType
  ): number => {
    let q = qty;
    if (unit === "sqft" && projectArea > 0) q = qty * projectArea;
    if (unit === "percentage" && projectArea > 0) q = (qty / 100) * projectArea;
    return Number((q * rate).toFixed(2));
  };

  const updateSectionSubtotal = (sectionId: string) => {
    setSections((prev) => {
      const sec = prev[sectionId];
      if (!sec) return prev;
      const subtotal = sec.items.reduce((s, i) => s + i.amount, 0);
      return { ...prev, [sectionId]: { ...sec, subtotal } };
    });
  };

  /* ---------- CRUD ---------- */
  const addItem = (sectionId: string) => {
    const sec = sections[sectionId];
    const newItem: Item = {
      id: `${Date.now()}-${Math.random()}`,
      itemNo: `${sec.items.length + 1}`,
      description: "",
      unit: "nos",
      quantity: 0,
      rate: 0,
      amount: 0,
    };
    setSections((p) => ({
      ...p,
      [sectionId]: { ...p[sectionId], items: [...p[sectionId].items, newItem] },
    }));
  };

  const updateItem = (
    sectionId: string,
    itemId: string,
    field: keyof Item,
    value: any
  ) => {
    setSections((prev) => {
      const sec = prev[sectionId];
      if (!sec) return prev;
      const items = sec.items.map((it) => {
        if (it.id !== itemId) return it;
        const upd = { ...it, [field]: value };
        if (field === "quantity" || field === "rate" || field === "unit") {
          upd.amount = calculateItemAmount(
            field === "quantity" ? value : it.quantity,
            field === "rate" ? value : it.rate,
            field === "unit" ? value : it.unit
          );
        }
        return upd;
      });
      return { ...prev, [sectionId]: { ...sec, items } };
    });

    if (field === "quantity" || field === "rate" || field === "unit") {
      setTimeout(() => updateSectionSubtotal(sectionId), 0);
    }
  };

  const deleteItem = (sectionId: string, itemId: string) => {
    setSections((prev) => {
      const sec = prev[sectionId];
      if (!sec) return prev;
      const filtered = sec.items.filter((i) => i.id !== itemId);
      const renumbered = filtered.map((i, idx) => ({
        ...i,
        itemNo: `${idx + 1}`,
      }));
      return { ...prev, [sectionId]: { ...sec, items: renumbered } };
    });
    updateSectionSubtotal(sectionId);
  };

  /* ---------- Export CSV ---------- */
  const exportToCSV = () => {
    let csv = `BOQ Calculator - ${projectName}\n`;
    csv += `Client: ${clientName}, Project Area: ${projectArea} sqft, Date: ${format(
      new Date(),
      "dd/MM/yyyy"
    )}\n\n`;

    Object.values(sections).forEach((sec) => {
      csv += `${sec.name}\n`;
      csv += "Item No.,Description,Unit,Quantity,Rate,Amount\n";
      sec.items.forEach((it) => {
        csv += `${it.itemNo},"${it.description}",${it.unit},${it.quantity},${
          it.rate
        },${it.amount.toFixed(2)}\n`;
      });
      csv += `,,Subtotal,,,${sec.subtotal.toFixed(2)}\n\n`;
    });

    const total = Object.values(sections).reduce(
      (s, sec) => s + sec.subtotal,
      0
    );
    csv += `GRAND TOTAL,,,,,${total.toFixed(2)}\n`;

    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${projectName.replace(/ /g, "_")}_BOQ_${format(
      new Date(),
      "yyyy-MM-dd"
    )}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const grandTotal = Object.values(sections).reduce(
    (s, sec) => s + sec.subtotal,
    0
  );
  useHotkeys("ctrl+s, cmd+s", (e) => e.preventDefault());

  const currentSection = sectionsData.find((s) => s.id === activeSection);

  return (
    <div className="min-h-screen flex flex-col">
      {/* ---------- Header ---------- */}
      <header className="header">
        <div className="inner flex items-center justify-between mb-3">
          <input
            type="text"
            value={projectName}
            onChange={(e) => setProjectName(e.target.value)}
            className="project-name"
            placeholder="Project Name"
          />
          <div className="flex gap-3">
            <button className="btn btn-save">
              <Save className="w-4 h-4" />
              Save
            </button>
            <button onClick={exportToCSV} className="btn btn-export">
              <Download className="w-4 h-4" />
              Export CSV
            </button>
          </div>
        </div>

        <div className="flex gap-8 text-sm text-gray-700">
          <div className="flex items-center gap-2">
            <span className="font-medium">Client:</span>
            <input
              type="text"
              value={clientName}
              onChange={(e) => setClientName(e.target.value)}
              className="meta-input w-48"
              placeholder="Enter client name"
            />
          </div>
          <div className="flex items-center gap-2">
            <span className="font-medium">Area:</span>
            <input
              type="number"
              value={projectArea || ""}
              onChange={(e) => setProjectArea(Number(e.target.value))}
              className="meta-input w-24 text-right"
              placeholder="0"
            />
            <span>sqft</span>
          </div>
        </div>
      </header>

      <div className="flex flex-1">
        {/* ---------- Sidebar ---------- */}
        <aside className="sidebar">
          <div className="inner">
            <h3>Sections</h3>
            <div className="space-y-1.5">
              {sectionsData.map((sec) => (
                <button
                  key={sec.id}
                  onClick={() => setActiveSection(sec.id)}
                  className={`section-btn ${
                    activeSection === sec.id ? "active" : ""
                  }`}
                >
                  <span>{sec.name}</span>
                  <span className="amount">
                    ₹{(sections[sec.id]?.subtotal ?? 0).toFixed(0)}
                  </span>
                </button>
              ))}
            </div>

            <div className="grand-total">
              <div className="label">GRAND TOTAL</div>
              <div className="value">₹{grandTotal.toFixed(2)}</div>
            </div>
          </div>
        </aside>

        {/* ---------- Main ---------- */}
        <main className="flex-1 overflow-auto p-6">
          {currentSection && (
            <div className={`section-card ${currentSection.css}`}>
              <div className="head">
                <h2>{sections[activeSection]?.name ?? currentSection.name}</h2>
                <button
                  onClick={() => addItem(activeSection)}
                  className="add-item-btn"
                >
                  <Plus className="w-4 h-4" />
                  Add Item
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="table">
                  <thead>
                    <tr>
                      <th className="w-20">Item No.</th>
                      <th>Description</th>
                      <th className="w-32 text-center">Unit</th>
                      <th className="w-32 text-center">Qty</th>
                      <th className="w-32 text-center">Rate</th>
                      <th className="w-40 text-center">Amount</th>
                      <th className="w-16"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {sections[activeSection]?.items.map((item) => (
                      <tr key={item.id}>
                        <td>
                          <input
                            type="text"
                            value={item.itemNo}
                            onChange={(e) =>
                              updateItem(
                                activeSection,
                                item.id,
                                "itemNo",
                                e.target.value
                              )
                            }
                          />
                        </td>
                        <td>
                          <input
                            type="text"
                            value={item.description}
                            onChange={(e) =>
                              updateItem(
                                activeSection,
                                item.id,
                                "description",
                                e.target.value
                              )
                            }
                            placeholder="Enter description..."
                          />
                        </td>
                        <td>
                          <select
                            value={item.unit}
                            onChange={(e) =>
                              updateItem(
                                activeSection,
                                item.id,
                                "unit",
                                e.target.value as UnitType
                              )
                            }
                          >
                            {unitOptions.map((opt) => (
                              <option key={opt.value} value={opt.value}>
                                {opt.label}
                              </option>
                            ))}
                          </select>
                        </td>
                        <td>
                          <input
                            type="number"
                            value={item.quantity}
                            onChange={(e) =>
                              updateItem(
                                activeSection,
                                item.id,
                                "quantity",
                                Number(e.target.value)
                              )
                            }
                            className="text-right"
                            step="0.01"
                          />
                        </td>
                        <td>
                          <input
                            type="number"
                            value={item.rate}
                            onChange={(e) =>
                              updateItem(
                                activeSection,
                                item.id,
                                "rate",
                                Number(e.target.value)
                              )
                            }
                            className="text-right"
                            step="0.01"
                          />
                        </td>
                        <td className="text-right font-semibold">
                          ₹{item.amount.toFixed(2)}
                        </td>
                        <td className="text-center">
                          <button
                            onClick={() => deleteItem(activeSection, item.id)}
                            className="delete-btn"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}

                    {sections[activeSection]?.items.length === 0 && (
                      <tr className="empty-row">
                        <td colSpan={7}>
                          No items added yet. Click "Add Item" to start.
                        </td>
                      </tr>
                    )}
                  </tbody>
                  <tfoot>
                    <tr>
                      <td colSpan={5} className="subtotal-label">
                        Subtotal:
                      </td>
                      <td className="text-right text-lg">
                        ₹{(sections[activeSection]?.subtotal ?? 0).toFixed(2)}
                      </td>
                      <td></td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
