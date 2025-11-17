import React, { useMemo, useState } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  flexRender,
  createColumnHelper,
} from "@tanstack/react-table";
import { saveAs } from "file-saver";
import * as XLSX from "xlsx";
import { format } from "date-fns";
import {
  FiPlus,
  FiDownload,
  FiSearch,
  FiGrid,
  FiList,
  FiEdit2,
  FiTrash2,
  FiPhone,
  FiMapPin,
  FiBriefcase,
  FiTag,
  FiRefreshCw,
  FiChevronLeft,
  FiChevronRight,
  FiChevronsLeft,
  FiChevronsRight,
} from "react-icons/fi";

import AddModal from "../Tabulars/AddModal";
import {
  useGetPersonsQuery,
  useDeletePersonMutation,
  useGetPersonTypesQuery,
} from "../../api/personApi";
import { useGetBrandCompaniesQuery } from "../../api/brandCompanyApi";

const columnHelper = createColumnHelper();

// Person Card Component (Bootstrap Card + Inline CSS)
const PersonCard = ({ person, onEdit, onDelete, isDeleting }) => {
  return (
    <div className="col-12 col-md-6 col-lg-4 col-xl-3 mb-4">
      <div
        className="card border-0 shadow-sm h-100"
        style={{
          borderRadius: "16px",
          overflow: "hidden",
          transition: "all 0.3s",
        }}
        onMouseEnter={(e) =>
          (e.currentTarget.style.boxShadow = "0 10px 30px rgba(0,0,0,0.15)")
        }
        onMouseLeave={(e) =>
          (e.currentTarget.style.boxShadow = "0 4px 15px rgba(0,0,0,0.08)")
        }
      >
        <div className="card-body p-4">
          <div className="d-flex justify-content-between align-items-start mb-3">
            <div className="d-flex align-items-center">
              <img
                src={`https://ui-avatars.com/api/?name=${encodeURIComponent(
                  person.name
                )}&background=6366f1&color=fff&bold=true&rounded=true&size=80`}
                alt={person.name}
                className="rounded-circle me-3"
                style={{
                  width: "60px",
                  height: "60px",
                  ring: "4px solid #e0e7ff",
                }}
              />
              <div>
                <h5 className="mb-1 fw-bold text-dark">{person.name}</h5>
                <div className="d-flex align-items-center text-muted small">
                  <FiPhone size={14} className="me-1" />
                  <span>{person.mobile_number}</span>
                  {person.optional_mobile && (
                    <>
                      <span className="mx-1">•</span>
                      <span>{person.optional_mobile}</span>
                    </>
                  )}
                </div>
              </div>
            </div>

            <div className="d-flex gap-2">
              <button
                onClick={() => onEdit(person)}
                className="btn btn-sm btn-outline-primary rounded-circle"
                style={{ width: "38px", height: "38px" }}
                title="Edit"
              >
                <FiEdit2 size={16} />
              </button>
              <button
                onClick={() => onDelete(person.id)}
                disabled={isDeleting}
                className="btn btn-sm btn-outline-danger rounded-circle"
                style={{ width: "38px", height: "38px" }}
                title="Delete"
              >
                <FiTrash2 size={16} />
              </button>
            </div>
          </div>

          <div className="mt-3">
            {person.type?.name && (
              <span
                className="badge rounded-pill me-2"
                style={{ backgroundColor: "#eef2ff", color: "#4f46e5" }}
              >
                <FiTag size={12} className="me-1" />
                {person.type.name}
              </span>
            )}
            {person.brandCompany?.name && (
              <span
                className="badge rounded-pill"
                style={{ backgroundColor: "#ecfdf5", color: "#059669" }}
              >
                <FiBriefcase size={12} className="me-1" />
                {person.brandCompany.name}
              </span>
            )}
          </div>

          {(person.company_name || person.position) && (
            <p className="text-muted small mt-3 mb-2">
              <strong>{person.company_name}</strong>
              {person.position && ` • ${person.position}`}
            </p>
          )}

          {person.address?.city && (
            <p className="text-muted small d-flex align-items-center">
              <FiMapPin size={14} className="me-1" />
              {person.address.city},{" "}
              {person.address.state || person.address.country}
            </p>
          )}

          <div className="mt-4 pt-3 border-top text-muted small">
            Added{" "}
            {person.created_at
              ? format(new Date(person.created_at), "dd MMM yyyy")
              : "Recently"}
          </div>
        </div>
      </div>
    </div>
  );
};

const Table = () => {
  const {
    data: persons = [],
    isLoading,
    refetch,
    isFetching,
  } = useGetPersonsQuery();
  const { data: personTypes = [] } = useGetPersonTypesQuery();
  const { data: brandCompanies = [] } = useGetBrandCompaniesQuery();
  const [deletePerson, { isLoading: isDeleting }] = useDeletePersonMutation();

  const [globalFilter, setGlobalFilter] = useState("");
  const [selectedType, setSelectedType] = useState("all");
  const [viewMode, setViewMode] = useState("card"); // 'card' or 'table'
  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(20);
  const [showModal, setShowModal] = useState(false);
  const [editingPerson, setEditingPerson] = useState(null);

  const filteredData = useMemo(() => {
    let data = persons;
    if (selectedType !== "all") {
      data = data.filter((p) => String(p.type_id) === selectedType);
    }
    return data;
  }, [persons, selectedType]);

  const columns = useMemo(
    () => [
      columnHelper.accessor("name", {
        header: "Name",
        cell: (info) => (
          <div className="d-flex align-items-center">
            <img
              src={`https://ui-avatars.com/api/?name=${encodeURIComponent(
                info.getValue()
              )}&background=6366f1&color=fff&size=40&rounded=true`}
              alt=""
              className="rounded-circle me-3"
              style={{ width: "40px", height: "40px" }}
            />
            <div>
              <div className="fw-semibold">{info.getValue()}</div>
              <small className="text-muted">
                {info.row.original.mobile_number}
              </small>
            </div>
          </div>
        ),
      }),
      columnHelper.accessor("type.name", {
        header: "Type",
        cell: (info) => (
          <span
            className="badge rounded-pill"
            style={{ backgroundColor: "#eef2ff", color: "#4f46e5" }}
          >
            {info.getValue() || "—"}
          </span>
        ),
      }),
      columnHelper.accessor("brandCompany.name", {
        header: "Brand",
        cell: (info) => (
          <span
            className="badge rounded-pill"
            style={{ backgroundColor: "#ecfdf5", color: "#059669" }}
          >
            {info.getValue() || "—"}
          </span>
        ),
      }),
      columnHelper.accessor("company_name", { header: "Company" }),
      columnHelper.accessor("position", { header: "Position" }),
      columnHelper.accessor("created_at", {
        header: "Added On",
        cell: (info) =>
          info.getValue()
            ? format(new Date(info.getValue()), "dd MMM yyyy")
            : "—",
      }),
      columnHelper.display({
        id: "actions",
        header: "Actions",
        cell: ({ row }) => (
          <div className="btn-group" role="group">
            <button
              onClick={() => {
                setEditingPerson(row.original);
                setShowModal(true);
              }}
              className="btn btn-sm btn-outline-primary"
            >
              <FiEdit2 size={14} />
            </button>
            <button
              onClick={() => handleDelete(row.original.id)}
              disabled={isDeleting}
              className="btn btn-sm btn-outline-danger"
            >
              <FiTrash2 size={14} />
            </button>
          </div>
        ),
      }),
    ],
    [isDeleting]
  );

  const table = useReactTable({
    data: filteredData,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    state: { globalFilter },
    onGlobalFilterChange: setGlobalFilter,
  });

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this person permanently?")) return;
    try {
      await deletePerson(id).unwrap();
      refetch();
    } catch {
      alert("Failed to delete");
    }
  };

  const exportToExcel = () => {
    const data = filteredData.map((p) => ({
      Name: p.name,
      Mobile: p.mobile_number,
      "Alt Mobile": p.optional_mobile || "",
      Type: p.type?.name || "",
      Brand: p.brandCompany?.name || "",
      Company: p.company_name || "",
      Position: p.position || "",
      City: p.address?.city || "",
      "Added On": p.created_at
        ? format(new Date(p.created_at), "dd-MM-yyyy")
        : "",
    }));

    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Directory");
    const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    const blob = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(blob, `Directory_${format(new Date(), "yyyy-MM-dd")}.xlsx`);
  };

  if (isLoading) {
    return (
      <div
        className="d-flex justify-content-center align-items-center"
        style={{ height: "80vh" }}
      >
        <div
          className="spinner-border text-primary"
          style={{ width: "4rem", height: "4rem" }}
          role="status"
        >
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  const paginatedData = filteredData.slice(
    pageIndex * pageSize,
    (pageIndex + 1) * pageSize
  );
  const totalPages = Math.ceil(filteredData.length / pageSize);

  return (
    <div
      className="container-fluid py-4"
      style={{ backgroundColor: "#f8fafc" }}
    >
      <div className="row">
        <div className="col-12">
          {/* Header */}
          <div className="d-flex flex-column flex-lg-row justify-content-between align-items-start align-items-lg-center mb-4 gap-3">
            <div>
              <h2 className="fw-bold text-dark mb-1">Persons Directory</h2>
              <p className="text-muted">
                {filteredData.length.toLocaleString()} contact
                {filteredData.length !== 1 ? "s" : ""}
              </p>
            </div>

            <div className="d-flex flex-wrap gap-2">
              <button
                onClick={() =>
                  setViewMode(viewMode === "card" ? "table" : "card")
                }
                className="btn btn-outline-secondary"
              >
                {viewMode === "card" ? (
                  <FiList size={20} />
                ) : (
                  <FiGrid size={20} />
                )}
              </button>

              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="form-select"
                style={{ width: "auto" }}
              >
                <option value="all">All Types</option>
                {personTypes.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.name}
                  </option>
                ))}
              </select>

              <button
                onClick={() => {
                  setEditingPerson(null);
                  setShowModal(true);
                }}
                className="btn btn-primary d-flex align-items-center gap-2"
              >
                <FiPlus size={20} /> Add Person
              </button>
            </div>
          </div>

          {/* Search & Actions */}
          <div className="row mb-4 g-3">
            <div className="col-lg-8">
              <div className="input-group">
                <span className="input-group-text bg-white border-end-0">
                  <FiSearch />
                </span>
                <input
                  type="text"
                  className="form-control border-start-0"
                  placeholder="Search by name, mobile, company..."
                  value={globalFilter}
                  onChange={(e) => setGlobalFilter(e.target.value)}
                  style={{ height: "50px" }}
                />
              </div>
            </div>
            <div className="col-lg-4 d-flex gap-2">
              <button
                onClick={exportToExcel}
                className="btn btn-success d-flex align-items-center gap-2"
              >
                <FiDownload /> Export
              </button>
              <button
                onClick={refetch}
                disabled={isFetching}
                className="btn btn-outline-secondary"
              >
                <FiRefreshCw
                  className={
                    isFetching ? "spinner-border spinner-border-sm" : ""
                  }
                />
              </button>
            </div>
          </div>

          {/* Content */}
          {/* Content */}
          {filteredData.length === 0 ? (
            <div className="text-center py-5">
              <div
                className="bg-light rounded-circle d-inline-flex align-items-center justify-content-center mb-4"
                style={{ width: "100px", height: "100px" }}
              >
                <FiSearch size={50} className="text-muted" />
              </div>
              <h4>No contacts found</h4>
              <p className="text-muted">
                Try adjusting your filters or add a new person.
              </p>
            </div>
          ) : (
            <>
              {/* Card or Table View */}
              {viewMode === "card" ? (
                <div className="row">
                  {paginatedData.map((person) => (
                    <PersonCard
                      key={person.id}
                      person={person}
                      onEdit={() => {
                        setEditingPerson(person);
                        setShowModal(true);
                      }}
                      onDelete={handleDelete}
                      isDeleting={isDeleting}
                    />
                  ))}
                </div>
              ) : (
                /* Table View */
                <div className="card border-0 shadow-sm">
                  <div className="table-responsive">
                    <table className="table table-hover align-middle mb-0">
                      <thead className="table-primary">
                        <tr>
                          {table.getHeaderGroups()[0].headers.map((header) => (
                            <th key={header.id} className="fw-semibold">
                              {flexRender(
                                header.column.columnDef.header,
                                header.getContext()
                              )}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {table
                          .getRowModel()
                          .rows.slice(
                            pageIndex * pageSize,
                            (pageIndex + 1) * pageSize
                          )
                          .map((row) => (
                            <tr key={row.id}>
                              {row.getVisibleCells().map((cell) => (
                                <td key={cell.id}>
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

              {/* Shared Pagination – Now visible in BOTH views */}
              {totalPages > 1 && (
                <div className="mt-4 d-flex justify-content-between align-items-center flex-wrap gap-3">
                  <div className="text-muted small">
                    Showing {pageIndex * pageSize + 1} to{" "}
                    {Math.min((pageIndex + 1) * pageSize, filteredData.length)}{" "}
                    of {filteredData.length} contacts
                  </div>

                  <div className="btn-group">
                    <button
                      className="btn btn-outline-primary"
                      onClick={() => setPageIndex(0)}
                      disabled={pageIndex === 0}
                    >
                      <FiChevronsLeft />
                    </button>
                    <button
                      className="btn btn-outline-primary"
                      onClick={() => setPageIndex(Math.max(0, pageIndex - 1))}
                      disabled={pageIndex === 0}
                    >
                      <FiChevronLeft />
                    </button>
                    <button className="btn btn-primary" disabled>
                      Page {pageIndex + 1} of {totalPages}
                    </button>
                    <button
                      className="btn btn-outline-primary"
                      onClick={() =>
                        setPageIndex(Math.min(totalPages - 1, pageIndex + 1))
                      }
                      disabled={pageIndex >= totalPages - 1}
                    >
                      <FiChevronRight />
                    </button>
                    <button
                      className="btn btn-outline-primary"
                      onClick={() => setPageIndex(totalPages - 1)}
                      disabled={pageIndex >= totalPages - 1}
                    >
                      <FiChevronsRight />
                    </button>
                  </div>

                  {/* Optional: Page Size Selector */}
                  <select
                    className="form-select"
                    style={{ width: "auto" }}
                    value={pageSize}
                    onChange={(e) => {
                      setPageSize(Number(e.target.value));
                      setPageIndex(0);
                    }}
                  >
                    {[10, 20, 30, 50, 100].map((size) => (
                      <option key={size} value={size}>
                        Show {size}
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </>
          )}
          {/* Modal */}
          <AddModal
            show={showModal}
            onHide={() => {
              setShowModal(false);
              setEditingPerson(null);
            }}
            editingPerson={editingPerson}
            personTypes={personTypes}
            brandCompanies={brandCompanies}
            onSuccess={refetch}
          />
        </div>
      </div>
    </div>
  );
};

export default Table;
