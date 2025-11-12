// src/components/ExcelWorksheet.jsx
import React, { useMemo, useState, useEffect } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  flexRender,
} from "@tanstack/react-table";
import { saveAs } from "file-saver";
import * as XLSX from "xlsx";
import {
  FiPlus,
  FiDownload,
  FiRefreshCw,
  FiSearch,
  FiChevronUp,
  FiChevronDown,
  FiMoreVertical,
  FiEdit2,
  FiTrash2,
} from "react-icons/fi";
import PageHeader from "../Common/PageHeader";
import AddModal from "../Tabulars/AddModal";
import {
  useGetPersonsQuery,
  useDeletePersonMutation,
  useGetPersonTypesQuery,
} from "../../api/personApi";

/* ------------------------------------------------------------------ */
/*  Excel-style Worksheet (pure JSX)                                 */
/* ------------------------------------------------------------------ */
const Table = () => {
  /* -------------------------- RTK Query --------------------------- */
  const {
    data: persons = [],
    isLoading,
    isFetching,
    refetch,
  } = useGetPersonsQuery(undefined);
  const { data: personTypes = [] } = useGetPersonTypesQuery(undefined);
  const [deletePerson, { isLoading: isDeleting }] = useDeletePersonMutation();

  /* --------------------------- UI State --------------------------- */
  const [selectedTypeId, setSelectedTypeId] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [editingPerson, setEditingPerson] = useState(null);
  const [sorting, setSorting] = useState([]);
  const [globalFilter, setGlobalFilter] = useState("");

  /* --------------------- Filter by Sheet (PersonType) ------------- */
  const filteredData = useMemo(() => {
    if (!selectedTypeId) return persons;
    return persons.filter((p) => p.person_type_id === selectedTypeId);
  }, [persons, selectedTypeId]);

  /* --------------------------- Columns ---------------------------- */
  const columns = useMemo(
    () => [
      {
        id: "select",
        header: () => null,
        cell: ({ row }) => (
          <input
            type="checkbox"
            checked={row.getIsSelected()}
            onChange={row.getToggleSelectedHandler()}
          />
        ),
        enableSorting: false,
        enableColumnFilter: false,
        size: 40,
        minSize: 40,
        maxSize: 40,
      },
      {
        accessorKey: "id",
        header: "ID",
        cell: (info) => `PUR${String(info.getValue()).padStart(5, "0")}`,
        size: 90,
      },
      {
        accessorFn: (row) =>
          row.created_at
            ? new Date(row.created_at).toLocaleDateString("en-GB")
            : "—",
        id: "date",
        header: "Date",
        size: 110,
      },
      {
        accessorKey: "name",
        header: "Vendor",
        cell: (info) => {
          const name = info.getValue();
          const email = info.row.original.email ?? "";
          return (
            <div className="d-flex align-items-center">
              <img
                src={`https://ui-avatars.com/api/?name=${encodeURIComponent(
                  name
                )}&background=random`}
                alt=""
                className="avatar avatar-xs rounded-circle me-2"
              />
              <div>
                <div className="fw-medium">{name}</div>
                <small className="text-muted">{email}</small>
              </div>
            </div>
          );
        },
        size: 240,
      },
      {
        accessorKey: "amount",
        header: "Amount",
        cell: () => "$10,000", // replace with real field
        size: 110,
      },
      {
        accessorKey: "payment_mode",
        header: "Payment Mode",
        cell: () => "Cash",
        size: 130,
      },
      {
        accessorKey: "status",
        header: "Status",
        cell: () => (
          <span className="badge bg-success-subtle text-success badge-sm">
            Paid
          </span>
        ),
        size: 100,
      },
      {
        id: "actions",
        header: () => null,
        cell: ({ row }) => {
          const person = row.original;
          return (
            <div className="dropdown">
              <button
                className="btn btn-sm btn-link text-muted p-0"
                data-bs-toggle="dropdown"
              >
                <FiMoreVertical />
              </button>
              <ul className="dropdown-menu dropdown-menu-end">
                <li>
                  <button
                    className="dropdown-item d-flex align-items-center"
                    onClick={() => {
                      setEditingPerson(person);
                      setShowModal(true);
                    }}
                  >
                    <FiEdit2 className="me-2" /> Edit
                  </button>
                </li>
                <li>
                  <button
                    className="dropdown-item d-flex align-items-center text-danger"
                    onClick={() => handleDelete(person.id)}
                    disabled={isDeleting}
                  >
                    <FiTrash2 className="me-2" />
                    {isDeleting ? "Deleting…" : "Delete"}
                  </button>
                </li>
              </ul>
            </div>
          );
        },
        enableSorting: false,
        enableColumnFilter: false,
        size: 60,
      },
    ],
    [isDeleting]
  );

  /* -------------------------- Table Instance ---------------------- */
  const table = useReactTable({
    data: filteredData,
    columns,
    state: {
      sorting,
      globalFilter,
    },
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    columnResizeMode: "onChange",
    enableColumnResizing: true,
    enableRowSelection: true,
    enableMultiRowSelection: true,
  });

  /* ----------------------------- Helpers -------------------------- */
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this row?")) return;
    try {
      await deletePerson(id).unwrap();
    } catch {
      alert("Delete failed");
    }
  };

  const exportToExcel = () => {
    const rows = table.getRowModel().rows.map((r) => r.original);
    const ws = XLSX.utils.json_to_sheet(rows);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Data");
    const buffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    const blob = new Blob([buffer], { type: "application/octet-stream" });
    saveAs(blob, `worksheet_${new Date().toISOString().slice(0, 10)}.xlsx`);
  };

  const openAddModal = () => {
    setEditingPerson(null);
    setShowModal(true);
  };

  /* --------------------------- Render ---------------------------- */
  return (
    <div className="excel-worksheet">
      {/* ---------- Toolbar (top) ---------- */}
      <div className="excel-toolbar d-flex align-items-center justify-content-between flex-wrap gap-2 p-2 border-bottom bg-light">
        <div className="d-flex align-items-center gap-2">
          <button className="btn btn-sm btn-success" onClick={openAddModal}>
            <FiPlus /> Add Row
          </button>
          <button
            className="btn btn-sm btn-outline-secondary"
            onClick={exportToExcel}
          >
            <FiDownload /> Export
          </button>
          <button
            className="btn btn-sm btn-outline-secondary"
            onClick={refetch}
            disabled={isFetching}
          >
            <FiRefreshCw /> {isFetching ? "Refreshing…" : "Refresh"}
          </button>
        </div>

        <div className="d-flex align-items-center gap-2">
          <div className="position-relative">
            <FiSearch className="position-absolute top-50 start-2 translate-middle-y text-muted" />
            <input
              type="text"
              className="form-control form-control-sm ps-5"
              placeholder="Search…"
              value={globalFilter ?? ""}
              onChange={(e) => setGlobalFilter(e.target.value)}
              style={{ width: "200px" }}
            />
          </div>
        </div>
      </div>

      {/* ---------- Main Grid ---------- */}
      <div className="excel-grid-container position-relative">
        {isLoading ? (
          <div className="text-center py-5">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading…</span>
            </div>
          </div>
        ) : filteredData.length === 0 ? (
          <div className="text-center py-5 text-muted">No data</div>
        ) : (
          <div className="excel-grid">
            {/* ---------- Pagination (just below tabs) ---------- */}
            <div className="excel-pagination d-flex justify-content-between align-items-center mt-2 px-2 bg-white border-top">
              <span className="text-muted small">
                Rows {table.getState().pagination.pageIndex * 10 + 1} -{" "}
                {Math.min(
                  (table.getState().pagination.pageIndex + 1) * 10,
                  filteredData.length
                )}{" "}
                of {filteredData.length}
              </span>
              <div className="pagination">
                <button
                  className="btn btn-sm btn-outline-secondary me-1"
                  onClick={() => table.previousPage()}
                  disabled={!table.getCanPreviousPage()}
                >
                  Prev
                </button>
                <button
                  className="btn btn-sm btn-outline-secondary"
                  onClick={() => table.nextPage()}
                  disabled={!table.getCanNextPage()}
                >
                  Next
                </button>
              </div>
            </div>

            {/* Row Numbers */}
            <div className="excel-row-numbers">
              {table.getRowModel().rows.map((row, idx) => (
                <div key={row.id} className="excel-row-number">
                  {idx + 1}
                </div>
              ))}
            </div>

            {/* Table */}
            <div className="excel-table-wrapper">
              <table className="excel-table">
                <thead>
                  {table.getHeaderGroups().map((headerGroup) => (
                    <tr key={headerGroup.id}>
                      {/* Corner cell (A1 style) */}
                      <th className="excel-corner-cell"></th>

                      {headerGroup.headers.map((header, i) => (
                        <th
                          key={header.id}
                          style={{ width: header.getSize() }}
                          className="excel-header-cell"
                        >
                          <div
                            className="d-flex align-items-center justify-content-center gap-1 cursor-pointer select-none"
                            onClick={header.column.getToggleSortingHandler()}
                          >
                            {/* Column Letter (A, B, C…) */}
                            <span className="excel-col-letter">
                              {String.fromCharCode(65 + i)}
                            </span>

                            {/* Sort Icons */}
                            {header.column.getIsSorted() === "asc" && (
                              <FiChevronUp className="excel-sort-icon" />
                            )}
                            {header.column.getIsSorted() === "desc" && (
                              <FiChevronDown className="excel-sort-icon" />
                            )}
                          </div>

                          {/* Resize Handle */}
                          {header.column.getCanResize() && (
                            <div
                              onMouseDown={header.getResizeHandler()}
                              onTouchStart={header.getResizeHandler()}
                              className="excel-resize-handle"
                            />
                          )}
                        </th>
                      ))}
                    </tr>
                  ))}
                </thead>
                <tbody>
                  {table.getRowModel().rows.map((row) => (
                    <tr
                      key={row.id}
                      className={
                        row.getIsSelected() ? "excel-selected-row" : ""
                      }
                    >
                      <td className="excel-select-cell">
                        <input
                          type="checkbox"
                          checked={row.getIsSelected()}
                          onChange={row.getToggleSelectedHandler()}
                        />
                      </td>
                      {row.getVisibleCells().map((cell) => (
                        <td key={cell.id} className="excel-data-cell">
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* ---------- Sheet Tabs (bottom) ---------- */}
      <div className="excel-sheet-tabs d-flex overflow-auto border-top bg-light">
        <button
          className={`excel-sheet-tab px-3 py-2 border-0 bg-transparent ${
            selectedTypeId === null ? "excel-active-tab" : ""
          }`}
          onClick={() => setSelectedTypeId(null)}
        >
          All
        </button>
        {personTypes.map((pt) => (
          <button
            key={pt.id}
            className={`excel-sheet-tab px-3 py-2 border-0 bg-transparent ${
              selectedTypeId === pt.id ? "excel-active-tab" : ""
            }`}
            onClick={() => setSelectedTypeId(pt.id)}
          >
            {pt.name}
          </button>
        ))}
        {/* Optional “+” to add a new sheet */}
        <button className="excel-sheet-tab excel-add-tab px-3 py-2 border-0 bg-transparent text-success">
          <FiPlus />
        </button>
      </div>

      {/* ---------- Add / Edit Modal ---------- */}
      <AddModal
        show={showModal}
        onHide={() => {
          setShowModal(false);
          setEditingPerson(null);
        }}
        // editingPerson={editingPerson}
        // onSuccess={refetch}
      />
    </div>
  );
};

/* ------------------------------------------------------------------ */
/*  CSS – paste into your global stylesheet or a CSS module          */
/* ------------------------------------------------------------------ */
const excelStyles = `
.excel-worksheet {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  font-size: 13px;
  display: flex;
  flex-direction: column;
  height: 100%;
}

/* Toolbar */
.excel-toolbar {
  background: #f8f9fa;
  border-bottom: 1px solid #dee2e6;
}

/* Grid container */
.excel-grid-container {
  flex: 1;
  overflow: auto;
}

/* Grid layout */
.excel-grid {
  display: grid;
  grid-template-columns: 50px 1fr;
  border: 1px solid #dee2e6;
  background: #fff;
}

/* Row numbers */
.excel-row-numbers {
  background: #f8f9fa;
  border-right: 1px solid #dee2e6;
  user-select: none;
}
.excel-row-number {
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 500;
  color: #6c757d;
  border-bottom: 1px solid #d0d0d0;
}

/* Table wrapper */
.excel-table-wrapper {
  overflow: auto;
}
.excel-table {
  width: 100%;
  border-collapse: collapse;
  table-layout: fixed;
}

/* Header cells */
.excel-header-cell {
  background: #f1f3f5;
  border-bottom: 1px solid #dee2e6;
  border-right: 1px solid #dee2e6;
  position: relative;
  height: 36px;
  text-align: center;
  font-weight: 600;
}
.excel-corner-cell {
  background: #e9ecef;
  border-right: 1px solid #dee2e6;
  border-bottom: 1px solid #dee2e6;
}
.excel-col-letter {
  font-weight: 600;
  color: #495057;
}
.excel-sort-icon {
  font-size: 12px;
}

/* Resize handle */
.excel-resize-handle {
  position: absolute;
  right: 0;
  top: 0;
  width: 5px;
  height: 100%;
  cursor: col-resize;
  background: transparent;
}
.excel-resize-handle:hover {
  background: rgba(13, 110, 253, 0.3);
}

/* Data cells */
.excel-data-cell {
  border-bottom: 1px solid #dee2e6;
  border-right: 1px solid #dee2e6;
  height: 32px;
  padding: 0 8px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.excel-select-cell {
  text-align: center;
}

/* Row selection & hover */
.excel-selected-row {
  background-color: #e3f2fd !important;
}
.excel-table tr:hover {
  background-color: #f5f5f5;
}

/* Bottom sheet tabs */
.excel-sheet-tabs {
  border-top: 1px solid #dee2e6;
}
.excel-sheet-tab {
  font-weight: 500;
  color: #495057;
  border-bottom: 2px solid transparent;
  transition: all 0.2s;
}
.excel-active-tab {
  color: #0d6efd !important;
  border-bottom-color: #0d6efd !important;
}
.excel-add-tab {
  color: #28a745;
}

/* Pagination */
.excel-pagination {
  background: #fff;
  border-top: 1px solid #dee2e6;
}

/* Badges */
.badge {
  font-size: 11px;
}
`;

// Inject CSS once (client-side only)
if (typeof document !== "undefined") {
  const styleSheet = document.createElement("style");
  styleSheet.textContent = excelStyles;
  document.head.appendChild(styleSheet);
}

export default Table;
