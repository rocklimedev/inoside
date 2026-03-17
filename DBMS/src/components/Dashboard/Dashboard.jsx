// src/pages/Table.jsx
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
  Space,
  Pagination,
  message,
  Spin,
  Empty,
  Tag,
  Popconfirm,
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
} from "@ant-design/icons";

import {
  useGetPersonsQuery,
  useDeletePersonMutation,
  useGetPersonTypesQuery,
} from "../../api/personApi";

import { useGetBrandCompaniesQuery } from "../../api/brandCompanyApi";

const { Option } = Select;

/* ------------------------------------------------ */
/* PERSON CARD */
/* ------------------------------------------------ */

const PersonCard = ({ person, onEdit, onDelete, deleting }) => {
  return (
    <div className="col-lg-3 col-md-4 col-sm-6 mb-4">
      <div className="card shadow-sm border-0 h-100">
        <div className="card-body">
          <div className="d-flex justify-content-between">
            <Space>
              <Avatar
                size={50}
                src={`https://ui-avatars.com/api/?name=${encodeURIComponent(
                  person.name,
                )}&background=6366f1&color=fff`}
              />

              <div>
                <div className="fw-bold">{person.name}</div>
                <small>{person.mobile_number}</small>
              </div>
            </Space>

            <Space>
              <Button
                icon={<EditOutlined />}
                size="small"
                onClick={() => onEdit(person)}
              />

              <Popconfirm
                title="Delete contact?"
                onConfirm={() => onDelete(person.id)}
              >
                <Button
                  icon={<DeleteOutlined />}
                  size="small"
                  danger
                  loading={deleting}
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

          <div className="mt-3 text-muted small">
            {person.company_name || "—"}
          </div>

          <div className="text-muted small">{person.address?.city || "—"}</div>

          <div className="mt-3 small text-muted">
            Added{" "}
            {person.created_at
              ? format(new Date(person.created_at), "dd MMM yyyy")
              : ""}
          </div>
        </div>
      </div>
    </div>
  );
};

/* ------------------------------------------------ */
/* MAIN COMPONENT */
/* ------------------------------------------------ */

const Table = () => {
  const {
    data: persons = [],
    isLoading,
    refetch,
    isFetching,
  } = useGetPersonsQuery();

  const { data: personTypes = [] } = useGetPersonTypesQuery();
  const { data: brandCompanies = [] } = useGetBrandCompaniesQuery();

  const [deletePerson, { isLoading: deleting }] = useDeletePersonMutation();

  const [viewMode, setViewMode] = useState("card");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);

  const [showModal, setShowModal] = useState(false);
  const [editingPerson, setEditingPerson] = useState(null);

  const [filters, setFilters] = useState({
    search: "",
    type: "all",
    brand: "all",
    city: "",
  });

  /* ------------------------------------------------ */
  /* FILTERED DATA */
  /* ------------------------------------------------ */

  const filteredData = useMemo(() => {
    let data = persons;

    if (filters.search) {
      const term = filters.search.toLowerCase();

      data = data.filter(
        (p) =>
          p.name?.toLowerCase().includes(term) ||
          p.mobile_number?.includes(term) ||
          p.company_name?.toLowerCase().includes(term),
      );
    }

    if (filters.type !== "all") {
      data = data.filter((p) => String(p.type_id) === filters.type);
    }

    if (filters.brand !== "all") {
      data = data.filter((p) => String(p.brand_company_id) === filters.brand);
    }

    if (filters.city) {
      data = data.filter((p) =>
        p.address?.city?.toLowerCase().includes(filters.city.toLowerCase()),
      );
    }

    return data;
  }, [persons, filters]);

  /* Reset page when filters change */

  useEffect(() => {
    setCurrentPage(1);
  }, [filters]);

  /* ------------------------------------------------ */
  /* PAGINATION */
  /* ------------------------------------------------ */

  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredData.slice(start, start + pageSize);
  }, [filteredData, currentPage, pageSize]);

  /* ------------------------------------------------ */
  /* EXPORT */
  /* ------------------------------------------------ */

  const exportExcel = () => {
    const data = filteredData.map((p, i) => ({
      "S.No": i + 1,
      Name: p.name,
      Mobile: p.mobile_number,
      Type: p.type?.name || "",
      Brand: p.brandCompany?.name || "",
      Company: p.company_name || "",
      City: p.address?.city || "",
      "Added On": p.created_at
        ? format(new Date(p.created_at), "dd-MM-yyyy")
        : "",
    }));

    const ws = XLSX.utils.json_to_sheet(data);

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Contacts");

    const excelBuffer = XLSX.write(wb, {
      bookType: "xlsx",
      type: "array",
    });

    const blob = new Blob([excelBuffer]);

    saveAs(blob, "contacts.xlsx");

    message.success("Exported successfully");
  };

  /* ------------------------------------------------ */
  /* DELETE */
  /* ------------------------------------------------ */

  const handleDelete = async (id) => {
    try {
      await deletePerson(id).unwrap();

      message.success("Deleted");

      refetch();
    } catch {
      message.error("Failed");
    }
  };

  /* ------------------------------------------------ */
  /* TABLE COLUMNS */
  /* ------------------------------------------------ */

  const columns = [
    {
      title: "S.No",
      width: 70,
      render: (_, __, index) => index + 1 + (currentPage - 1) * pageSize,
    },

    {
      title: "Name",
      render: (_, record) => (
        <Space>
          <Avatar
            src={`https://ui-avatars.com/api/?name=${encodeURIComponent(
              record.name,
            )}`}
          />

          <div>
            <div className="fw-semibold">{record.name}</div>
            <small>{record.mobile_number}</small>
          </div>
        </Space>
      ),
    },

    {
      title: "Type",
      render: (_, record) =>
        record.type?.name ? (
          <Badge color="purple" text={record.type.name} />
        ) : (
          "—"
        ),
    },

    {
      title: "Brand",
      render: (_, record) =>
        record.brandCompany?.name ? (
          <Badge color="green" text={record.brandCompany.name} />
        ) : (
          "—"
        ),
    },

    {
      title: "Company",
      dataIndex: "company_name",
      render: (t) => t || "—",
    },

    {
      title: "City",
      render: (_, record) => record.address?.city || "—",
    },

    {
      title: "Added",
      render: (_, record) =>
        record.created_at
          ? format(new Date(record.created_at), "dd MMM yyyy")
          : "—",
    },

    {
      title: "Actions",
      render: (_, record) => (
        <Space>
          <Button
            icon={<EditOutlined />}
            size="small"
            onClick={() => {
              setEditingPerson(record);
              setShowModal(true);
            }}
          />

          <Popconfirm
            title="Delete contact?"
            onConfirm={() => handleDelete(record.id)}
          >
            <Button icon={<DeleteOutlined />} danger size="small" />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  /* ------------------------------------------------ */
  /* LOADING */
  /* ------------------------------------------------ */

  if (isLoading) {
    return (
      <div className="text-center p-5">
        <Spin size="large" />
      </div>
    );
  }

  /* ------------------------------------------------ */
  /* UI */
  /* ------------------------------------------------ */

  return (
    <>
      {/* HEADER */}

      <div className="d-flex justify-content-between mb-4">
        <div>
          <h3>Sales Directory</h3>
          <small>{filteredData.length} contacts</small>
        </div>

        <Space>
          <Button
            icon={
              viewMode === "card" ? (
                <UnorderedListOutlined />
              ) : (
                <AppstoreOutlined />
              )
            }
            onClick={() => setViewMode(viewMode === "card" ? "table" : "card")}
          />

          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => {
              setEditingPerson(null);
              setShowModal(true);
            }}
          >
            Add
          </Button>
        </Space>
      </div>

      {/* FILTERS */}

      <div className="card mb-4">
        <div className="card-body">
          <div className="row g-3">
            <div className="col-lg-4">
              <Input
                prefix={<SearchOutlined />}
                placeholder="Search"
                value={filters.search}
                onChange={(e) =>
                  setFilters({
                    ...filters,
                    search: e.target.value,
                  })
                }
              />
            </div>

            <div className="col-lg-2">
              <Select
                style={{ width: "100%" }}
                value={filters.type}
                onChange={(v) => setFilters({ ...filters, type: v })}
              >
                <Option value="all">All Types</Option>

                {personTypes.map((t) => (
                  <Option key={t.id} value={t.id}>
                    {t.name}
                  </Option>
                ))}
              </Select>
            </div>

            <div className="col-lg-2">
              <Select
                style={{ width: "100%" }}
                value={filters.brand}
                onChange={(v) => setFilters({ ...filters, brand: v })}
              >
                <Option value="all">All Brands</Option>

                {brandCompanies.map((b) => (
                  <Option key={b.id} value={b.id}>
                    {b.name}
                  </Option>
                ))}
              </Select>
            </div>

            <div className="col-lg-2">
              <Input
                placeholder="City"
                value={filters.city}
                onChange={(e) =>
                  setFilters({
                    ...filters,
                    city: e.target.value,
                  })
                }
              />
            </div>

            <div className="col-lg-2">
              <Space>
                <Button icon={<DownloadOutlined />} onClick={exportExcel}>
                  Export
                </Button>

                <Button
                  icon={<ReloadOutlined spin={isFetching} />}
                  onClick={refetch}
                />
              </Space>
            </div>
          </div>
        </div>
      </div>

      {/* CONTENT */}

      {filteredData.length === 0 ? (
        <Empty description="No contacts" />
      ) : viewMode === "card" ? (
        <div className="row">
          {paginatedData.map((p) => (
            <PersonCard
              key={p.id}
              person={p}
              onEdit={(p) => {
                setEditingPerson(p);
                setShowModal(true);
              }}
              onDelete={handleDelete}
              deleting={deleting}
            />
          ))}
        </div>
      ) : (
        <AntTable
          columns={columns}
          dataSource={paginatedData}
          rowKey="id"
          pagination={false}
        />
      )}

      {/* PAGINATION */}

      <div className="mt-4">
        <Pagination
          current={currentPage}
          pageSize={pageSize}
          total={filteredData.length}
          showSizeChanger
          onChange={(page, size) => {
            setCurrentPage(page);
            setPageSize(size);
          }}
        />
      </div>

      {/* MODAL */}

      <AddEditModal
        open={showModal}
        editingPerson={editingPerson}
        onCancel={() => {
          setShowModal(false);
          setEditingPerson(null);
        }}
        onSuccess={refetch}
      />
    </>
  );
};

export default Table;
