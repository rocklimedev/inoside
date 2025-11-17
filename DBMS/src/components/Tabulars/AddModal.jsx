// src/components/AddEditModal.jsx
import React, { useEffect } from "react";
import { Modal, Button, Form, Row, Col, InputGroup } from "react-bootstrap";
import {
  useCreatePersonMutation,
  useUpdatePersonMutation,
} from "../../api/personApi";

const AddEditModal = ({
  show,
  onHide,
  editingPerson,
  personTypes = [],
  brandCompanies = [],
}) => {
  const [createPerson, { isLoading: isCreating }] = useCreatePersonMutation();
  const [updatePerson, { isLoading: isUpdating }] = useUpdatePersonMutation();

  const isEdit = !!editingPerson?.id;
  const isSubmitting = isCreating || isUpdating;

  // Reset form when modal opens/closes or person changes
  useEffect(() => {
    if (show && editingPerson) {
      const form = document.getElementById("personForm");
      if (form) form.reset();
    }
  }, [show, editingPerson]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = e.currentTarget;

    const address = {
      line1: form.address_line1?.value || null,
      line2: form.address_line2?.value || null,
      city: form.address_city?.value || null,
      state: form.address_state?.value || null,
      pincode: form.address_pincode?.value || null,
      country: form.address_country?.value || "India",
    };

    // Remove null/empty fields from address
    Object.keys(address).forEach(
      (key) => address[key] == null && delete address[key]
    );
    const finalAddress = Object.keys(address).length > 0 ? address : null;

    const payload = {
      name: form.name.value.trim(),
      mobile_number: form.mobile_number.value.trim(),
      optional_mobile: form.optional_mobile.value.trim() || null,

      type_id: form.type_id.value || null,
      brand_company_id: form.brand_company_id.value || null,
      company_name: form.company_name.value.trim() || null,
      position: form.position.value.trim() || null,
      type_of_business: form.type_of_business.value.trim() || null,
      notes: form.notes.value.trim() || null,
      area_covered: form.area_covered.value.trim() || null,
      reference_name: form.reference_name.value.trim() || null,
      reference_mobile: form.reference_mobile.value.trim() || null,
      age: form.age.value ? parseInt(form.age.value) : null,
      dob: form.dob.value || null,
      is_architect: form.is_architect.checked ? 1 : 0,
      is_interior: form.is_interior.checked ? 1 : 0,
      is_furniture: form.is_furniture.checked ? 1 : 0,
      address: finalAddress,
      is_active: form.is_active.checked ? 1 : 0,
    };

    try {
      if (isEdit) {
        await updatePerson({ id: editingPerson.id, ...payload }).unwrap();
      } else {
        await createPerson(payload).unwrap();
      }
      onHide();
    } catch (err) {
      console.error("Save failed:", err);
      alert(err?.data?.message || "Failed to save person. Please try again.");
    }
  };

  return (
    <Modal show={show} onHide={onHide} size="lg" centered backdrop="static">
      <Form id="personForm" onSubmit={handleSubmit}>
        <Modal.Header closeButton>
          <Modal.Title className="fw-bold">
            {isEdit ? "Edit" : "Add New"} Person
          </Modal.Title>
        </Modal.Header>

        <Modal.Body className="pb-0">
          {/* Basic Info */}
          <div className="border-bottom pb-3 mb-4">
            <h6 className="text-primary mb-3">Basic Information</h6>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>
                    Full Name <span className="text-danger">*</span>
                  </Form.Label>
                  <Form.Control
                    name="name"
                    required
                    defaultValue={editingPerson?.name || ""}
                    placeholder="Enter full name"
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>
                    Mobile Number <span className="text-danger">*</span>
                  </Form.Label>
                  <Form.Control
                    name="mobile_number"
                    type="tel"
                    required
                    defaultValue={editingPerson?.mobile_number || ""}
                    placeholder="e.g. 9876543210"
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Alternate Mobile</Form.Label>
                  <Form.Control
                    name="optional_mobile"
                    type="tel"
                    defaultValue={editingPerson?.optional_mobile || ""}
                    placeholder="Secondary number"
                  />
                </Form.Group>
              </Col>
            </Row>
          </div>

          {/* Category & Business */}
          <div className="border-bottom pb-3 mb-4">
            <h6 className="text-primary mb-3">Category & Business</h6>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>
                    Person Type <span className="text-danger">*</span>
                  </Form.Label>
                  <Form.Select
                    name="type_id"
                    required
                    defaultValue={editingPerson?.type_id || ""}
                  >
                    <option value="">Select type</option>
                    {personTypes.map((pt) => (
                      <option key={pt.id} value={pt.id}>
                        {pt.name}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Associated Brand</Form.Label>
                  <Form.Select
                    name="brand_company_id"
                    defaultValue={editingPerson?.brand_company_id || ""}
                  >
                    <option value="">None</option>
                    {brandCompanies.map((bc) => (
                      <option key={bc.id} value={bc.id}>
                        {bc.name}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Company Name</Form.Label>
                  <Form.Control
                    name="company_name"
                    defaultValue={editingPerson?.company_name || ""}
                    placeholder="Their company"
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Position / Designation</Form.Label>
                  <Form.Control
                    name="position"
                    defaultValue={editingPerson?.position || ""}
                    placeholder="e.g. Senior Architect"
                  />
                </Form.Group>
              </Col>
              <Col md={12}>
                <Form.Group className="mb-3">
                  <Form.Label>Type of Business</Form.Label>
                  <Form.Control
                    name="type_of_business"
                    defaultValue={editingPerson?.type_of_business || ""}
                    placeholder="e.g. Modular Kitchen, Furniture Retail, etc."
                  />
                </Form.Group>
              </Col>
            </Row>
          </div>

          {/* Roles */}
          <div className="border-bottom pb-3 mb-4">
            <h6 className="text-primary mb-3">Professional Roles</h6>
            <div className="hstack gap-4">
              <Form.Check
                type="checkbox"
                name="is_architect"
                label="Architect"
                defaultChecked={editingPerson?.is_architect}
              />
              <Form.Check
                type="checkbox"
                name="is_interior"
                label="Interior Designer"
                defaultChecked={editingPerson?.is_interior}
              />
              <Form.Check
                type="checkbox"
                name="is_furniture"
                label="Furniture Dealer / Manufacturer"
                defaultChecked={editingPerson?.is_furniture}
              />
            </div>
          </div>

          {/* Additional Info */}
          <div className="border-bottom pb-3 mb-4">
            <h6 className="text-primary mb-3">Additional Information</h6>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Age</Form.Label>
                  <Form.Control
                    name="age"
                    type="number"
                    min="18"
                    max="100"
                    defaultValue={editingPerson?.age || ""}
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Date of Birth</Form.Label>
                  <Form.Control
                    name="dob"
                    type="date"
                    defaultValue={editingPerson?.dob || ""}
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Reference Name</Form.Label>
                  <Form.Control
                    name="reference_name"
                    defaultValue={editingPerson?.reference_name || ""}
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Reference Mobile</Form.Label>
                  <Form.Control
                    name="reference_mobile"
                    type="tel"
                    defaultValue={editingPerson?.reference_mobile || ""}
                  />
                </Form.Group>
              </Col>
              <Col md={12}>
                <Form.Group className="mb-3">
                  <Form.Label>Areas Covered</Form.Label>
                  <Form.Control
                    name="area_covered"
                    defaultValue={editingPerson?.area_covered || ""}
                    placeholder="e.g. Delhi NCR, Mumbai, Pune"
                  />
                </Form.Group>
              </Col>
              <Col md={12}>
                <Form.Group className="mb-3">
                  <Form.Label>Notes</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    name="notes"
                    defaultValue={editingPerson?.notes || ""}
                    placeholder="Any additional remarks..."
                  />
                </Form.Group>
              </Col>
            </Row>
          </div>

          {/* Address */}
          <div className="border-bottom pb-3 mb-4">
            <h6 className="text-primary mb-3">Address</h6>
            <Row>
              <Col md={12}>
                <Form.Group className="mb-3">
                  <Form.Label>Address Line 1</Form.Label>
                  <Form.Control
                    name="address_line1"
                    defaultValue={editingPerson?.address?.line1 || ""}
                    placeholder="Building, Flat no, Street"
                  />
                </Form.Group>
              </Col>
              <Col md={12}>
                <Form.Group className="mb-3">
                  <Form.Label>Address Line 2 (Optional)</Form.Label>
                  <Form.Control
                    name="address_line2"
                    defaultValue={editingPerson?.address?.line2 || ""}
                    placeholder="Landmark, Area"
                  />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>City</Form.Label>
                  <Form.Control
                    name="address_city"
                    defaultValue={editingPerson?.address?.city || ""}
                  />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>State</Form.Label>
                  <Form.Control
                    name="address_state"
                    defaultValue={editingPerson?.address?.state || ""}
                  />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>PIN Code</Form.Label>
                  <Form.Control
                    name="address_pincode"
                    defaultValue={editingPerson?.address?.pincode || ""}
                  />
                </Form.Group>
              </Col>
            </Row>
          </div>

          {/* Status */}
          <div className="mb-4">
            <Form.Check
              type="switch"
              name="is_active"
              label="Active Person"
              defaultChecked={editingPerson?.is_active !== 0}
              className="fs-6"
            />
          </div>
        </Modal.Body>

        <Modal.Footer>
          <Button variant="secondary" onClick={onHide} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" />
                Saving...
              </>
            ) : isEdit ? (
              "Update Person"
            ) : (
              "Create Person"
            )}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

export default AddEditModal;
