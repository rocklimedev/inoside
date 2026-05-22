"use client";

import React, { useRef } from "react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";

import {
  ArrowLeft,
  Printer,
  FileSpreadsheet,
  FileText,
  Download,
} from "lucide-react";
import { toast } from "sonner";

import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

const BoqViewer = ({ boq }) => {
  const router = useRouter();
  const printRef = useRef(null);

  if (!boq) return <div>BOQ not found</div>;

  // =========================
  // EXPORT EXCEL
  // =========================
  const exportExcel = () => {
    const rows = [];

    boq.sections?.forEach((section, sectionIndex) => {
      rows.push([
        `${String.fromCharCode(65 + sectionIndex)}. ${section.title}`,
      ]);

      section.subheadings?.forEach((subheading, subIndex) => {
        rows.push([`${sectionIndex + 1}.${subIndex + 1} ${subheading.title}`]);

        rows.push([
          "S.NO",
          "ITEM CODE",
          "ITEM NAME",
          "DESCRIPTION",
          "UNIT",
          "QTY",
          "RATE",
          "AMOUNT",
        ]);

        subheading.items?.forEach((item, itemIndex) => {
          rows.push([
            item.sno || itemIndex + 1,
            item.item_code,
            item.item_name,
            item.description || "-",
            item.unit?.name || "-",
            item.qty,
            item.rate,
            item.final_amount,
          ]);
        });

        rows.push([]);
      });
    });

    rows.push(["", "", "", "", "", "", "GRAND TOTAL", boq.grand_total]);

    const worksheet = XLSX.utils.aoa_to_sheet(rows);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "BOQ");

    XLSX.writeFile(workbook, `${boq.title || "BOQ"}-${Date.now()}.xlsx`);
    toast.success("Excel exported successfully");
  };

  // =========================
  // EXPORT PDF
  // =========================
  const exportPDF = async () => {
    const element = printRef.current;
    if (!element) return;

    const originalBg = document.body.style.background;
    document.body.style.background = "#ffffff";

    try {
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        backgroundColor: "#ffffff",
        logging: false,
        onclone: (clonedDoc) => {
          clonedDoc.querySelectorAll("*").forEach((el) => {
            const style = window.getComputedStyle(el);
            if (style.color.includes("oklch") || style.color.includes("lab(")) {
              el.style.color = "#000000";
            }
            if (
              style.backgroundColor.includes("oklch") ||
              style.backgroundColor.includes("lab(")
            ) {
              el.style.backgroundColor = "#ffffff";
            }
          });
        },
      });

      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      const pageWidth = 210;
      const imgWidth = pageWidth;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      let heightLeft = imgHeight;
      let position = 0;

      pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
      heightLeft -= 297;

      while (heightLeft > 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
        heightLeft -= 297;
      }

      pdf.save(`${boq.title || "BOQ"}.pdf`);
      toast.success("PDF exported successfully");
    } catch (error) {
      console.error("PDF Export Error:", error);
      toast.error("Failed to export PDF");
    } finally {
      document.body.style.background = originalBg;
    }
  };

  return (
    <div className="flex flex-col h-full" data-testid="boq-viewer">
      {/* Header */}
      <div className="p-4 md:px-6 border-b border-gray-200 bg-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => router.back()}
              className="text-gray-400 hover:text-black transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>

            <div>
              <h1 className="text-base font-bold text-black">{boq.title}</h1>
              <p className="text-[11px] text-gray-400">Bill of Quantities</p>
            </div>

            <Badge className="bg-blue-50 text-blue-600 text-[10px] border-0 ml-2">
              {boq.category?.name || "Interior Works"}
            </Badge>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={exportExcel}
              className="gap-2"
            >
              <FileSpreadsheet className="w-4 h-4" />
              Excel
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={exportPDF}
              className="gap-2"
            >
              <FileText className="w-4 h-4" />
              PDF
            </Button>

            <Button
              size="sm"
              onClick={() => window.print()}
              className="bg-[#ef7f1b] hover:bg-[#d66e15] text-white gap-2"
            >
              <Printer className="w-4 h-4" />
              Print
            </Button>
          </div>
        </div>
      </div>

      {/* Document Content */}
      <ScrollArea className="flex-1 bg-gray-50">
        <div className="max-w-4xl mx-auto p-6 md:p-8">
          <div
            ref={printRef}
            className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden print:shadow-none print:rounded-none"
          >
            {/* Document Header */}
            <div className="p-8 border-b-2 border-[#ef7f1b]">
              <div className="flex items-baseline gap-1 mb-1">
                <span className="text-lg font-black text-black">BUILD</span>
                <span className="text-lg font-black text-[#ef7f1b]">CON</span>
              </div>

              <h2 className="text-3xl font-bold text-black mt-6">
                Bill of Quantities
              </h2>
              <p className="text-lg text-gray-600 mt-1">{boq.title}</p>

              <div className="flex justify-between items-end mt-6">
                <div>
                  <p className="text-sm text-gray-500">Date</p>
                  <p className="font-medium">
                    {new Date(boq.created_at).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </p>
                </div>
                {boq.category?.name && (
                  <Badge variant="outline" className="text-sm">
                    {boq.category.name}
                  </Badge>
                )}
              </div>
            </div>

            {/* Main Table */}
            <div className="p-8">
              <table className="w-full border-collapse border border-gray-300 text-sm print:text-[10px]">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="border border-gray-300 p-3 text-left w-[5%]">
                      S.NO
                    </th>
                    <th className="border border-gray-300 p-3 text-left w-[12%]">
                      ITEM CODE
                    </th>
                    <th className="border border-gray-300 p-3 text-left">
                      ITEM NAME
                    </th>
                    <th className="border border-gray-300 p-3 text-left">
                      DESCRIPTION
                    </th>
                    <th className="border border-gray-300 p-3 text-center w-[8%]">
                      UNIT
                    </th>
                    <th className="border border-gray-300 p-3 text-right w-[8%]">
                      QTY
                    </th>
                    <th className="border border-gray-300 p-3 text-right w-[10%]">
                      RATE
                    </th>
                    <th className="border border-gray-300 p-3 text-right w-[12%]">
                      AMOUNT
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {boq.sections?.map((section, sectionIndex) => (
                    <React.Fragment key={section.id}>
                      {/* Section Header */}
                      <tr className="bg-gray-50">
                        <td
                          colSpan={8}
                          className="border border-gray-300 p-4 font-bold text-base"
                        >
                          {String.fromCharCode(65 + sectionIndex)}.{" "}
                          {section.title}
                        </td>
                      </tr>

                      {section.subheadings?.map((subheading, subIndex) => (
                        <React.Fragment key={subheading.id}>
                          {/* Subheading */}
                          <tr className="bg-amber-50">
                            <td
                              colSpan={8}
                              className="border border-gray-300 p-3 font-semibold"
                            >
                              {sectionIndex + 1}.{subIndex + 1}{" "}
                              {subheading.title}
                            </td>
                          </tr>

                          {/* Items */}
                          {subheading.items?.map((item, itemIndex) => (
                            <tr key={item.id} className="hover:bg-gray-50">
                              <td className="border border-gray-300 p-3 text-center">
                                {item.sno || itemIndex + 1}
                              </td>
                              <td className="border border-gray-300 p-3 font-mono text-sm">
                                {item.item_code}
                              </td>
                              <td className="border border-gray-300 p-3">
                                {item.item_name}
                              </td>
                              <td className="border border-gray-300 p-3 text-gray-600">
                                {item.description || "-"}
                              </td>
                              <td className="border border-gray-300 p-3 text-center">
                                {item.unit?.name || "-"}
                              </td>
                              <td className="border border-gray-300 p-3 text-right">
                                {Number(item.qty || 0).toLocaleString("en-IN")}
                              </td>
                              <td className="border border-gray-300 p-3 text-right">
                                ₹
                                {Number(item.rate || 0).toLocaleString("en-IN")}
                              </td>
                              <td className="border border-gray-300 p-3 text-right font-semibold">
                                ₹
                                {Number(item.final_amount || 0).toLocaleString(
                                  "en-IN",
                                )}
                              </td>
                            </tr>
                          ))}
                        </React.Fragment>
                      ))}
                    </React.Fragment>
                  ))}

                  {/* Totals */}
                  <tr className="bg-gray-100 font-bold">
                    <td
                      colSpan={7}
                      className="border border-gray-300 p-4 text-right"
                    >
                      SUB TOTAL
                    </td>
                    <td className="border border-gray-300 p-4 text-right">
                      ₹{Number(boq.subtotal || 0).toLocaleString("en-IN")}
                    </td>
                  </tr>

                  {Number(boq.tax_amount) > 0 && (
                    <tr className="bg-gray-100 font-bold">
                      <td
                        colSpan={7}
                        className="border border-gray-300 p-4 text-right"
                      >
                        TAX
                      </td>
                      <td className="border border-gray-300 p-4 text-right">
                        ₹{Number(boq.tax_amount || 0).toLocaleString("en-IN")}
                      </td>
                    </tr>
                  )}

                  <tr className="bg-black text-white font-bold text-base">
                    <td
                      colSpan={7}
                      className="border border-gray-300 p-4 text-right"
                    >
                      GRAND TOTAL
                    </td>
                    <td className="border border-gray-300 p-4 text-right">
                      ₹{Number(boq.grand_total || 0).toLocaleString("en-IN")}
                    </td>
                  </tr>
                </tbody>
              </table>

              {/* Notes */}
              {boq.notes && (
                <div className="mt-10">
                  <h3 className="font-bold text-sm mb-3 text-gray-800">
                    NOTES :
                  </h3>
                  <p className="text-sm text-gray-600 whitespace-pre-wrap leading-relaxed border-l-4 border-[#ef7f1b] pl-4">
                    {boq.notes}
                  </p>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="px-8 py-6 bg-gray-50 border-t border-gray-100 text-center">
              <p className="text-xs text-gray-400">
                Generated by BUILDCON • Confidential Document
              </p>
            </div>
          </div>
        </div>
      </ScrollArea>

      {/* Print Styles */}
      <style jsx global>{`
        @media print {
          body {
            background: white;
          }
          @page {
            size: A4 portrait;
            margin: 0;
          }
          .print\\:shadow-none {
            box-shadow: none !important;
          }
        }
      `}</style>
    </div>
  );
};

export default BoqViewer;
