// src/pages/Table.jsx (or wherever your Table component is)
import React, { useMemo, useState, useEffect } from "react";
import { saveAs } from "file-saver";
import * as XLSX from "xlsx";
import { format } from "date-fns";
import AddEditModal from "../Tabulars/AddModal";
import {
  Table as AntTable,
  Avatar,
  Badge,
  Button,
  Input,
  Select,
  DatePicker,
  Space,
  Pagination,
  message,
  Spin,
  Empty,
  Tag,
  Popconfirm,
  Typography,
} from "antd";
import {
  PlusOutlined,
  DownloadOutlined,
  SearchOutlined,
  ReloadOutlined,
  EditOutlined,
  DeleteOutlined,
  UnorderedListOutlined,
  AppstoreOutlined,
  FilterOutlined,
  CheckOutlined,
  CloseOutlined,
} from "@ant-design/icons";

import {
  useGetPersonsQuery,
  useDeletePersonMutation,
  useGetPersonTypesQuery,
  useUpdatePersonTypeMutation,
} from "../../api/personApi";
import {
  useGetBrandCompaniesQuery,
  useUpdateBrandCompanyMutation,
} from "../../api/brandCompanyApi";

const { Option } = Select;
const { Text } = Typography;

const PersonCard = ({ person, onEdit, onDelete, isDeleting }) => {
  // ... your existing PersonCard (unchanged)
  return (
    <div className="col-12 col-md-6 col-lg-4 col-xl-3 mb-4">
      <div
        className="card border-0 shadow-sm h-100 hover-shadow-lg transition-all"
        style={{ borderRadius: "16px", overflow: "hidden" }}
      >
        <div className="card-body p-4">
          <div className="d-flex justify-content-between align-items-start mb-3">
            <div className="d-flex align-items-center">
              <Avatar
                size={60}
                src={`https://ui-avatars.com/api/?name=${encodeURIComponent(
                  person.name
                )}&background=6366f1&color=fff&bold=true&rounded=true&size=80`}
                className="me-3 border border-3 border-indigo-100"
              />
              <div>
                <h5 className="mb-1 fw-bold text-dark">{person.name}</h5>
                <div className="d-flex align-items-center text-muted small">
                  Phone: {person.mobile_number}
                  {person.optional_mobile && <> • {person.optional_mobile}</>}
                </div>
              </div>
            </div>
            <Space>
              <Button
                size="small"
                icon={<EditOutlined />}
                onClick={() => onEdit(person)}
                type="text"
                className="text-primary"
              />
              <Popconfirm
                title="Delete this contact?"
                onConfirm={() => onDelete(person.id)}
                okText="Yes"
                cancelText="No"
              >
                <Button
                  size="small"
                  icon={<DeleteOutlined />}
                  danger
                  loading={isDeleting}
                  type="text"
                />
              </Popconfirm>
            </Space>
          </div>

          <div className="mt-3">
            {person.type?.name && <Tag color="purple">{person.type.name}</Tag>}
            {person.brandCompany?.name && (
              <Tag color="green">{person.brandCompany.name}</Tag>
            )}
          </div>

          {(person.company_name || person.position) && (
            <p className="text-muted small mt-3 mb-2">
              <strong>{person.company_name || "—"}</strong>
              {person.position && ` • ${person.position}`}
            </p>
          )}

          {person.address?.city && (
            <p className="text-muted small d-flex align-items-center">
              Location: {person.address.city}, {person.address.state || "India"}
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

  // Mutations for inline edit
  const [updatePersonType] = useUpdatePersonTypeMutation();
  const [updateBrandCompany] = useUpdateBrandCompanyMutation();

  const [viewMode, setViewMode] = useState("card");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [showModal, setShowModal] = useState(false);
  const [editingPerson, setEditingPerson] = useState(null);

  // Inline editing states
  const [editingTypeId, setEditingTypeId] = useState(null);
  const [editingTypeName, setEditingTypeName] = useState("");
  const [editingBrandId, setEditingBrandId] = useState(null);
  const [editingBrandName, setEditingBrandName] = useState("");

  const [filters, setFilters] = useState({
    search: "",
    type: "all",
    brand: "all",
    city: "",
    dateFrom: null,
    dateTo: null,
  });

  const filteredData = useMemo(() => {
    let data = persons;
    if (filters.search) {
      const term = filters.search.toLowerCase();
      data = data.filter(
        (p) =>
          p.name.toLowerCase().includes(term) ||
          p.mobile_number.includes(term) ||
          p.company_name?.toLowerCase().includes(term) ||
          p.optional_mobile?.includes(term)
      );
    }
    if (filters.type !== "all")
      data = data.filter((p) => String(p.type_id) === filters.type);
    if (filters.brand !== "all")
      data = data.filter((p) => String(p.brand_company_id) === filters.brand);
    if (filters.city)
      data = data.filter((p) =>
        p.address?.city?.toLowerCase().includes(filters.city.toLowerCase())
      );
    if (filters.dateFrom)
      data = data.filter(
        (p) => new Date(p.created_at) >= filters.dateFrom.startOf("day")
      );
    if (filters.dateTo)
      data = data.filter(
        (p) => new Date(p.created_at) <= filters.dateTo.endOf("day")
      );
    return data;
  }, [persons, filters]);

  const exportToExcel = () => {
    const data = filteredData.map((p, i) => ({
      "S.No": i + 1,
      Name: p.name,
      Mobile: p.mobile_number,
      "Alt Mobile": p.optional_mobile || "",
      Type: p.type?.name || "",
      Brand: p.brandCompany?.name || "",
      Company: p.company_name || "",
      Position: p.position || "",
      City: p.address?.city || "",
      State: p.address?.state || "",
      "Added On": p.created_at
        ? format(new Date(p.created_at), "dd-MM-yyyy")
        : "",
    }));
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Sales Directory");
    const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    const blob = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(blob, `Sales_Directory_${format(new Date(), "yyyy-MM-dd")}.xlsx`);
    message.success("Exported successfully!");
  };

  const handleDelete = async (id) => {
    try {
      await deletePerson(id).unwrap();
      message.success("Contact deleted");
      refetch();
    } catch (err) {
      message.error("Failed to delete");
    }
  };

  const clearFilters = () => {
    setFilters({
      search: "",
      type: "all",
      brand: "all",
      city: "",
      dateFrom: null,
      dateTo: null,
    });
    message.info("Filters cleared");
  };

  const hasActiveFilters = Object.values(filters).some(
    (v) => v !== "" && v !== "all" && v !== null
  );

  // Ant Design Table Columns
  const columns = [
    {
      title: "S.No",
      width: 70,
      render: (_, __, index) => index + 1 + (currentPage - 1) * pageSize,
    },
    {
      title: "Name",
      render: (record) => (
        <Space>
          <Avatar
            src={`https://ui-avatars.com/api/?name=${encodeURIComponent(
              record.name
            )}&background=6366f1&color=fff&size=40&rounded=true`}
          />
          <div>
            <div className="fw-semibold">{record.name}</div>
            <small className="text-muted">{record.mobile_number}</small>
          </div>
        </Space>
      ),
    },
    {
      title: "Type",
      render: (record) =>
        record.type?.name ? (
          <Badge status="processing" color="purple" text={record.type.name} />
        ) : (
          "—"
        ),
    },
    {
      title: "Brand",
      render: (record) =>
        record.brandCompany?.name ? (
          <Badge
            status="success"
            color="green"
            text={record.brandCompany.name}
          />
        ) : (
          "—"
        ),
    },
    { title: "Company", dataIndex: "company_name", render: (t) => t || "—" },
    { title: "Position", dataIndex: "position", render: (t) => t || "—" },
    {
      title: "City",
      render: (record) => record.address?.city || "—",
    },
    {
      title: "Added On",
      render: (record) =>
        record.created_at
          ? format(new Date(record.created_at), "dd MMM yyyy")
          : "—",
    },
    {
      title: "Actions",
      width: 100,
      render: (record) => (
        <Space>
          <Button
            size="small"
            icon={<EditOutlined />}
            onClick={() => {
              setEditingPerson(record);
              setShowModal(true);
            }}
          />
          <Popconfirm
            title="Delete contact?"
            onConfirm={() => handleDelete(record.id)}
            okText="Yes"
            cancelText="No"
          >
            <Button
              size="small"
              danger
              icon={<DeleteOutlined />}
              loading={isDeleting}
            />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  // Inline Edit Handlers
  const startEditType = (id, name) => {
    setEditingTypeId(id);
    setEditingTypeName(name);
    setEditingBrandId(null);
  };

  const startEditBrand = (id, name) => {
    setEditingBrandId(id);
    setEditingBrandName(name);
    setEditingTypeId(null);
  };

  const saveType = async () => {
    if (!editingTypeName.trim()) return message.warning("Name required");
    try {
      await updatePersonType({
        id: editingTypeId,
        name: editingTypeName.trim(),
      }).unwrap();
      message.success("Type updated");
      setEditingTypeId(null);
    } catch (err) {
      message.error("Failed to update");
    }
  };

  const saveBrand = async () => {
    if (!editingBrandName.trim()) return message.warning("Name required");
    try {
      await updateBrandCompany({
        id: editingBrandId,
        name: editingBrandName.trim(),
      }).unwrap();
      message.success("Brand updated");
      setEditingBrandId(null);
    } catch (err) {
      message.error("Failed to update");
    }
  };

  if (isLoading)
    return (
      <div
        className="d-flex justify-content-center align-items-center"
        style={{ height: "80vh" }}
      >
        <Spin size="large" tip="Loading..." />
      </div>
    );

  const paginatedData = filteredData.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  return (
    <>
      <div className="row gx-3 gy-3">
        {/* Header */}
        <div className="d-flex flex-column flex-lg-row justify-content-between align-items-start align-items-lg-center mb-4 gap-3">
          <div>
            <h2 className="fw-bold text-dark mb-1">Sales Directory</h2>
            <p className="text-muted">
              {filteredData.length.toLocaleString()} contact
              {filteredData.length !== 1 ? "s" : ""}
            </p>
          </div>
          <Space wrap>
            <Button
              icon={
                viewMode === "card" ? (
                  <UnorderedListOutlined />
                ) : (
                  <AppstoreOutlined />
                )
              }
              onClick={() =>
                setViewMode(viewMode === "card" ? "table" : "card")
              }
            />
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => {
                setEditingPerson(null);
                setShowModal(true);
              }}
            >
              Add Contact
            </Button>
          </Space>
        </div>

        {/* Filters */}
        <div className="card border-0 shadow-sm mb-4">
          <div className="card-body">
            <div className="row g-3 align-items-end">
              <div className="col-lg-4">
                <Input
                  prefix={<SearchOutlined />}
                  placeholder="Search..."
                  value={filters.search}
                  onChange={(e) =>
                    setFilters({ ...filters, search: e.target.value })
                  }
                  allowClear
                />
              </div>

              {/* Person Type Filter with Edit */}
              <div className="col-lg-2">
                <Select
                  style={{ width: "100%" }}
                  value={filters.type}
                  onChange={(v) => setFilters({ ...filters, type: v })}
                >
                  <Option value="all">All Types</Option>
                  {personTypes.map((t) => (
                    <Option key={t.id} value={t.id}>
                      <Space>
                        {editingTypeId === t.id ? (
                          <>
                            <Input
                              size="small"
                              value={editingTypeName}
                              onChange={(e) =>
                                setEditingTypeName(e.target.value)
                              }
                              onClick={(e) => e.stopPropagation()}
                            />
                            <Button
                              size="small"
                              type="text"
                              icon={<CheckOutlined />}
                              onClick={saveType}
                            />
                            <Button
                              size="small"
                              type="text"
                              icon={<CloseOutlined />}
                              onClick={() => setEditingTypeId(null)}
                            />
                          </>
                        ) : (
                          <>
                            {t.name}
                            <EditOutlined
                              className="text-muted"
                              style={{ fontSize: 12 }}
                              onClick={(e) => {
                                e.stopPropagation();
                                startEditType(t.id, t.name);
                              }}
                            />
                          </>
                        )}
                      </Space>
                    </Option>
                  ))}
                </Select>
              </div>

              {/* Brand Filter with Edit */}
              <div className="col-lg-2">
                <Select
                  style={{ width: "100%" }}
                  value={filters.brand}
                  onChange={(v) => setFilters({ ...filters, brand: v })}
                >
                  <Option value="all">All Brands</Option>
                  {brandCompanies.map((b) => (
                    <Option key={b.id} value={b.id}>
                      <Space>
                        {editingBrandId === b.id ? (
                          <>
                            <Input
                              size="small"
                              value={editingBrandName}
                              onChange={(e) =>
                                setEditingBrandName(e.target.value)
                              }
                              onClick={(e) => e.stopPropagation()}
                            />
                            <Button
                              size="small"
                              type="text"
                              icon={<CheckOutlined />}
                              onClick={saveBrand}
                            />
                            <Button
                              size="small"
                              type="text"
                              icon={<CloseOutlined />}
                              onClick={() => setEditingBrandId(null)}
                            />
                          </>
                        ) : (
                          <>
                            {b.name}
                            <EditOutlined
                              className="text-muted"
                              style={{ fontSize: 12 }}
                              onClick={(e) => {
                                e.stopPropagation();
                                startEditBrand(b.id, b.name);
                              }}
                            />
                          </>
                        )}
                      </Space>
                    </Option>
                  ))}
                </Select>
              </div>

              {/* Rest of filters */}
              <div className="col-md-2">
                <Input
                  placeholder="City"
                  value={filters.city}
                  onChange={(e) =>
                    setFilters({ ...filters, city: e.target.value })
                  }
                />
              </div>

              <div className="col-md-2 d-flex gap-2">
                {hasActiveFilters && (
                  <Button danger onClick={clearFilters}>
                    Clear
                  </Button>
                )}
                <Button
                  type="primary"
                  icon={<DownloadOutlined />}
                  onClick={exportToExcel}
                >
                  Export
                </Button>
                <Button
                  icon={<ReloadOutlined spin={isFetching} />}
                  onClick={refetch}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        {filteredData.length === 0 ? (
          <div className="text-center py-5">
            <Empty description="No contacts found" />
            <p className="text-muted mt-3">
              Try adjusting filters or add a new contact.
            </p>
          </div>
        ) : (
          <>
            {viewMode === "card" ? (
              <div className="row">
                {paginatedData.map((person) => (
                  <PersonCard
                    key={person.id}
                    person={person}
                    onEdit={(p) => {
                      setEditingPerson(p);
                      setShowModal(true);
                    }}
                    onDelete={handleDelete}
                    isDeleting={isDeleting}
                  />
                ))}
              </div>
            ) : (
              <div className="card border-0 shadow-sm">
                <AntTable
                  columns={columns}
                  dataSource={paginatedData}
                  rowKey="id"
                  pagination={false}
                  scroll={{ x: 1000 }}
                />
              </div>
            )}

            {filteredData.length > 0 && (
              <div className="mt-4 p-4 bg-white border-top shadow-sm rounded-bottom sticky-bottom-pagination">
                <div className="d-flex flex-column flex-md-row justify-content-between align-items-center gap-3">
                  <div className="text-muted small">
                    Showing <strong>{(currentPage - 1) * pageSize + 1}</strong>{" "}
                    to{" "}
                    <strong>
                      {Math.min(currentPage * pageSize, filteredData.length)}
                    </strong>{" "}
                    of <strong>{filteredData.length.toLocaleString()}</strong>{" "}
                    contacts
                  </div>

                  <Pagination
                    current={currentPage}
                    pageSize={pageSize}
                    total={filteredData.length}
                    onChange={(page, size) => {
                      setCurrentPage(page);
                      if (size !== pageSize) setPageSize(size);
                      // Optional: scroll to top of list
                      window.scrollTo({ top: 0, behavior: "smooth" });
                    }}
                    showSizeChanger
                    pageSizeOptions={[12, 20, 50, 100]}
                    showQuickJumper={{
                      goButton: <Button size="small">Go</Button>,
                    }}
                    className="mb-0"
                  />
                </div>
              </div>
            )}
          </>
        )}

        <AddEditModal
          open={showModal}
          onCancel={() => {
            setShowModal(false);
            setEditingPerson(null);
          }}
          editingPerson={editingPerson}
          onSuccess={refetch}
        />
      </div>
    </>
  );
};

export default Table;
