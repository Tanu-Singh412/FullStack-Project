import { useEffect, useState } from "react";
import MDTypography from "components/MDTypography";
import MDBox from "components/MDBox";

import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";

import IconButton from "@mui/material/IconButton";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

import { useNavigate } from "react-router-dom";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import Avatar from "@mui/material/Avatar";
import Divider from "@mui/material/Divider";

import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import Button from "@mui/material/Button";
import DialogActions from "@mui/material/DialogActions";
export default function useClientTableData() {
  const navigate = useNavigate();

  const [rows, setRows] = useState([]);
  const [clients, setClients] = useState([]);
  const [selectedClient, setSelectedClient] = useState(null);
  const [deleteId, setDeleteId] = useState(null);

  const columns = [
    { Header: "S.No.", accessor: "serial" },
    { Header: "", accessor: "expand" },
    { Header: "Client", accessor: "client" },
    { Header: "Client ID", accessor: "clientId" },
    { Header: "Date", accessor: "date" },
    { Header: "Status", accessor: "status" },
    { Header: "Actions", accessor: "actions" },
  ];

  // LOAD DATA
  const loadData = async () => {
    try {
      const res = await fetch("https://fullstack-project-1-n510.onrender.com/api/clients");
      const data = await res.json();
      setClients(data);
    } catch (error) {
      console.error("Failed to fetch clients:", error);
    }
  };

  // STATUS UPDATE
  const handleStatusChange = async (id, value) => {
    setClients((prev) =>
      prev.map((c) => (c._id === id ? { ...c, status: value } : c))
    );

    const clientToUpdate = clients.find((c) => c._id === id);
    if (!clientToUpdate) return;

    await fetch(`https://fullstack-project-1-n510.onrender.com/api/clients/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...clientToUpdate, status: value }),
    });
  };

  // DELETE
  const deleteClient = async (id) => {
    try {
      await fetch(`https://fullstack-project-1-n510.onrender.com/api/clients/${id}`, {
        method: "DELETE",
      });
      loadData();
    } catch (error) {
      console.error("Failed to delete client:", error);
    }
  };

  // EDIT
  const editClient = (c) => {
    localStorage.setItem("editClient", JSON.stringify(c));
    navigate("/add-clients");
  };

  // FORMAT ROWS
  const formatRows = (data) => {
    return data
      .slice()
      .reverse()
      .map((c, i) => {
        const date = new Date(c.createdAt).toLocaleString();
        const currentStatus = c.status || "Active";
        const bg = currentStatus === "Active" ? "#4caf50" : "#f44336";

        return {
          serial: <MDTypography variant="caption">{i + 1}</MDTypography>,

          expand: (
            <IconButton onClick={() => setSelectedClient(c)}>
              <AddCircleIcon />
            </IconButton>
          ),

          client: <MDTypography variant="caption">{c.name}</MDTypography>,

          clientId: (
            <MDTypography variant="caption">
              {c.clientId || c._id}
            </MDTypography>
          ),

          date: <MDTypography variant="caption">{date}</MDTypography>,

          status: (
            <Select
              size="small"
              value={currentStatus}
              onChange={(e) => handleStatusChange(c._id, e.target.value)}
              sx={{ bgcolor: bg, color: "#fff" }}
            >
              <MenuItem value="Active">Active</MenuItem>
              <MenuItem value="Inactive">Inactive</MenuItem>
            </Select>
          ),

          actions: (
            <MDBox display="flex">
              <IconButton onClick={() => editClient(c)}>
                <EditIcon />
              </IconButton>

              <IconButton onClick={() => setDeleteId(c._id)}>
                <DeleteIcon />
              </IconButton>
            </MDBox>
          ),
        };
      });
  };

  // EFFECTS
  useEffect(() => {
    setRows(formatRows(clients));
  }, [clients]);

  useEffect(() => {
    loadData();
  }, []);

  // RETURN
  return {
    columns,
    rows,
    dialog: (
      <>
<Dialog
  open={!!selectedClient}
  onClose={() => setSelectedClient(null)}
  maxWidth="sm"
  fullWidth
>
  <DialogTitle sx={{ fontWeight: "bold" }}>
    Client Details
  </DialogTitle>

  <DialogContent>
    {selectedClient && (
      <MDBox>

        {/* HEADER */}
        <MDBox display="flex" alignItems="center" mb={2}>
          <Avatar sx={{ bgcolor: "#1976d2", mr: 2 }}>
            {selectedClient.name?.charAt(0)}
          </Avatar>

          <MDBox>
            <MDTypography variant="h6">
              {selectedClient.name}
            </MDTypography>

            <MDTypography variant="caption" color="text">
              ID: {selectedClient.clientId || selectedClient._id}
            </MDTypography>
          </MDBox>
        </MDBox>

        <Divider sx={{ mb: 2 }} />

        {/* DETAILS */}
        <MDBox display="flex" flexDirection="column" gap={1}>

          <MDTypography>
            📞 <b>Phone:</b> {selectedClient.phone || "-"}
          </MDTypography>

          <MDTypography>
            📧 <b>Email:</b> {selectedClient.email || "-"}
          </MDTypography>

          <MDTypography>
            📍 <b>Address:</b> {selectedClient.address || "-"}
          </MDTypography>

          <MDTypography>
            📅 <b>Created:</b>{" "}
            {new Date(selectedClient.createdAt).toLocaleDateString("en-IN")}
          </MDTypography>

          <MDTypography>
            📊 <b>Status:</b> {selectedClient.status || "Active"}
          </MDTypography>

        </MDBox>

      </MDBox>
    )}
  </DialogContent>
</Dialog>
      </>
    ),
  };
}