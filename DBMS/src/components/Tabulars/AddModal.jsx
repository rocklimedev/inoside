// src/components/AddEditModal.jsx
import React, { useEffect, useState } from "react";
import {
  Modal,
  Form,
  Input,
  Select,
  DatePicker,
  Checkbox,
  Switch,
  Row,
  Col,
  message,
  Button,
  Space,
} from "antd";
import {
  UserOutlined,
  PhoneOutlined,
  HomeOutlined,
  PlusOutlined,
} from "@ant-design/icons";

import {
  useCreatePersonMutation,
  useUpdatePersonMutation,
} from "../../api/personApi";

// Person Types
import {
  useGetPersonTypesQuery,
  useCreatePersonTypeMutation,
} from "../../api/personApi"; // adjust path if needed

// Brand Companies
import {
  useGetBrandCompaniesQuery,
  useCreateBrandCompanyMutation,
} from "../../api/brandCompanyApi";

const { TextArea } = Input;

const AddEditModal = ({ open, onCancel, editingPerson, onSuccess }) => {
  const [form] = Form.useForm();

  // === Person Types ===
  const { data: personTypes = [], isLoading: loadingPersonTypes } =
    useGetPersonTypesQuery();
  const [createPersonType, { isLoading: creatingType }] =
    useCreatePersonTypeMutation();

  // === Brand Companies ===
  const { data: brandCompanies = [], isLoading: loadingBrands } =
    useGetBrandCompaniesQuery();
  console.log(brandCompanies);
  const [createBrandCompany, { isLoading: creatingBrand }] =
    useCreateBrandCompanyMutation();

  // Inline Add States
  const [showTypeInput, setShowTypeInput] = useState(false);
  const [newTypeName, setNewTypeName] = useState("");
  const [showBrandInput, setShowBrandInput] = useState(false);
  const [newBrandName, setNewBrandName] = useState("");

  // Mutations
  const [createPerson, { isLoading: isCreating }] = useCreatePersonMutation();
  const [updatePerson, { isLoading: isUpdating }] = useUpdatePersonMutation();

  const isEdit = !!editingPerson?.id;
  const loading = isCreating || isUpdating;

  // Reset inline inputs when modal closes
  useEffect(() => {
    if (!open) {
      setShowTypeInput(false);
      setShowBrandInput(false);
      setNewTypeName("");
      setNewBrandName("");
      form.resetFields();
    }
  }, [open, form]);

  // Populate form when editing
  useEffect(() => {
    if (editingPerson && open) {
      form.setFieldsValue({
        ...editingPerson,
        type_id: editingPerson.type_id || undefined,
        brand_company_id: editingPerson.brand_company_id || undefined,
        is_architect: editingPerson.is_architect === 1,
        is_interior: editingPerson.is_interior === 1,
        is_furniture: editingPerson.is_furniture === 1,
        is_active: editingPerson.is_active !== 0,
        dob: editingPerson.dob ? window.dayjs(editingPerson.dob) : null,
        address_line1: editingPerson.address?.line1 || "",
        address_line2: editingPerson.address?.line2 || "",
        address_city: editingPerson.address?.city || "",
        address_state: editingPerson.address?.state || "",
        address_pincode: editingPerson.address?.pincode || "",
      });
    }
  }, [editingPerson, open, form]);

  // Create Person Type
  const handleCreateType = async () => {
    const name = newTypeName.trim();
    if (!name) return message.warning("Enter a type name");

    try {
      await createPersonType({ name }).unwrap();
      message.success(`"${name}" added!`);
      setNewTypeName("");
      setShowTypeInput(false);
    } catch (err) {
      message.error(err?.data?.message || "Failed to add type");
    }
  };

  // Create Brand
  const handleCreateBrand = async () => {
    const name = newBrandName.trim();
    if (!name) return message.warning("Enter a brand name");

    try {
      await createBrandCompany({ name }).unwrap();
      message.success(`"${name}" added!`);
      setNewBrandName("");
      setShowBrandInput(false);
    } catch (err) {
      message.error(err?.data?.message || "Failed to add brand");
    }
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();

      const address = {
        line1: values.address_line1 || null,
        line2: values.address_line2 || null,
        city: values.address_city || null,
        state: values.address_state || null,
        pincode: values.address_pincode || null,
        country: "India",
      };

      Object.keys(address).forEach(
        (key) => !address[key] && delete address[key]
      );
      const finalAddress = Object.keys(address).length > 0 ? address : null;

      const payload = {
        name: values.name?.trim(),
        mobile_number: values.mobile_number?.trim(),
        optional_mobile: values.optional_mobile?.trim() || null,
        type_id: values.type_id || null,
        brand_company_id: values.brand_company_id || null,
        company_name: values.company_name?.trim() || null,
        position: values.position?.trim() || null,
        type_of_business: values.type_of_business?.trim() || null,
        notes: values.notes?.trim() || null,
        area_covered: values.area_covered?.trim() || null,
        reference_name: values.reference_name?.trim() || null,
        reference_mobile: values.reference_mobile?.trim() || null,
        age: values.age ? Number(values.age) : null,
        dob: values.dob ? values.dob.format("YYYY-MM-DD") : null,
        is_architect: values.is_architect ? 1 : 0,
        is_interior: values.is_interior ? 1 : 0,
        is_furniture: values.is_furniture ? 1 : 0,
        address: finalAddress,
        is_active: values.is_active ? 1 : 0,
      };

      if (isEdit) {
        await updatePerson({ id: editingPerson.id, ...payload }).unwrap();
        message.success("Person updated successfully!");
      } else {
        await createPerson(payload).unwrap();
        message.success("Person created successfully!");
      }

      form.resetFields();
      onCancel();
      onSuccess?.();
    } catch (err) {
      console.error(err);
      message.error(err?.data?.message || "Failed to save person");
    }
  };

  return (
    <Modal
      title={
        <strong style={{ fontSize: "1.4rem" }}>
          {isEdit ? "Edit Person" : "Add New Person"}
        </strong>
      }
      open={open}
      onCancel={onCancel}
      width={1000}
      footer={[
        <Button key="cancel" onClick={onCancel} disabled={loading}>
          Cancel
        </Button>,
        <Button
          key="submit"
          type="primary"
          loading={loading}
          onClick={handleSubmit}
        >
          {isEdit ? "Update" : "Create"} Person
        </Button>,
      ]}
      centered
      destroyOnClose
    >
      <Form form={form} layout="vertical" style={{ marginTop: 20 }}>
        {/* Basic Information */}
        <div
          style={{
            borderBottom: "1px solid #f0f0f0",
            paddingBottom: 20,
            marginBottom: 24,
          }}
        >
          <h6
            style={{ color: "#6366f1", fontWeight: "bold", marginBottom: 16 }}
          >
            Basic Information
          </h6>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="name"
                label="Full Name"
                rules={[{ required: true, message: "Required" }]}
              >
                <Input
                  prefix={<UserOutlined />}
                  placeholder="Enter full name"
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="mobile_number"
                label="Mobile Number"
                rules={[
                  { required: true, message: "Required" },
                  {
                    pattern: /^[6-9]\d{9}$/,
                    message: "Invalid Indian mobile number",
                  },
                ]}
              >
                <Input prefix={<PhoneOutlined />} placeholder="9876543210" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="optional_mobile" label="Alternate Mobile">
                <Input prefix={<PhoneOutlined />} placeholder="Optional" />
              </Form.Item>
            </Col>
          </Row>
        </div>

        {/* Category & Business */}
        <div
          style={{
            borderBottom: "1px solid #f0f0f0",
            paddingBottom: 20,
            marginBottom: 24,
          }}
        >
          <h6
            style={{ color: "#6366f1", fontWeight: "bold", marginBottom: 16 }}
          >
            Category & Business
          </h6>
          <Row gutter={16}>
            {/* Person Type + Inline Add */}
            <Col span={12}>
              <Form.Item
                name="type_id"
                label="Person Type"
                rules={[{ required: true }]}
              >
                <Select
                  placeholder="Select or add new type"
                  loading={loadingPersonTypes}
                  dropdownRender={(menu) => (
                    <>
                      {menu}
                      {showTypeInput ? (
                        <Space style={{ padding: 8 }}>
                          <Input
                            placeholder="New type name"
                            value={newTypeName}
                            onChange={(e) => setNewTypeName(e.target.value)}
                            onKeyDown={(e) => e.stopPropagation()}
                          />
                          <Button
                            type="text"
                            icon={<PlusOutlined />}
                            loading={creatingType}
                            onClick={handleCreateType}
                          >
                            Add
                          </Button>
                          <Button
                            type="text"
                            size="small"
                            onClick={() => {
                              setShowTypeInput(false);
                              setNewTypeName("");
                            }}
                          >
                            Cancel
                          </Button>
                        </Space>
                      ) : (
                        <div style={{ padding: "4px 8px" }}>
                          <Button
                            type="dashed"
                            block
                            icon={<PlusOutlined />}
                            onClick={() => setShowTypeInput(true)}
                          >
                            Add New Person Type
                          </Button>
                        </div>
                      )}
                    </>
                  )}
                >
                  {personTypes.map((pt) => (
                    <Select.Option key={pt.id} value={pt.id}>
                      {pt.name}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>

            {/* Brand + Inline Add */}
            <Col span={12}>
              <Form.Item name="brand_company_id" label="Associated Brand">
                <Select
                  placeholder="Select or add new brand"
                  loading={loadingBrands}
                  allowClear
                  showSearch
                  optionFilterProp="children"
                  dropdownRender={(menu) => (
                    <>
                      {menu}
                      {showBrandInput ? (
                        <Space style={{ padding: 8 }}>
                          <Input
                            placeholder="New brand name"
                            value={newBrandName}
                            onChange={(e) => setNewBrandName(e.target.value)}
                            onKeyDown={(e) => e.stopPropagation()}
                          />
                          <Button
                            type="text"
                            icon={<PlusOutlined />}
                            loading={creatingBrand}
                            onClick={handleCreateBrand}
                          >
                            Add
                          </Button>
                          <Button
                            type="text"
                            size="small"
                            onClick={() => {
                              setShowBrandInput(false);
                              setNewBrandName("");
                            }}
                          >
                            Cancel
                          </Button>
                        </Space>
                      ) : (
                        <div style={{ padding: "4px 8px" }}>
                          <Button
                            type="dashed"
                            block
                            icon={<PlusOutlined />}
                            onClick={() => setShowBrandInput(true)}
                          >
                            Add New Brand
                          </Button>
                        </div>
                      )}
                    </>
                  )}
                >
                  {brandCompanies.map((brand) => (
                    <Select.Option key={brand.id} value={brand.id}>
                      {brand.name}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item name="company_name" label="Company Name">
                <Input placeholder="Their company" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="position" label="Position / Designation">
                <Input placeholder="e.g. Senior Architect" />
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item name="type_of_business" label="Type of Business">
                <Input placeholder="e.g. Modular Kitchen, Furniture Retail" />
              </Form.Item>
            </Col>
          </Row>
        </div>

        {/* Professional Roles */}
        <div style={{ marginBottom: 24 }}>
          <h6
            style={{ color: "#6366f1", fontWeight: "bold", marginBottom: 12 }}
          >
            Professional Roles
          </h6>
          <Space direction="vertical" style={{ width: "100%" }}>
            <Form.Item name="is_architect" valuePropName="checked">
              <Checkbox>Architect</Checkbox>
            </Form.Item>
            <Form.Item name="is_interior" valuePropName="checked">
              <Checkbox>Interior Designer</Checkbox>
            </Form.Item>
            <Form.Item name="is_furniture" valuePropName="checked">
              <Checkbox>Furniture Dealer / Manufacturer</Checkbox>
            </Form.Item>
          </Space>
        </div>

        {/* Additional Information */}
        <div
          style={{
            borderBottom: "1px solid #f0f0f0",
            paddingBottom: 20,
            marginBottom: 24,
          }}
        >
          <h6
            style={{ color: "#6366f1", fontWeight: "bold", marginBottom: 16 }}
          >
            Additional Information
          </h6>
          <Row gutter={16}>
            <Col span={8}>
              <Form.Item name="age" label="Age">
                <Input type="number" min={18} max={100} />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="dob" label="Date of Birth">
                <DatePicker style={{ width: "100%" }} />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="reference_name" label="Reference Name">
                <Input />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="reference_mobile" label="Reference Mobile">
                <Input />
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item name="area_covered" label="Areas Covered">
                <Input placeholder="e.g. Delhi NCR, Mumbai, Pune" />
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item name="notes" label="Notes">
                <TextArea rows={3} placeholder="Any additional remarks..." />
              </Form.Item>
            </Col>
          </Row>
        </div>

        {/* Address */}
        <div style={{ marginBottom: 24 }}>
          <h6
            style={{ color: "#6366f1", fontWeight: "bold", marginBottom: 16 }}
          >
            Address
          </h6>
          <Row gutter={16}>
            <Col span={24}>
              <Form.Item name="address_line1" label="Address Line 1">
                <Input
                  prefix={<HomeOutlined />}
                  placeholder="Building, Flat no, Street"
                />
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item name="address_line2" label="Address Line 2 (Optional)">
                <Input placeholder="Landmark, Area" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="address_city" label="City">
                <Input />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="address_state" label="State">
                <Input />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="address_pincode" label="PIN Code">
                <Input />
              </Form.Item>
            </Col>
          </Row>
        </div>

        {/* Status */}
        <Form.Item name="is_active" valuePropName="checked">
          <Switch checkedChildren="Active" unCheckedChildren="Inactive" />{" "}
          <strong>Active Person</strong>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default AddEditModal;
