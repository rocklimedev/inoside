import React from "react";

const DeleteModal = () => {
  return (
    <div class="modal fade" id="delete_modal">
      <div class="modal-dialog modal-dialog-centered modal-sm">
        <div class="modal-content">
          <div class="modal-body text-center">
            <div class="mb-3">
              <img src="assets/img/icons/delete.svg" alt="img" />
            </div>
            <h6 class="mb-1">Delete Purchase</h6>
            <p class="mb-3">Are you sure, you want to delete purchase?</p>
            <div class="d-flex justify-content-center">
              <a
                href="javascript:void(0);"
                class="btn btn-outline-white me-3"
                data-bs-dismiss="modal"
              >
                Cancel
              </a>
              <a href="purchases.html" class="btn btn-primary">
                Yes, Delete
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeleteModal;
