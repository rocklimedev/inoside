import React, { useState } from "react";
import * as XLSX from "xlsx";
import { useUploadInventoryExcelMutation } from "../../api/projectApi";
import { useNavigate } from "react-router-dom";
import {
  Card,
  Form,
  Input,
  Upload,
  Select,
  Button,
  Table,
  Typography,
  Space,
  message,
} from "antd";

import { UploadOutlined } from "@ant-design/icons";

const { Title, Text } = Typography;
const { Option } = Select;

const inventoryFields = [
  { key: "date_added", label: "Date Added" },
  { key: "item_name", label: "Item Name" },
  { key: "quantity", label: "Quantity" },
  { key: "in", label: "In" },
  { key: "out", label: "Out" },
  { key: "receiver_name", label: "Receiver Name" },
  { key: "vendorId", label: "Vendor ID" },
  { key: "remarks", label: "Remarks" },
];

const AddProject = () => {
  const [name, setName] = useState("");
  const [rows, setRows] = useState([]);
  const [columns, setColumns] = useState([]);
  const [mapping, setMapping] = useState({});
  const navigate = useNavigate();
  const [uploadProject, { isLoading }] = useUploadInventoryExcelMutation();

  const handleFileChange = async (file) => {
    const buffer = await file.arrayBuffer();
    const workbook = XLSX.read(buffer);
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const json = XLSX.utils.sheet_to_json(sheet, { defval: "" });

    setRows(json);

    if (json.length > 0) {
      const cols = Object.keys(json[0]);
      setColumns(cols);

      const autoMap = {};
      inventoryFields.forEach((field) => {
        const found = cols.find(
          (c) => c.toLowerCase() === field.key.toLowerCase(),
        );
        if (found) autoMap[field.key] = found;
      });

      setMapping(autoMap);
    }

    return false;
  };

  const handleMappingChange = (field, column) => {
    setMapping((prev) => ({ ...prev, [field]: column }));
  };

  const formatExcelDate = (value) => {
    // Excel serial number
    if (!isNaN(Number(value))) {
      const excelEpoch = new Date(1900, 0, 1);
      excelEpoch.setDate(excelEpoch.getDate() + Number(value) - 2); // Excel offset
      const day = String(excelEpoch.getDate()).padStart(2, "0");
      const month = String(excelEpoch.getMonth() + 1).padStart(2, "0");
      const year = excelEpoch.getFullYear();
      return `${day}/${month}/${year}`;
    }

    // Date object or string
    const date = new Date(value);
    if (!isNaN(date)) {
      const day = String(date.getDate()).padStart(2, "0");
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const year = date.getFullYear();
      return `${day}/${month}/${year}`;
    }

    return value; // fallback
  };

  const transformRows = () => {
    return rows.map((row) => {
      const obj = {};
      inventoryFields.forEach((field) => {
        const col = mapping[field.key];
        let value = col ? row[col] : null;

        if (field.key === "date_added" && value) {
          value = formatExcelDate(value);
        }

        obj[field.key] = value;
      });
      return obj;
    });
  };

  const handleSubmit = async () => {
    if (!name) {
      message.error("Project name required");
      return;
    }

    try {
      const mappedRows = transformRows();

      await uploadProject({
        name,
        inventory: mappedRows,
      }).unwrap();

      message.success("Project imported successfully");
      navigate("/"); // redirect to home or list page

      setName("");
      setRows([]);
      setColumns([]);
      setMapping({});
    } catch (err) {
      console.error(err);
      message.error("Upload failed");
    }
  };

  const previewColumns = columns.map((col) => ({
    title: col,
    dataIndex: col,
    key: col,
  }));

  return (
    <div style={{ padding: 24 }}>
      <Card>
        <Space direction="vertical" size="large" style={{ width: "100%" }}>
          <Title level={3}>Add Project</Title>

          <Form layout="vertical">
            <Form.Item label="Project Name" required>
              <Input
                placeholder="Project name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </Form.Item>

            <Form.Item label="Upload Excel">
              <Upload
                beforeUpload={handleFileChange}
                accept=".xlsx,.xls"
                showUploadList={false}
              >
                <Button icon={<UploadOutlined />}>Select Excel File</Button>
              </Upload>
            </Form.Item>
          </Form>

          {columns.length > 0 && (
            <Card size="small" title="Column Mapping">
              <Space direction="vertical" style={{ width: "100%" }}>
                {inventoryFields.map((field) => (
                  <Space
                    key={field.key}
                    style={{ width: "100%", justifyContent: "space-between" }}
                  >
                    <Text style={{ width: 200 }}>{field.label}</Text>

                    <Select
                      style={{ width: 250 }}
                      value={mapping[field.key] || undefined}
                      placeholder="Select column"
                      onChange={(val) => handleMappingChange(field.key, val)}
                    >
                      {columns.map((col) => (
                        <Option key={col} value={col}>
                          {col}
                        </Option>
                      ))}
                    </Select>
                  </Space>
                ))}
              </Space>
            </Card>
          )}

          {rows.length > 0 && (
            <Card size="small" title={`Excel Preview (${rows.length} rows)`}>
              <Table
                columns={previewColumns}
                dataSource={rows.slice(0, 20).map((r, i) => ({
                  ...r,
                  date_added:
                    mapping["date_added"] && r[mapping["date_added"]]
                      ? formatExcelDate(r[mapping["date_added"]])
                      : r["date_added"],
                  key: i,
                }))}
                rowKey="key"
                pagination={false}
                scroll={{ x: true, y: 400 }}
                bordered
                size="small"
              />
            </Card>
          )}

          <Button
            type="primary"
            size="large"
            loading={isLoading}
            onClick={handleSubmit}
          >
            Create Project
          </Button>
        </Space>
      </Card>
    </div>
  );
};

export default AddProject;
