import React from "react";
import { Link } from "react-router-dom";
import {
  useGetAllProjectsQuery,
  useDeleteProjectMutation,
} from "../../api/projectApi";

import {
  Table,
  Card,
  Space,
  Button,
  Typography,
  Popconfirm,
  Spin,
  Alert,
} from "antd";

import { EyeOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";

const { Title } = Typography;

const InventoryList = () => {
  const { data, isLoading, isError } = useGetAllProjectsQuery();
  const [deleteProject] = useDeleteProjectMutation();

  const projects = data || [];

  const handleDelete = async (id) => {
    try {
      await deleteProject(id).unwrap();
    } catch (err) {
      console.error("Delete failed", err);
    }
  };

  const columns = [
    {
      title: "Project Name",
      dataIndex: "name",
      key: "name",
      render: (text, record) => (
        <Link to={`/project/${record.id}`}>{text}</Link>
      ),
    },

    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Space>
          <Link to={`/project/${record.id}`}>
            <Button icon={<EyeOutlined />} size="small" />
          </Link>

          <Popconfirm
            title="Delete Project"
            description="Are you sure you want to delete this project?"
            onConfirm={() => handleDelete(record.id)}
            okText="Yes"
            cancelText="No"
          >
            <Button danger icon={<DeleteOutlined />} size="small" />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  if (isLoading) {
    return <Spin fullscreen tip="Loading projects..." />;
  }

  if (isError) {
    return <Alert type="error" message="Failed to load projects" showIcon />;
  }

  return (
    <div style={{ padding: 24 }}>
      <Card>
        <Space direction="vertical" size="middle" style={{ width: "100%" }}>
          <Space
            style={{
              width: "100%",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Title level={3} style={{ margin: 0 }}>
              All Projects
            </Title>

            <Link to="/add-project">
              <Button type="primary">+ Add Project</Button>
            </Link>
          </Space>
          <Table
            columns={columns}
            dataSource={projects}
            rowKey="id"
            bordered
            pagination={{
              pageSize: 10,
              showSizeChanger: true,
            }}
          />
        </Space>
      </Card>
    </div>
  );
};

export default InventoryList;
