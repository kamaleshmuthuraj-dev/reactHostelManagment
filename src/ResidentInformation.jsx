import { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

const initialResidents = [
  {
    id: 1,
    name: "Arun Kumar",
    age: 32,
    gender: "Male",
    phone: "9876543210",
    email: "arun@example.com",
    address: "Anna Nagar, Chennai",
    status: "Active",
  },
  {
    id: 2,
    name: "Priya Sharma",
    age: 28,
    gender: "Female",
    phone: "9876501234",
    email: "priya@example.com",
    address: "T. Nagar, Chennai",
    status: "Active",
  },
  {
    id: 3,
    name: "Rahul Singh",
    age: 41,
    gender: "Male",
    phone: "9876123456",
    email: "rahul@example.com",
    address: "Velachery, Chennai",
    status: "Inactive",
  },
];

const emptyResident = {
  name: "",
  age: "",
  gender: "",
  phone: "",
  email: "",
  address: "",
  status: "Active",
};

export default function ResidentInformation() {
  const [residents, setResidents] = useState(initialResidents);
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState("add");
  const [selectedResident, setSelectedResident] = useState(null);
  const [formData, setFormData] = useState(emptyResident);

  const filteredResidents = residents.filter((resident) => {
    const searchText = search.toLowerCase();

    return (
      resident.name.toLowerCase().includes(searchText) ||
      resident.phone.includes(searchText) ||
      resident.email.toLowerCase().includes(searchText) ||
      resident.address.toLowerCase().includes(searchText)
    );
  });

  const handleAdd = () => {
    setModalMode("add");
    setFormData(emptyResident);
    setSelectedResident(null);
    setShowModal(true);
  };

  const handleView = (resident) => {
    setModalMode("view");
    setSelectedResident(resident);
    setShowModal(true);
  };

  const handleEdit = (resident) => {
    setModalMode("edit");
    setSelectedResident(resident);
    setFormData(resident);
    setShowModal(true);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.name || !formData.phone || !formData.email) {
      alert("Please fill all required fields.");
      return;
    }

    if (modalMode === "add") {
      const newResident = {
        ...formData,
        id: Date.now(),
      };

      setResidents((prev) => [...prev, newResident]);
    }

    if (modalMode === "edit") {
      setResidents((prev) =>
        prev.map((resident) =>
          resident.id === selectedResident.id
            ? {
                ...formData,
                id: selectedResident.id,
              }
            : resident
        )
      );
    }

    closeModal();
  };

  const handleDelete = (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this resident?"
    );

    if (!confirmed) return;

    setResidents((prev) =>
      prev.filter((resident) => resident.id !== id)
    );
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedResident(null);
    setFormData(emptyResident);
  };

  return (
    <div className="min-vh-100 bg-light p-3 p-md-5">
      <div className="container-fluid" style={{ maxWidth: "1600px" }}>

        {/* Header */}
        <div className="mb-4 d-flex flex-column flex-sm-row align-items-sm-center justify-content-between gap-3">
          <div>
            <h1 className="fs-2 fw-bold text-dark mb-1">
              Resident Information
            </h1>

            <p className="small text-secondary mb-0">
              Manage and maintain resident records
            </p>
          </div>

          <button
            onClick={handleAdd}
            className="btn btn-primary px-4 py-2 fw-semibold"
          >
            + Add Resident
          </button>
        </div>

        {/* Search Header */}
        <div className="d-flex flex-column flex-md-row align-items-md-center justify-content-between gap-3 border border-secondary-subtle bg-white p-3 rounded-top">

          <div className="input-group w-100" style={{ maxWidth: "500px" }}>
            <span className="input-group-text bg-white">
              🔍
            </span>
            <input
              type="text"
              placeholder="Search by name, phone, email or address..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="form-control py-2"
            />
          </div>
          <div className="small text-secondary">
            Total Residents:{" "}
            <span className="fw-bold text-dark">
              {filteredResidents.length}
            </span>
          </div>
        </div>
        <div className="table-responsive border border-top-0 rounded-bottom bg-white shadow">
          <table className="table table-hover mb-0 align-middle">
            <thead className="table-light">
              <tr>
                <th className="px-4 py-3 small text-uppercase">
                  ID
                </th>
                <th className="px-4 py-3 small text-uppercase">
                  Resident
                </th>
                <th className="px-4 py-3 small text-uppercase">
                  Age
                </th>
                <th className="px-4 py-3 small text-uppercase">
                  Gender
                </th>
                <th className="px-4 py-3 small text-uppercase">
                  Phone
                </th>
                <th className="px-4 py-3 small text-uppercase">
                  Email
                </th>
                <th className="px-4 py-3 small text-uppercase">
                  Address
                </th>
                <th className="px-4 py-3 small text-uppercase">
                  Status
                </th>
                <th className="px-4 py-3 small text-uppercase">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredResidents.length > 0 ? (
                filteredResidents.map((resident) => (
                  <tr key={resident.id}>
                    <td className="px-4 py-3 small fw-semibold text-secondary">
                      #{resident.id}
                    </td>
                    <td className="px-4 py-3">
                      <div className="d-flex align-items-center gap-3">
                        <div
                          className="rounded-circle bg-primary-subtle text-primary fw-bold d-flex align-items-center justify-content-center"
                          style={{
                            width: "40px",
                            height: "40px",
                          }}
                        >
                          {resident.name.charAt(0).toUpperCase()}
                        </div>

                        <span className="text-nowrap small fw-semibold">
                          {resident.name}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3 small text-secondary">
                      {resident.age}
                    </td>
                    <td className="px-4 py-3 small text-secondary">
                      {resident.gender}
                    </td>

                    <td className="px-4 py-3 small text-secondary">
                      {resident.phone}
                    </td>
                    <td className="px-4 py-3 small text-secondary">
                      {resident.email}
                    </td>
                    <td className="px-4 py-3 small text-secondary">
                      {resident.address}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`badge rounded-pill ${
                          resident.status === "Active"
                            ? "text-bg-success"
                            : "text-bg-danger"
                        }`}
                      >
                        {resident.status}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="d-flex gap-2">

                        <button
                          onClick={() => handleView(resident)}
                          title="View"
                          className="btn btn-sm btn-outline-primary"
                        >
                          👁
                        </button>

                        <button
                          onClick={() => handleEdit(resident)}
                          title="Edit"
                          className="btn btn-sm btn-outline-warning"
                        >
                          ✏️
                        </button>

                        <button
                          onClick={() => handleDelete(resident.id)}
                          title="Delete"
                          className="btn btn-sm btn-outline-danger"
                        >
                          🗑
                        </button>

                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="9"
                    className="text-center text-secondary py-5"
                  >
                    No residents found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div
          className="modal d-block"
          tabIndex="-1"
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
          onClick={closeModal}
        >
          <div
            className="modal-dialog modal-dialog-centered modal-dialog-scrollable modal-lg"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-content">

              {/* Modal Header */}
              <div className="modal-header">
                <h5 className="modal-title fw-bold">
                  {modalMode === "add" && "Add New Resident"}
                  {modalMode === "edit" && "Update Resident"}
                  {modalMode === "view" && "Resident Details"}
                </h5>

                <button
                  type="button"
                  className="btn-close"
                  onClick={closeModal}
                />
              </div>

              {/* View Mode */}
              {modalMode === "view" && selectedResident && (
                <div className="modal-body">

                  <div className="mb-4">
                    <p className="small text-uppercase fw-semibold text-secondary mb-1">
                      Resident Name
                    </p>

                    <p className="fw-semibold mb-0">
                      {selectedResident.name}
                    </p>
                  </div>

                  <div className="row g-4">

                    <div className="col-sm-6">
                      <p className="small text-uppercase fw-semibold text-secondary mb-1">
                        Age
                      </p>

                      <p className="mb-0">
                        {selectedResident.age}
                      </p>
                    </div>

                    <div className="col-sm-6">
                      <p className="small text-uppercase fw-semibold text-secondary mb-1">
                        Gender
                      </p>

                      <p className="mb-0">
                        {selectedResident.gender}
                      </p>
                    </div>

                    <div className="col-sm-6">
                      <p className="small text-uppercase fw-semibold text-secondary mb-1">
                        Phone
                      </p>

                      <p className="mb-0">
                        {selectedResident.phone}
                      </p>
                    </div>

                    <div className="col-sm-6">
                      <p className="small text-uppercase fw-semibold text-secondary mb-1">
                        Email
                      </p>

                      <p className="mb-0">
                        {selectedResident.email}
                      </p>
                    </div>

                  </div>

                  <div className="mt-4">
                    <p className="small text-uppercase fw-semibold text-secondary mb-1">
                      Address
                    </p>

                    <p className="mb-0">
                      {selectedResident.address}
                    </p>
                  </div>

                  <div className="mt-4">
                    <p className="small text-uppercase fw-semibold text-secondary mb-1">
                      Status
                    </p>

                    <span
                      className={`badge rounded-pill ${
                        selectedResident.status === "Active"
                          ? "text-bg-success"
                          : "text-bg-danger"
                      }`}
                    >
                      {selectedResident.status}
                    </span>
                  </div>

                </div>
              )}
              {(modalMode === "add" || modalMode === "edit") && (
                <form onSubmit={handleSubmit}>

                  <div className="modal-body">

                    <div className="row g-4">

                      {/* Name */}
                      <div className="col-sm-6">
                        <label className="form-label fw-semibold">
                          Resident Name{" "}
                          <span className="text-danger">*</span>
                        </label>

                        <input
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          placeholder="Enter resident name"
                          className="form-control"
                        />
                      </div>
                      <div className="col-sm-6">
                        <label className="form-label fw-semibold">
                          Age
                        </label>

                        <input
                          type="number"
                          name="age"
                          value={formData.age}
                          onChange={handleChange}
                          placeholder="Enter age"
                          className="form-control"
                        />
                      </div>
                      <div className="col-sm-6">
                        <label className="form-label fw-semibold">
                          Gender
                        </label>

                        <select
                          name="gender"
                          value={formData.gender}
                          onChange={handleChange}
                          className="form-select"
                        >
                          <option value="">
                            Select Gender
                          </option>

                          <option value="Male">
                            Male
                          </option>

                          <option value="Female">
                            Female
                          </option>

                          <option value="Other">
                            Other
                          </option>
                        </select>
                      </div>
                      <div className="col-sm-6">
                        <label className="form-label fw-semibold">
                          Phone{" "}
                          <span className="text-danger">*</span>
                        </label>

                        <input
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleChange}
                          placeholder="Enter phone number"
                          className="form-control"
                        />
                      </div>
                      <div className="col-sm-6">
                        <label className="form-label fw-semibold">
                          Email{" "}
                          <span className="text-danger">*</span>
                        </label>

                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          placeholder="Enter email"
                          className="form-control"
                        />
                      </div>

                      {/* Status */}
                      <div className="col-sm-6">
                        <label className="form-label fw-semibold">
                          Status
                        </label>

                        <select
                          name="status"
                          value={formData.status}
                          onChange={handleChange}
                          className="form-select"
                        >
                          <option value="Active">
                            Active
                          </option>

                          <option value="Inactive">
                            Inactive
                          </option>
                        </select>
                      </div>
                      <div className="col-12">
                        <label className="form-label fw-semibold">
                          Address
                        </label>

                        <textarea
                          name="address"
                          value={formData.address}
                          onChange={handleChange}
                          placeholder="Enter resident address"
                          rows="3"
                          className="form-control"
                        />
                      </div>

                    </div>
                  </div>
                  <div className="modal-footer">

                    <button
                      type="button"
                      onClick={closeModal}
                      className="btn btn-secondary"
                    >
                      Cancel
                    </button>

                    <button
                      type="submit"
                      className="btn btn-primary"
                    >
                      {modalMode === "add"
                        ? "Add Resident"
                        : "Update Resident"}
                    </button>

                  </div>
                </form>
              )}
              {modalMode === "view" && (
                <div className="modal-footer">
                  <button
                    onClick={closeModal}
                    className="btn btn-secondary"
                  >
                    Close
                  </button>
                </div>
              )}

            </div>
          </div>
        </div>
      )}
    </div>
  );
}
