import React, { useState, useMemo } from "react";
import { useParams } from "react-router-dom";
import {
  useGetProjectByIdQuery,
  useCreateInventoryRecordInProjectMutation,
} from "../../api/projectApi";
import {
  Card,
  Form,
  Input,
  InputNumber,
  DatePicker,
  Button,
  Table,
  Space,
  Typography,
  Row,
  Col,
  Divider,
  Spin,
  Alert,
  Modal,
} from "antd";
import dayjs from "dayjs";

const { Title, Text } = Typography;

const DateRangeFilter = ({
  label,
  fromValue,
  toValue,
  onFromChange,
  onToChange,
}) => {
  return (
    <>
      <Col xs={12} sm={8} md={6}>
        <Text strong>{label} From</Text>
        <DatePicker
          style={{ width: "100%", marginTop: 4 }}
          value={fromValue ? dayjs(fromValue) : null}
          onChange={(_, dateString) => onFromChange(dateString || null)}
          format="YYYY-MM-DD"
          allowClear
        />
      </Col>

      <Col xs={12} sm={8} md={6}>
        <Text strong>{label} To</Text>
        <DatePicker
          style={{ width: "100%", marginTop: 4 }}
          value={toValue ? dayjs(toValue) : null}
          onChange={(_, dateString) => onToChange(dateString || null)}
          format="YYYY-MM-DD"
          allowClear
        />
      </Col>
    </>
  );
};

const ProjectDetails = () => {
  const { id } = useParams();

  const { data: project, isLoading, isError } = useGetProjectByIdQuery(id);

  const [createInventory, { isLoading: isCreating }] =
    useCreateInventoryRecordInProjectMutation();

  const [form] = Form.useForm();

  const [searchTerm, setSearchTerm] = useState("");

  const [dateFilters, setDateFilters] = useState({
    date_added_from: null,
    date_added_to: null,
    createdAt_from: null,
    createdAt_to: null,
    updatedAt_from: null,
    updatedAt_to: null,
  });

  const [modalVisible, setModalVisible] = useState(false);

  const inventories = project?.inventories ?? [];
  const name = project?.name ?? "";

  const onFinish = async (values) => {
    try {
      await createInventory({
        projectId: id,
        inventory: [
          {
            ...values,
            quantity: Number(values.quantity),
            date_added: values.date_added
              ? values.date_added.format("YYYY-MM-DD")
              : null,
          },
        ],
      }).unwrap();

      form.resetFields();
      setModalVisible(false);
    } catch (err) {
      console.error("Failed to add inventory:", err);
    }
  };

  const handleCancel = () => {
    form.resetFields();
    setModalVisible(false);
  };

  const filteredData = useMemo(() => {
    let result = inventories;

    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();

      result = result.filter((item) =>
        [
          item.item_name,
          item.receiver_name,
          item.vendorId,
          item.remarks,
          item.in,
          item.out,
        ].some((val) => val?.toLowerCase()?.includes(term)),
      );
    }

    const checkRange = (value, from, to) => {
      if (!value || value === "0000-00-00") return true;

      const d = dayjs(value);

      if (!d.isValid()) return true;

      if (from && d.isBefore(dayjs(from), "day")) return false;

      if (to && d.isAfter(dayjs(to), "day")) return false;

      return true;
    };

    return result.filter(
      (item) =>
        checkRange(
          item.date_added,
          dateFilters.date_added_from,
          dateFilters.date_added_to,
        ) &&
        checkRange(
          item.createdAt,
          dateFilters.createdAt_from,
          dateFilters.createdAt_to,
        ) &&
        checkRange(
          item.updatedAt,
          dateFilters.updatedAt_from,
          dateFilters.updatedAt_to,
        ),
    );
  }, [inventories, searchTerm, dateFilters]);

  const columns = [
    {
      title: "Item Name",
      dataIndex: "item_name",
      key: "item_name",
      ellipsis: true,
    },
    {
      title: "Date Added",
      dataIndex: "date_added",
      key: "date_added",
      sorter: (a, b) =>
        (a.date_added && a.date_added !== "0000-00-00"
          ? dayjs(a.date_added).valueOf()
          : 0) -
        (b.date_added && b.date_added !== "0000-00-00"
          ? dayjs(b.date_added).valueOf()
          : 0),
      render: (val) => (val && val !== "0000-00-00" ? val : "-"),
    },
    {
      title: "In",
      dataIndex: "in",
      key: "in",
      render: (v) => v || "-",
    },
    {
      title: "Out",
      dataIndex: "out",
      key: "out",
      render: (v) => v || "-",
    },
    {
      title: "Receiver",
      dataIndex: "receiver_name",
      key: "receiver_name",
      ellipsis: true,
    },
    {
      title: "Vendor",
      dataIndex: "vendorId",
      key: "vendorId",
      ellipsis: true,
    },
    {
      title: "Quantity",
      dataIndex: "quantity",
      key: "quantity",
      sorter: (a, b) => (a.quantity || 0) - (b.quantity || 0),
      align: "right",
    },
    {
      title: "Remarks",
      dataIndex: "remarks",
      key: "remarks",
      ellipsis: true,
    },
  ];

  return (
    <div style={{ padding: 24, background: "#f0f2f5", minHeight: "100vh" }}>
      {isLoading ? (
        <Spin fullscreen tip="Loading project..." />
      ) : isError || !project ? (
        <Alert
          message="Error"
          description="Project not found or failed to load."
          type="error"
          showIcon
        />
      ) : (
        <Card>
          <Space direction="vertical" size="middle" style={{ width: "100%" }}>
            <Title level={3}>{name || "Project Details"}</Title>

            <Button type="primary" onClick={() => setModalVisible(true)}>
              Add New Inventory Item
            </Button>

            <Divider />

            <Card>
              <Space
                direction="vertical"
                size="middle"
                style={{ width: "100%" }}
              >
                <Title level={5}>Inventory Records</Title>

                <Row gutter={[16, 16]}>
                  <Col xs={24} md={12} lg={8}>
                    <Input.Search
                      placeholder="Search item, receiver, vendor, remarks..."
                      allowClear
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      size="large"
                    />
                  </Col>

                  <DateRangeFilter
                    label="Date Added"
                    fromValue={dateFilters.date_added_from}
                    toValue={dateFilters.date_added_to}
                    onFromChange={(val) =>
                      setDateFilters((p) => ({ ...p, date_added_from: val }))
                    }
                    onToChange={(val) =>
                      setDateFilters((p) => ({ ...p, date_added_to: val }))
                    }
                  />

                  <DateRangeFilter
                    label="Created At"
                    fromValue={dateFilters.createdAt_from}
                    toValue={dateFilters.createdAt_to}
                    onFromChange={(val) =>
                      setDateFilters((p) => ({ ...p, createdAt_from: val }))
                    }
                    onToChange={(val) =>
                      setDateFilters((p) => ({ ...p, createdAt_to: val }))
                    }
                  />

                  <DateRangeFilter
                    label="Updated At"
                    fromValue={dateFilters.updatedAt_from}
                    toValue={dateFilters.updatedAt_to}
                    onFromChange={(val) =>
                      setDateFilters((p) => ({ ...p, updatedAt_from: val }))
                    }
                    onToChange={(val) =>
                      setDateFilters((p) => ({ ...p, updatedAt_to: val }))
                    }
                  />
                </Row>

                <Table
                  columns={columns}
                  dataSource={filteredData}
                  rowKey="id"
                  pagination={{ pageSize: 10, showSizeChanger: true }}
                  scroll={{ x: 1200 }}
                  bordered
                />
              </Space>
            </Card>
          </Space>
        </Card>
      )}

      <Modal
        title="Add New Inventory Item"
        open={modalVisible}
        onCancel={handleCancel}
        footer={null}
        destroyOnClose={false}
        afterClose={() => form.resetFields()}
        maskClosable={false}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          initialValues={{ quantity: 0, date_added: null }}
        >
          <Row gutter={[16, 16]}>
            <Col xs={24}>
              <Form.Item
                name="item_name"
                label="Item Name"
                rules={[{ required: true, message: "Please enter item name" }]}
              >
                <Input />
              </Form.Item>
            </Col>

            <Col xs={24}>
              <Form.Item
                name="quantity"
                label="Quantity"
                rules={[{ required: true, message: "Required" }]}
              >
                <InputNumber min={0} style={{ width: "100%" }} />
              </Form.Item>
            </Col>

            <Col xs={24}>
              <Form.Item name="date_added" label="Date Added">
                <DatePicker style={{ width: "100%" }} format="YYYY-MM-DD" />
              </Form.Item>
            </Col>

            <Col xs={24}>
              <Form.Item name="in" label="In">
                <Input />
              </Form.Item>
            </Col>

            <Col xs={24}>
              <Form.Item name="out" label="Out">
                <Input />
              </Form.Item>
            </Col>

            <Col xs={24}>
              <Form.Item name="receiver_name" label="Receiver">
                <Input />
              </Form.Item>
            </Col>

            <Col xs={24}>
              <Form.Item name="vendorId" label="Vendor">
                <Input />
              </Form.Item>
            </Col>

            <Col xs={24}>
              <Form.Item name="remarks" label="Remarks">
                <Input.TextArea rows={2} />
              </Form.Item>
            </Col>

            <Col xs={24}>
              <Button
                type="primary"
                htmlType="submit"
                loading={isCreating}
                block
              >
                Add Inventory Item
              </Button>
            </Col>
          </Row>
        </Form>
      </Modal>
    </div>
  );
};

export default ProjectDetails;
