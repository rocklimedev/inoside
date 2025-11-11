import React from "react";
import PageHeader from "../Common/PageHeader";

const Tables = () => {
  return (
    <div class="content content-two">
      <PageHeader />

      <div class="mb-3">
        <div class="d-flex align-items-center justify-content-between flex-wrap gap-3">
          <div class="d-flex align-items-center flex-wrap gap-2">
            <div class="table-search d-flex align-items-center mb-0">
              <div class="search-input">
                <a href="javascript:void(0);" class="btn-searchset">
                  <i class="isax isax-search-normal fs-12"></i>
                </a>
              </div>
            </div>
            <a
              class="btn btn-outline-white fw-normal d-inline-flex align-items-center"
              href="javascript:void(0);"
              data-bs-toggle="offcanvas"
              data-bs-target="#customcanvas"
            >
              <i class="isax isax-filter me-1"></i>Filter
            </a>
          </div>
          <div class="d-flex align-items-center flex-wrap gap-2">
            <div class="dropdown">
              <a
                href="javascript:void(0);"
                class="dropdown-toggle btn btn-outline-white d-inline-flex align-items-center"
                data-bs-toggle="dropdown"
              >
                <i class="isax isax-sort me-1"></i>Sort By :{" "}
                <span class="fw-normal ms-1">Latest</span>
              </a>
              <ul class="dropdown-menu  dropdown-menu-end">
                <li>
                  <a href="javascript:void(0);" class="dropdown-item">
                    Latest
                  </a>
                </li>
                <li>
                  <a href="javascript:void(0);" class="dropdown-item">
                    Oldest
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div class="align-items-center gap-2 flex-wrap filter-info mt-3">
          <h6 class="fs-13 fw-semibold">Filters</h6>
          <span class="tag bg-light border rounded-1 fs-12 text-dark badge">
            <span class="num-count d-inline-flex align-items-center justify-content-center bg-success fs-10 me-1">
              5
            </span>
            Vendors Selected
            <span class="ms-1 tag-close">
              <i class="fa-solid fa-x fs-10"></i>
            </span>
          </span>
          <span class="tag bg-light border rounded-1 fs-12 text-dark badge">
            <span class="num-count d-inline-flex align-items-center justify-content-center bg-success fs-10 me-1">
              5
            </span>
            $10,000 - $25,500
            <span class="ms-1 tag-close">
              <i class="fa-solid fa-x fs-10"></i>
            </span>
          </span>
          <a
            href="#"
            class="link-danger fw-medium text-decoration-underline ms-md-1"
          >
            Clear All
          </a>
        </div>
      </div>

      <div class="table-responsive">
        <table class="table table-nowrap datatable">
          <thead>
            <tr>
              <th class="no-sort">
                <div class="form-check form-check-md">
                  <input
                    class="form-check-input"
                    type="checkbox"
                    id="select-all"
                  />
                </div>
              </th>
              <th class="no-sort">ID</th>
              <th>Date</th>
              <th>Vendor</th>
              <th>Amount</th>
              <th class="no-sort">Payment Mode</th>
              <th>Status</th>
              <th class="no-sort"></th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                <div class="form-check form-check-md">
                  <input class="form-check-input" type="checkbox" />
                </div>
              </td>
              <td>
                <a href="javascript:void(0);" class="link-default">
                  PUR00025
                </a>
              </td>
              <td>22 Feb 2025</td>
              <td>
                <div class="d-flex align-items-center">
                  <a
                    href="javascript:void(0);"
                    class="avatar avatar-sm rounded-circle me-2 flex-shrink-0"
                  >
                    <img
                      src="assets/img/profiles/avatar-17.jpg"
                      class="rounded-circle"
                      alt="img"
                    />
                  </a>
                  <div>
                    <h6 class="fs-14 fw-medium mb-0">
                      <a href="javascript:void(0);">Emma Rose</a>
                    </h6>
                  </div>
                </div>
              </td>
              <td class="text-dark">$10,000</td>
              <td class="text-dark">Cash</td>
              <td>
                <div class="d-flex align-items-center">
                  <span
                    href="#"
                    class="badge badge-soft-success badge-sm d-inline-flex align-items-center"
                  >
                    Paid <i class="isax isax-tick-circle4 ms-1"></i>
                  </span>
                </div>
              </td>
              <td class="action-item">
                <a href="javascript:void(0);" data-bs-toggle="dropdown">
                  <i class="isax isax-more"></i>
                </a>
                <ul class="dropdown-menu">
                  <li>
                    <a
                      href="javascript:void(0);"
                      class="dropdown-item d-flex align-items-center"
                    >
                      <i class="isax isax-eye me-2"></i>View
                    </a>
                  </li>
                  <li>
                    <a
                      href="edit-purchases.html"
                      class="dropdown-item d-flex align-items-center"
                    >
                      <i class="isax isax-edit me-2"></i>Edit
                    </a>
                  </li>
                  <li>
                    <a
                      href="javascript:void(0);"
                      class="dropdown-item d-flex align-items-center"
                      data-bs-toggle="modal"
                      data-bs-target="#delete_modal"
                    >
                      <i class="isax isax-trash me-2"></i>Delete
                    </a>
                  </li>
                </ul>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Tables;
