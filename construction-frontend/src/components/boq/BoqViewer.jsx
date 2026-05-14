"use client";

import React, { useRef } from "react";
import { Printer, ArrowLeft, FileSpreadsheet, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
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
  };

  // =========================
  // EXPORT PDF
  // =========================
  const exportPDF = async () => {
    const element = printRef.current;

    // Force supported colors for html2canvas
    const originalBg = document.body.style.background;
    document.body.style.background = "#ffffff";

    try {
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        backgroundColor: "#ffffff",
        logging: false,

        onclone: (clonedDoc) => {
          // Replace unsupported CSS colors
          const allElements = clonedDoc.querySelectorAll("*");

          allElements.forEach((el) => {
            const style = window.getComputedStyle(el);

            // Fix text color
            if (style.color.includes("oklch") || style.color.includes("lab(")) {
              el.style.color = "#000000";
            }

            // Fix background color
            if (
              style.backgroundColor.includes("oklch") ||
              style.backgroundColor.includes("lab(")
            ) {
              el.style.backgroundColor = "#ffffff";
            }

            // Fix border color
            if (
              style.borderColor.includes("oklch") ||
              style.borderColor.includes("lab(")
            ) {
              el.style.borderColor = "#000000";
            }
          });
        },
      });

      const imgData = canvas.toDataURL("image/png");

      const pdf = new jsPDF("p", "mm", "a4");

      const pageWidth = 210;
      const pageHeight = 297;

      const imgWidth = pageWidth;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      let heightLeft = imgHeight;
      let position = 0;

      pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);

      heightLeft -= pageHeight;

      while (heightLeft > 0) {
        position = heightLeft - imgHeight;

        pdf.addPage();

        pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);

        heightLeft -= pageHeight;
      }

      pdf.save(`${boq.title || "BOQ"}.pdf`);
    } catch (error) {
      console.error("PDF Export Error:", error);
    } finally {
      document.body.style.background = originalBg;
    }
  };

  return (
    <div className="bg-gray-200 min-h-screen py-10">
      {/* Toolbar */}
      <div className="max-w-[900px] mx-auto flex justify-between mb-6 print:hidden">
        <Button
          variant="outline"
          onClick={() => router.back()}
          className="gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </Button>

        <div className="flex gap-3">
          <Button
            onClick={exportExcel}
            className="gap-2 bg-green-600 hover:bg-green-700"
          >
            <FileSpreadsheet className="w-4 h-4" />
            Export Excel
          </Button>

          <Button
            onClick={exportPDF}
            className="gap-2 bg-red-600 hover:bg-red-700"
          >
            <FileText className="w-4 h-4" />
            Export PDF
          </Button>

          <Button
            onClick={() => window.print()}
            className="gap-2 bg-[#ef7f1b] hover:bg-[#d66e15]"
          >
            <Printer className="w-4 h-4" />
            Print
          </Button>
        </div>
      </div>

      {/* A4 PAGE */}
      <div
        ref={printRef}
        className="bg-white mx-auto shadow-lg"
        style={{
          width: "210mm",
          minHeight: "297mm",
          padding: "10mm",
        }}
      >
        {/* HEADER */}
        <table className="w-full border-collapse border border-black text-[11px]">
          <tbody>
            <tr className="bg-yellow-300 font-bold">
              <td className="border border-black p-2 w-[80%]">
                {boq.title} ({boq.category?.name || "BOQ"} Interior Works)
              </td>

              <td className="border border-black p-2 text-center">
                {new Date(boq.created_at).toLocaleDateString("en-IN")}
              </td>
            </tr>
          </tbody>
        </table>

        {/* MAIN TABLE */}
        <table className="w-full border-collapse border border-black text-[10px]">
          <thead>
            <tr className="bg-gray-200 font-bold">
              <th className="border border-black p-1 w-[5%]">S.NO</th>

              <th className="border border-black p-1 w-[15%]">ITEM CODE</th>

              <th className="border border-black p-1 w-[25%]">ITEM NAME</th>

              <th className="border border-black p-1 w-[20%]">DESCRIPTION</th>

              <th className="border border-black p-1 w-[8%]">UNIT</th>

              <th className="border border-black p-1 w-[8%]">QTY</th>

              <th className="border border-black p-1 w-[9%]">RATE</th>

              <th className="border border-black p-1 w-[10%]">AMOUNT</th>
            </tr>
          </thead>

          <tbody>
            {boq.sections?.map((section, sectionIndex) => (
              <React.Fragment key={section.id}>
                {/* SECTION */}
                <tr className="bg-gray-100 font-bold">
                  <td colSpan={8} className="border border-black p-2">
                    {String.fromCharCode(65 + sectionIndex)} {section.title}
                  </td>
                </tr>

                {/* SUBHEADINGS */}
                {section.subheadings?.map((subheading, subIndex) => (
                  <React.Fragment key={subheading.id}>
                    <tr className="bg-yellow-50 font-semibold">
                      <td colSpan={8} className="border border-black p-2">
                        {sectionIndex + 1}.{subIndex + 1} {subheading.title}
                      </td>
                    </tr>

                    {/* ITEMS */}
                    {subheading.items?.map((item, itemIndex) => (
                      <tr key={item.id}>
                        <td className="border border-black p-1 text-center">
                          {item.sno || itemIndex + 1}
                        </td>

                        <td className="border border-black p-1">
                          {item.item_code}
                        </td>

                        <td className="border border-black p-1">
                          {item.item_name}
                        </td>

                        <td className="border border-black p-1">
                          {item.description || "-"}
                        </td>

                        <td className="border border-black p-1 text-center">
                          {item.unit?.name || "-"}
                        </td>

                        <td className="border border-black p-1 text-right">
                          {Number(item.qty || 0).toLocaleString("en-IN")}
                        </td>

                        <td className="border border-black p-1 text-right">
                          ₹{Number(item.rate || 0).toLocaleString("en-IN")}
                        </td>

                        <td className="border border-black p-1 text-right font-semibold">
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

            {/* TOTALS */}
            <tr className="bg-gray-100 font-bold">
              <td colSpan={7} className="border border-black p-2 text-right">
                SUB TOTAL
              </td>

              <td className="border border-black p-2 text-right">
                ₹{Number(boq.subtotal || 0).toLocaleString("en-IN")}
              </td>
            </tr>

            {Number(boq.tax_amount) > 0 && (
              <tr className="bg-gray-100 font-bold">
                <td colSpan={7} className="border border-black p-2 text-right">
                  TAX
                </td>

                <td className="border border-black p-2 text-right">
                  ₹{Number(boq.tax_amount || 0).toLocaleString("en-IN")}
                </td>
              </tr>
            )}

            <tr className="bg-black text-white font-bold text-[12px]">
              <td colSpan={7} className="border border-black p-3 text-right">
                GRAND TOTAL
              </td>

              <td className="border border-black p-3 text-right">
                ₹{Number(boq.grand_total || 0).toLocaleString("en-IN")}
              </td>
            </tr>
          </tbody>
        </table>

        {/* NOTES */}
        {boq.notes && (
          <div className="mt-6">
            <h3 className="font-bold text-sm mb-2">NOTES :</h3>

            <p className="text-[10px] whitespace-pre-wrap leading-5">
              {boq.notes}
            </p>
          </div>
        )}
      </div>

      {/* PRINT STYLE */}
      <style jsx global>{`
        @media print {
          body {
            background: white;
          }

          @page {
            size: A4;
            margin: 0;
          }
        }
      `}</style>
    </div>
  );
};

export default BoqViewer;
