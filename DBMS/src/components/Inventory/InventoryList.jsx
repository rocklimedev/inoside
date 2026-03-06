import React from "react";
import {
  useGetAllProjectsQuery,
  useDeleteProjectMutation,
} from "../../api/projectApi";

const InventoryList = () => {
  const { data, isLoading, isError } = useGetAllProjectsQuery();
  const [deleteProject] = useDeleteProjectMutation();

  if (isLoading) return <p>Loading...</p>;
  if (isError) return <p>Failed to load projects</p>;

  const projects = data || [];

  const handleDelete = async (id) => {
    if (window.confirm("Delete this project?")) {
      await deleteProject(id);
    }
  };

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap">
        <h3>All Projects</h3>
      </div>

      <div className="card">
        <div className="table-responsive">
          <table className="table table-hover table-bordered mb-0">
            <thead className="table-light">
              <tr>
                <th>Project Name</th>
                <th>Project ID</th>
                <th>Created</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {projects.map((project) => (
                <tr key={project.id}>
                  <td>
                    <a
                      href={`/project/${project.id}`}
                      className="text-decoration-none"
                    >
                      {project.name}
                    </a>
                  </td>
                  <td>{project.id}</td>
                  <td>{new Date(project.createdAt).toLocaleDateString()}</td>
                  <td>
                    <div className="d-flex gap-2">
                      <a
                        href={`/project/${project.id}`}
                        className="btn btn-sm btn-outline-primary"
                        title="View"
                      >
                        <i className="bi bi-eye"></i>
                      </a>

                      <a
                        href={`/project/edit/${project.id}`}
                        className="btn btn-sm btn-outline-secondary"
                        title="Edit"
                      >
                        <i className="bi bi-pencil"></i>
                      </a>

                      <button
                        className="btn btn-sm btn-outline-danger"
                        onClick={() => handleDelete(project.id)}
                        title="Delete"
                      >
                        <i className="bi bi-trash"></i>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default InventoryList;
