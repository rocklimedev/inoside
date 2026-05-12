import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";
import { formatINR, formatNumber, formatDate } from "./format";
import { aggregateByCategory } from "./calculations";

// ---------- PDF export ----------
export function exportBOQPDF(project, boq) {
  const doc = new jsPDF({ unit: "pt", format: "a4" });
  const margin = 40;
  let y = margin;

  // Header
  doc.setFont("helvetica", "bold");
  doc.setFontSize(20);
  doc.setTextColor(37, 99, 235);
  doc.text("BOQ Estimate", margin, y);
  y += 22;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.setTextColor(51, 65, 85);
  doc.text(`Project: ${project.name || "Untitled"}`, margin, y); y += 14;
  if (project.client_name) { doc.text(`Client: ${project.client_name}`, margin, y); y += 14; }
  if (project.location) { doc.text(`Location: ${project.location}`, margin, y); y += 14; }
  doc.text(`Mode: ${(project.mode || "detailed").toUpperCase()}   Quality: ${project.quality || "standard"}   Area: ${formatNumber(project.built_up_area)} sqft`, margin, y); y += 14;
  doc.text(`Generated: ${formatDate(new Date().toISOString())}`, margin, y); y += 20;

  // Summary box
  const s = boq.summary;
  doc.setDrawColor(226, 232, 240);
  doc.setFillColor(248, 250, 252);
  doc.rect(margin, y, 515, 80, "F");
  doc.setFontSize(9);
  doc.setTextColor(100, 116, 139);
  doc.text("SUBTOTAL", margin + 10, y + 16);
  doc.text("MARKUP", margin + 140, y + 16);
  doc.text("CONTINGENCY", margin + 260, y + 16);
  doc.text("GST", margin + 400, y + 16);
  doc.setFontSize(11);
  doc.setTextColor(15, 23, 42);
  doc.setFont("helvetica", "bold");
  doc.text(formatINR(s.subtotal), margin + 10, y + 34);
  doc.text(formatINR(s.markup), margin + 140, y + 34);
  doc.text(formatINR(s.contingency), margin + 260, y + 34);
  doc.text(formatINR(s.gst), margin + 400, y + 34);

  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(100, 116, 139);
  doc.text("TOTAL ESTIMATED COST", margin + 10, y + 58);
  doc.setTextColor(249, 115, 22);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(14);
  doc.text(formatINR(s.total), margin + 10, y + 74);
  if (s.ratePerSqft) {
    doc.setFontSize(10);
    doc.setTextColor(71, 85, 105);
    doc.text(`₹ ${formatNumber(s.ratePerSqft, 0)} / sqft`, margin + 400, y + 74);
  }
  y += 100;

  // Items table
  autoTable(doc, {
    startY: y,
    head: [["#", "Category", "Item", "Unit", "Qty", "Rate (₹)", "Amount (₹)"]],
    body: boq.items.map((it, idx) => [
      idx + 1,
      it.category,
      it.item + (it.remarks ? `\n${it.remarks}` : ""),
      it.unit,
      formatNumber(it.quantity),
      formatNumber(it.rate, 0),
      formatNumber(it.amount, 0),
    ]),
    theme: "grid",
    styles: { fontSize: 8, cellPadding: 4 },
    headStyles: { fillColor: [37, 99, 235], textColor: 255, fontStyle: "bold" },
    alternateRowStyles: { fillColor: [248, 250, 252] },
    columnStyles: {
      0: { cellWidth: 25 },
      4: { halign: "right" },
      5: { halign: "right" },
      6: { halign: "right", fontStyle: "bold" },
    },
    margin: { left: margin, right: margin },
  });

  // Category summary on new page
  const agg = aggregateByCategory(boq.items);
  doc.addPage();
  y = margin;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(14);
  doc.setTextColor(15, 23, 42);
  doc.text("Category-wise Summary", margin, y); y += 16;
  autoTable(doc, {
    startY: y,
    head: [["Category", "Items", "Amount (₹)", "% of Subtotal"]],
    body: agg.map((a) => [
      a.category, a.items, formatNumber(a.amount, 0),
      s.subtotal ? ((a.amount / s.subtotal) * 100).toFixed(1) + "%" : "—",
    ]),
    theme: "grid",
    styles: { fontSize: 9, cellPadding: 6 },
    headStyles: { fillColor: [249, 115, 22], textColor: 255, fontStyle: "bold" },
    margin: { left: margin, right: margin },
  });

  doc.save(`BOQ_${(project.name || "project").replace(/[^a-z0-9]/gi, "_")}.pdf`);
}

// ---------- Excel export ----------
export function exportBOQExcel(project, boq) {
  const wb = XLSX.utils.book_new();
  const header = [
    ["Project", project.name || ""],
    ["Client", project.client_name || ""],
    ["Location", project.location || ""],
    ["Mode", (project.mode || "detailed").toUpperCase()],
    ["Quality", project.quality || ""],
    ["Built-up Area (sqft)", project.built_up_area || 0],
    ["Generated On", formatDate(new Date().toISOString())],
    [],
  ];
  const rows = [
    ["#", "Category", "Item", "Description", "Unit", "Quantity", "Rate (INR)", "Amount (INR)", "Remarks"],
    ...boq.items.map((it, idx) => [
      idx + 1, it.category, it.item, it.description || "", it.unit,
      Number(it.quantity || 0), Number(it.rate || 0), Number(it.amount || 0), it.remarks || "",
    ]),
    [],
    ["", "", "", "", "", "", "Subtotal", boq.summary.subtotal, ""],
    ["", "", "", "", "", "", "Markup", boq.summary.markup, ""],
    ["", "", "", "", "", "", "Contingency", boq.summary.contingency, ""],
    ["", "", "", "", "", "", "GST", boq.summary.gst, ""],
    ["", "", "", "", "", "", "TOTAL", boq.summary.total, ""],
  ];
  const ws = XLSX.utils.aoa_to_sheet([...header, ...rows]);
  ws["!cols"] = [{ wch: 5 }, { wch: 22 }, { wch: 34 }, { wch: 28 }, { wch: 8 }, { wch: 12 }, { wch: 14 }, { wch: 16 }, { wch: 24 }];
  XLSX.utils.book_append_sheet(wb, ws, "BOQ");

  // Category sheet
  const agg = aggregateByCategory(boq.items);
  const catRows = [["Category", "Items", "Amount (INR)", "% of Subtotal"],
    ...agg.map((a) => [a.category, a.items, a.amount, boq.summary.subtotal ? ((a.amount / boq.summary.subtotal) * 100).toFixed(2) : "0"])];
  const cws = XLSX.utils.aoa_to_sheet(catRows);
  cws["!cols"] = [{ wch: 28 }, { wch: 10 }, { wch: 16 }, { wch: 16 }];
  XLSX.utils.book_append_sheet(wb, cws, "By Category");

  XLSX.writeFile(wb, `BOQ_${(project.name || "project").replace(/[^a-z0-9]/gi, "_")}.xlsx`);
}
