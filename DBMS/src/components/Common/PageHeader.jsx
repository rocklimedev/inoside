import React from "react";

const PageHeader = () => {
  return (
    <div class="d-flex d-block align-items-center justify-content-between flex-wrap gap-3 mb-3">
      <div>
        <h6>Purchase</h6>
      </div>
      <div class="d-flex my-xl-auto right-content align-items-center flex-wrap gap-2">
        <div class="dropdown">
          <a
            href="javascript:void(0);"
            class="btn btn-outline-white d-inline-flex align-items-center"
            data-bs-toggle="dropdown"
          >
            <i class="isax isax-export-1 me-1"></i>Export
          </a>
          <ul class="dropdown-menu">
            <li>
              <a class="dropdown-item" href="javascript:void(0);">
                Download as PDF
              </a>
            </li>
            <li>
              <a class="dropdown-item" href="javascript:void(0);">
                Download as Excel
              </a>
            </li>
          </ul>
        </div>
        <div>
          <a
            href="add-purchases.html"
            class="btn btn-primary d-flex align-items-center"
          >
            <i class="isax isax-add-circle5 me-1"></i>New Purchase
          </a>
        </div>
      </div>
    </div>
  );
};

export default PageHeader;
