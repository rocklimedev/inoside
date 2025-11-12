// src/components/AddEditModal.jsx
import React from "react";
import { Modal, Button, Form } from "react-bootstrap";
import {
  useCreatePersonMutation,
  useUpdatePersonMutation,
} from "../../api/personApi";

const AddEditModal = ({ show, onHide, person, personTypes = [] }) => {
  const [create] = useCreatePersonMutation();
  const [update] = useUpdatePersonMutation();

  const isEdit = !!person?.id;

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = e.currentTarget;
    const data = {
      name: form.name.value,
      email: form.email.value,
      person_type_id: form.person_type_id.value
        ? Number(form.person_type_id.value)
        : null,
    };

    try {
      if (isEdit) {
        await update({ id: person.id, ...data }).unwrap();
      } else {
        await create(data).unwrap();
      }
      onHide();
    } catch (err) {
      alert("Save failed");
    }
  };

  return (
    <Modal show={show} onHide={onHide} centered>
      <Form onSubmit={handleSubmit}>
        <Modal.Header closeButton>
          <Modal.Title>{isEdit ? "Edit" : "Add"} Person</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <Form.Group className="mb-3">
            <Form.Label>Name</Form.Label>
            <Form.Control
              name="name"
              required
              defaultValue={person?.name ?? ""}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Email</Form.Label>
            <Form.Control
              name="email"
              type="email"
              defaultValue={person?.email ?? ""}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Person Type (Sheet)</Form.Label>
            <Form.Select
              name="person_type_id"
              defaultValue={person?.person_type_id ?? ""}
            >
              <option value="">—</option>
              {/* Safe map: personTypes is always an array */}
              {personTypes.map((pt) => (
                <option key={pt.id} value={pt.id}>
                  {pt.name}
                </option>
              ))}
            </Form.Select>
          </Form.Group>
        </Modal.Body>

        <Modal.Footer>
          <Button variant="secondary" onClick={onHide}>
            Cancel
          </Button>
          <Button type="submit" variant="primary">
            {isEdit ? "Update" : "Create"}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

export default AddEditModal;
