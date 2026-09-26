
import  { useMemo, useState } from "react";

const HostelRoomManagement = () => {
  const [activeTab, setActiveTab] = useState("hostels"
  );
  const [hostels, setHostels] = useState([
    {
      id: 1,
      name: "Boys Hostel - Block A",
      location: "Main Campus",
      type: "Boys",
      totalRooms: 20,
      status: "Active",
    },
    {
      id: 2,
      name: "Girls Hostel - Block B",
      location: "East Campus",
      type: "Girls",
      totalRooms: 25,
      status: "Active",
    },
  ]);

  const [rooms, setRooms] = useState([
    {
      id: 1,
      hostelId: 1,
      roomNumber: "A-101",
      floor: "Ground Floor",
      capacity: 4,
      occupied: 3,
      status: "Available",
    },
    {
      id: 2,
      hostelId: 1,
      roomNumber: "A-102",
      floor: "Ground Floor",
      capacity: 4,
      occupied: 4,
      status: "Full",
    },
    {
      id: 3,
      hostelId: 2,
      roomNumber: "B-201",
      floor: "First Floor",
      capacity: 3,
      occupied: 1,
      status: "Available",
    },
  ]);

  const [residents, setResidents] = useState([
    {
      id: 1,
      name: "Arun Kumar",
      registerNo: "STU001",
      roomId: 1,
    },
    {
      id: 2,
      name: "Rahul",
      registerNo: "STU002",
      roomId: 1,
    },
    {
      id: 3,
      name: "Karthik",
      registerNo: "STU003",
      roomId: 1,
    },
    {
      id: 4,
      name: "Priya",
      registerNo: "STU004",
      roomId: 3,
    },
  ]);

  const [showHostelModal, setShowHostelModal] = useState(false);
  const [showRoomModal, setShowRoomModal] = useState(false);

  const [editingHostelId, setEditingHostelId] = useState(null);
  const [editingRoomId, setEditingRoomId] = useState(null);

  const [hostelForm, setHostelForm] = useState({
    name: "",
    location: "",
    type: "Boys",
    totalRooms: 0,
    status: "Active" ,
  });

  const [roomForm, setRoomForm] = useState({
    hostelId: 1,
    roomNumber: "",
    floor: "Ground Floor",
    capacity: 1,
    occupied: 0,
    status: "Available" ,
  });

  const [search, setSearch] = useState("");

  /* ---------------- DASHBOARD CALCULATIONS ---------------- */

  const totalRooms = rooms.length;

  const totalCapacity = rooms.reduce(
    (total, room) => total + room.capacity,
    0
  );

  const totalOccupied = rooms.reduce(
    (total, room) => total + room.occupied,
    0
  );

  const availableBeds = totalCapacity - totalOccupied;

  const occupancyPercentage =
    totalCapacity > 0
      ? Math.round((totalOccupied / totalCapacity) * 100)
      : 0;

  /* ---------------- HOSTEL ---------------- */

  const openAddHostel = () => {
    setEditingHostelId(null);

    setHostelForm({
      name: "",
      location: "",
      type: "Boys",
      totalRooms: 0,
      status: "Active",
    });

    setShowHostelModal(true);
  };

  const editHostel = (hostel) => {
    setEditingHostelId(hostel.id);

    setHostelForm({
      name: hostel.name,
      location: hostel.location,
      type: hostel.type,
      totalRooms: hostel.totalRooms,
      status: hostel.status,
    });

    setShowHostelModal(true);
  };

  const saveHostel = () => {
    if (!hostelForm.name.trim()) {
      alert("Please enter hostel name");
      return;
    }

    if (editingHostelId) {
      setHostels((prev) =>
        prev.map((hostel) =>
          hostel.id === editingHostelId
            ? {
                ...hostel,
                ...hostelForm,
              }
            : hostel
        )
      );
    } else {
      const newHostel= {
        id: Date.now(),
        ...hostelForm,
      };

      setHostels((prev) => [...prev, newHostel]);
    }

    setShowHostelModal(false);
  };

  const deleteHostel = (id) => {
    if (!window.confirm("Delete this hostel?")) return;

    setHostels((prev) => prev.filter((hostel) => hostel.id !== id));

    setRooms((prev) => prev.filter((room) => room.hostelId !== id));
  };

  /* ---------------- ROOM ---------------- */

  const openAddRoom = () => {
    setEditingRoomId(null);

    setRoomForm({
      hostelId: hostels[0]?.id || 1,
      roomNumber: "",
      floor: "Ground Floor",
      capacity: 1,
      occupied: 0,
      status: "Available",
    });

    setShowRoomModal(true);
  };

  const editRoom = (room) => {
    setEditingRoomId(room.id);

    setRoomForm({
      hostelId: room.hostelId,
      roomNumber: room.roomNumber,
      floor: room.floor,
      capacity: room.capacity,
      occupied: room.occupied,
      status: room.status,
    });

    setShowRoomModal(true);
  };

  const saveRoom = () => {
    if (!roomForm.roomNumber.trim()) {
      alert("Please enter room number");
      return;
    }

    if (roomForm.occupied > roomForm.capacity) {
      alert("Occupied residents cannot exceed room capacity");
      return;
    }

    const calculatedStatus =
      roomForm.status === "Maintenance"
        ? "Maintenance"
        : roomForm.occupied >= roomForm.capacity
        ? "Full"
        : "Available";

    if (editingRoomId) {
      setRooms((prev) =>
        prev.map((room) =>
          room.id === editingRoomId
            ? {
                ...room,
                ...roomForm,
                status: calculatedStatus,
              }
            : room
        )
      );
    } else {
      const newRoom = {
        id: Date.now(),
        ...roomForm,
        status: calculatedStatus,
      };

      setRooms((prev) => [...prev, newRoom]);
    }

    setShowRoomModal(false);
  };

  const deleteRoom = (id) => {
    if (!window.confirm("Delete this room?")) return;

    setRooms((prev) => prev.filter((room) => room.id !== id));

    setResidents((prev) =>
      prev.map((resident) =>
        resident.roomId === id
          ? { ...resident, roomId: null }
          : resident
      )
    );
  };

  /* ---------------- RESIDENT ASSIGNMENT ---------------- */

  const assignResident = (residentId, roomId) => {
    const room = rooms.find((r) => r.id === roomId);

    if (!room) return;

    const resident = residents.find((r) => r.id === residentId);

    if (!resident) return;

    if (room.occupied >= room.capacity) {
      alert("Room is already full");
      return;
    }

    if (resident.roomId === roomId) return;

    // Remove resident from old room
    if (resident.roomId) {
      setRooms((prev) =>
        prev.map((r) =>
          r.id === resident.roomId
            ? {
                ...r,
                occupied: Math.max(0, r.occupied - 1),
                status: "Available",
              }
            : r
        )
      );
    }

    // Add resident to new room
    setRooms((prev) =>
      prev.map((r) =>
        r.id === roomId
          ? {
              ...r,
              occupied: r.occupied + 1,
              status:
                r.occupied + 1 >= r.capacity
                  ? "Full"
                  : "Available",
            }
          : r
      )
    );

    setResidents((prev) =>
      prev.map((r) =>
        r.id === residentId
          ? { ...r, roomId }
          : r
      )
    );
  };

  /* ---------------- FILTER ---------------- */

  const filteredRooms = useMemo(() => {
    return rooms.filter((room) => {
      const hostel = hostels.find(
        (hostel) => hostel.id === room.hostelId
      );

      return (
        room.roomNumber
          .toLowerCase()
          .includes(search.toLowerCase()) ||
        hostel?.name
          .toLowerCase()
          .includes(search.toLowerCase())
      );
    });
  }, [rooms, hostels, search]);

  const getHostelName = (hostelId) => {
    return (
      hostels.find((hostel) => hostel.id === hostelId)?.name ||
      "-"
    );
  };

  return (
    <div className="container-fluid bg-light min-vh-100 p-4">

      {/* HEADER */}

      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h3 className="fw-bold mb-1">
            Hostel & Room Management
          </h3>

          <small className="text-muted">
            Manage hostels, rooms, capacity and resident occupancy
          </small>
        </div>

        <button
          className="btn btn-primary"
          onClick={
            activeTab === "hostels"
              ? openAddHostel
              : openAddRoom
          }
        >
          +{" "}
          {activeTab === "hostels"
            ? "Add Hostel"
            : "Add Room"}
        </button>
      </div>

      {/* DASHBOARD CARDS */}

      <div className="row g-3 mb-4">

        <div className="col-md-3">
          <div className="card border-0 shadow-sm">
            <div className="card-body">
              <small className="text-muted">
                Total Hostels
              </small>

              <h3 className="fw-bold mt-2">
                {hostels.length}
              </h3>
            </div>
          </div>
        </div>

        <div className="col-md-3">
          <div className="card border-0 shadow-sm">
            <div className="card-body">
              <small className="text-muted">
                Total Rooms
              </small>

              <h3 className="fw-bold mt-2">
                {totalRooms}
              </h3>
            </div>
          </div>
        </div>

        <div className="col-md-3">
          <div className="card border-0 shadow-sm">
            <div className="card-body">
              <small className="text-muted">
                Available Beds
              </small>

              <h3 className="fw-bold text-success mt-2">
                {availableBeds}
              </h3>
            </div>
          </div>
        </div>

        <div className="col-md-3">
          <div className="card border-0 shadow-sm">
            <div className="card-body">
              <small className="text-muted">
                Occupancy
              </small>

              <h3 className="fw-bold mt-2">
                {occupancyPercentage}%
              </h3>

              <div className="progress mt-2">
                <div
                  className="progress-bar"
                  style={{
                    width: `${occupancyPercentage}%`,
                  }}
                />
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* TABS */}

      <div className="card border-0 shadow-sm">

        <div className="card-header bg-white">

          <ul className="nav nav-tabs border-0">

            <li className="nav-item">
              <button
                className={`nav-link ${
                  activeTab === "hostels"
                    ? "active"
                    : ""
                }`}
                onClick={() =>
                  setActiveTab("hostels")
                }
              >
                Hostels
              </button>
            </li>

            <li className="nav-item">
              <button
                className={`nav-link ${
                  activeTab === "rooms"
                    ? "active"
                    : ""
                }`}
                onClick={() =>
                  setActiveTab("rooms")
                }
              >
                Rooms
              </button>
            </li>

            <li className="nav-item">
              <button
                className={`nav-link ${
                  activeTab === "residents"
                    ? "active"
                    : ""
                }`}
                onClick={() =>
                  setActiveTab("residents")
                }
              >
                Resident Allocation
              </button>
            </li>

          </ul>

        </div>

        <div className="card-body">

          {/* HOSTEL TAB */}

          {activeTab === "hostels" && (
            <div className="table-responsive">

              <table className="table table-hover align-middle">

                <thead>
                  <tr>
                    <th>#</th>
                    <th>Hostel Name</th>
                    <th>Location</th>
                    <th>Type</th>
                    <th>Total Rooms</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>

                <tbody>

                  {hostels.map((hostel, index) => (
                    <tr key={hostel.id}>

                      <td>{index + 1}</td>

                      <td className="fw-semibold">
                        {hostel.name}
                      </td>

                      <td>{hostel.location}</td>

                      <td>
                        <span className="badge bg-secondary">
                          {hostel.type}
                        </span>
                      </td>

                      <td>{hostel.totalRooms}</td>

                      <td>
                        <span
                          className={`badge ${
                            hostel.status === "Active"
                              ? "bg-success"
                              : "bg-danger"
                          }`}
                        >
                          {hostel.status}
                        </span>
                      </td>

                      <td>
                        <button
                          className="btn btn-sm btn-outline-primary me-2"
                          onClick={() =>
                            editHostel(hostel)
                          }
                        >
                          Edit
                        </button>

                        <button
                          className="btn btn-sm btn-outline-danger"
                          onClick={() =>
                            deleteHostel(hostel.id)
                          }
                        >
                          Delete
                        </button>
                      </td>

                    </tr>
                  ))}

                </tbody>

              </table>

            </div>
          )}

          {/* ROOMS TAB */}

          {activeTab === "rooms" && (
            <>
              <div className="row mb-3">

                <div className="col-md-5">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Search room or hostel..."
                    value={search}
                    onChange={(e) =>
                      setSearch(e.target.value)
                    }
                  />
                </div>

              </div>

              <div className="table-responsive">

                <table className="table table-hover align-middle">

                  <thead>
                    <tr>
                      <th>Room</th>
                      <th>Hostel</th>
                      <th>Floor</th>
                      <th>Capacity</th>
                      <th>Occupied</th>
                      <th>Available</th>
                      <th>Occupancy</th>
                      <th>Status</th>
                      <th>Action</th>
                    </tr>
                  </thead>

                  <tbody>

                    {filteredRooms.map((room) => {

                      const available =
                        room.capacity -
                        room.occupied;

                      const percentage =
                        Math.round(
                          (room.occupied /
                            room.capacity) *
                            100
                        );

                      return (
                        <tr key={room.id}>

                          <td className="fw-bold">
                            {room.roomNumber}
                          </td>

                          <td>
                            {getHostelName(
                              room.hostelId
                            )}
                          </td>

                          <td>{room.floor}</td>

                          <td>{room.capacity}</td>

                          <td>{room.occupied}</td>

                          <td>
                            <span className="text-success fw-semibold">
                              {available}
                            </span>
                          </td>

                          <td style={{ minWidth: 130 }}>

                            <div className="progress mb-1">

                              <div
                                className={`progress-bar ${
                                  percentage >= 100
                                    ? "bg-danger"
                                    : percentage >= 75
                                    ? "bg-warning"
                                    : "bg-success"
                                }`}
                                style={{
                                  width: `${percentage}%`,
                                }}
                              />

                            </div>

                            <small>
                              {percentage}%
                            </small>

                          </td>

                          <td>

                            <span
                              className={`badge ${
                                room.status ===
                                "Available"
                                  ? "bg-success"
                                  : room.status ===
                                    "Full"
                                  ? "bg-danger"
                                  : "bg-warning text-dark"
                              }`}
                            >
                              {room.status}
                            </span>

                          </td>

                          <td>

                            <button
                              className="btn btn-sm btn-outline-primary me-2"
                              onClick={() =>
                                editRoom(room)
                              }
                            >
                              Edit
                            </button>

                            <button
                              className="btn btn-sm btn-outline-danger"
                              onClick={() =>
                                deleteRoom(room.id)
                              }
                            >
                              Delete
                            </button>

                          </td>

                        </tr>
                      );
                    })}

                  </tbody>

                </table>

              </div>
            </>
          )}

          {/* RESIDENT TAB */}

          {activeTab === "residents" && (
            <div className="table-responsive">

              <table className="table table-hover align-middle">

                <thead>

                  <tr>
                    <th>#</th>
                    <th>Resident</th>
                    <th>Register No</th>
                    <th>Current Room</th>
                    <th>Assign Room</th>
                  </tr>

                </thead>

                <tbody>

                  {residents.map(
                    (resident, index) => {

                      const currentRoom =
                        rooms.find(
                          (room) =>
                            room.id ===
                            resident.roomId
                        );

                      return (
                        <tr key={resident.id}>

                          <td>
                            {index + 1}
                          </td>

                          <td className="fw-semibold">
                            {resident.name}
                          </td>

                          <td>
                            {resident.registerNo}
                          </td>

                          <td>

                            {currentRoom ? (
                              <span className="badge bg-primary">
                                {
                                  currentRoom.roomNumber
                                }
                              </span>
                            ) : (
                              <span className="text-muted">
                                Not Assigned
                              </span>
                            )}

                          </td>

                          <td>

                            <select
                              className="form-select"
                              value={
                                resident.roomId ||
                                ""
                              }
                              onChange={(e) =>
                                assignResident(
                                  resident.id,
                                  Number(
                                    e.target.value
                                  )
                                )
                              }
                            >

                              <option value="">
                                Select Room
                              </option>

                              {rooms
                                .filter(
                                  (room) =>
                                    room.status !==
                                      "Maintenance" &&
                                    (room.occupied <
                                      room.capacity ||
                                      room.id ===
                                        resident.roomId)
                                )
                                .map((room) => (
                                  <option
                                    key={room.id}
                                    value={room.id}
                                  >
                                    {
                                      room.roomNumber
                                    }{" "}
                                    -{" "}
                                    {
                                      room.occupied
                                    }
                                    /
                                    {
                                      room.capacity
                                    }
                                  </option>
                                ))}

                            </select>

                          </td>

                        </tr>
                      );
                    }
                  )}

                </tbody>

              </table>

            </div>
          )}

        </div>

      </div>

      {/* HOSTEL MODAL */}

      {showHostelModal && (
        <div
          className="modal d-block"
          tabIndex={-1}
          style={{
            backgroundColor:
              "rgba(0,0,0,0.5)",
          }}
        >

          <div className="modal-dialog modal-dialog-centered">

            <div className="modal-content">

              <div className="modal-header">

                <h5 className="modal-title">
                  {editingHostelId
                    ? "Edit Hostel"
                    : "Add Hostel"}
                </h5>

                <button
                  className="btn-close"
                  onClick={() =>
                    setShowHostelModal(false)
                  }
                />

              </div>

              <div className="modal-body">

                <div className="mb-3">

                  <label className="form-label">
                    Hostel Name
                  </label>

                  <input
                    type="text"
                    className="form-control"
                    value={hostelForm.name}
                    onChange={(e) =>
                      setHostelForm({
                        ...hostelForm,
                        name: e.target.value,
                      })
                    }
                  />

                </div>

                <div className="mb-3">

                  <label className="form-label">
                    Location
                  </label>

                  <input
                    type="text"
                    className="form-control"
                    value={hostelForm.location}
                    onChange={(e) =>
                      setHostelForm({
                        ...hostelForm,
                        location: e.target.value,
                      })
                    }
                  />

                </div>

                <div className="row">

                  <div className="col-md-6 mb-3">

                    <label className="form-label">
                      Hostel Type
                    </label>

                    <select
                      className="form-select"
                      value={hostelForm.type}
                      onChange={(e) =>
                        setHostelForm({
                          ...hostelForm,
                          type: e.target.value,
                        })
                      }
                    >

                      <option value="Boys">
                        Boys
                      </option>

                      <option value="Girls">
                        Girls
                      </option>

                      <option value="Mixed">
                        Mixed
                      </option>

                    </select>

                  </div>

                  <div className="col-md-6 mb-3">

                    <label className="form-label">
                      Total Rooms
                    </label>

                    <input
                      type="number"
                      className="form-control"
                      value={
                        hostelForm.totalRooms
                      }
                      onChange={(e) =>
                        setHostelForm({
                          ...hostelForm,
                          totalRooms: Number(
                            e.target.value
                          ),
                        })
                      }
                    />

                  </div>

                </div>

                <div className="mb-3">

                  <label className="form-label">
                    Status
                  </label>

                  <select
                    className="form-select"
                    value={hostelForm.status}
                    onChange={(e) =>
                      setHostelForm({
                        ...hostelForm,
                        status: e.target
                          .value 
                      })
                    }
                  >

                    <option value="Active">
                      Active
                    </option>

                    <option value="Inactive">
                      Inactive
                    </option>

                  </select>

                </div>

              </div>

              <div className="modal-footer">

                <button
                  className="btn btn-secondary"
                  onClick={() =>
                    setShowHostelModal(false)
                  }
                >
                  Cancel
                </button>

                <button
                  className="btn btn-primary"
                  onClick={saveHostel}
                >
                  Save Hostel
                </button>

              </div>

            </div>

          </div>

        </div>
      )}

      {/* ROOM MODAL */}

      {showRoomModal && (
        <div
          className="modal d-block"
          tabIndex={-1}
          style={{
            backgroundColor:
              "rgba(0,0,0,0.5)",
          }}
        >

          <div className="modal-dialog modal-dialog-centered">

            <div className="modal-content">

              <div className="modal-header">

                <h5 className="modal-title">
                  {editingRoomId
                    ? "Edit Room"
                    : "Add Room"}
                </h5>

                <button
                  className="btn-close"
                  onClick={() =>
                    setShowRoomModal(false)
                  }
                />

              </div>

              <div className="modal-body">

                <div className="mb-3">

                  <label className="form-label">
                    Hostel
                  </label>

                  <select
                    className="form-select"
                    value={roomForm.hostelId}
                    onChange={(e) =>
                      setRoomForm({
                        ...roomForm,
                        hostelId: Number(
                          e.target.value
                        ),
                      })
                    }
                  >

                    {hostels.map((hostel) => (
                      <option
                        key={hostel.id}
                        value={hostel.id}
                      >
                        {hostel.name}
                      </option>
                    ))}

                  </select>

                </div>

                <div className="row">

                  <div className="col-md-6 mb-3">

                    <label className="form-label">
                      Room Number
                    </label>

                    <input
                      type="text"
                      className="form-control"
                      placeholder="A-101"
                      value={
                        roomForm.roomNumber
                      }
                      onChange={(e) =>
                        setRoomForm({
                          ...roomForm,
                          roomNumber:
                            e.target.value,
                        })
                      }
                    />

                  </div>

                  <div className="col-md-6 mb-3">

                    <label className="form-label">
                      Floor
                    </label>

                    <select
                      className="form-select"
                      value={roomForm.floor}
                      onChange={(e) =>
                        setRoomForm({
                          ...roomForm,
                          floor: e.target.value,
                        })
                      }
                    >

                      <option>
                        Ground Floor
                      </option>

                      <option>
                        First Floor
                      </option>

                      <option>
                        Second Floor
                      </option>

                      <option>
                        Third Floor
                      </option>

                    </select>

                  </div>

                </div>

                <div className="row">

                  <div className="col-md-6 mb-3">

                    <label className="form-label">
                      Room Capacity
                    </label>

                    <input
                      type="number"
                      min={1}
                      className="form-control"
                      value={
                        roomForm.capacity
                      }
                      onChange={(e) =>
                        setRoomForm({
                          ...roomForm,
                          capacity: Number(
                            e.target.value
                          ),
                        })
                      }
                    />

                  </div>

                  <div className="col-md-6 mb-3">

                    <label className="form-label">
                      Current Occupancy
                    </label>

                    <input
                      type="number"
                      min={0}
                      className="form-control"
                      value={
                        roomForm.occupied
                      }
                      onChange={(e) =>
                        setRoomForm({
                          ...roomForm,
                          occupied: Number(
                            e.target.value
                          ),
                        })
                      }
                    />

                  </div>

                </div>

                <div className="mb-3">

                  <label className="form-label">
                    Room Status
                  </label>

                  <select
                    className="form-select"
                    value={roomForm.status}
                    onChange={(e) =>
                      setRoomForm({
                        ...roomForm,
                        status:
                          e.target
                            .value ,
                      })
                    }
                  >

                    <option value="Available">
                      Available
                    </option>

                    <option value="Maintenance">
                      Maintenance
                    </option>

                  </select>

                </div>

              </div>

              <div className="modal-footer">

                <button
                  className="btn btn-secondary"
                  onClick={() =>
                    setShowRoomModal(false)
                  }
                >
                  Cancel
                </button>

                <button
                  className="btn btn-primary"
                  onClick={saveRoom}
                >
                  Save Room
                </button>

              </div>

            </div>

          </div>

        </div>
      )}

    </div>
  );
};


export default HostelRoomManagement;
