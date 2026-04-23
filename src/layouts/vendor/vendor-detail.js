import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";

import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Avatar from "@mui/material/Avatar";
import Divider from "@mui/material/Divider";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";

function VendorDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [vendor, setVendor] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [clients, setClients] = useState([]);

  useEffect(() => {
    fetch(`https://fullstack-project-1-n510.onrender.com/api/vendors/${id}`)
      .then((res) => res.json())
      .then((res) => setVendor(res.data))
      .catch((err) => console.error(err));

    fetch("https://fullstack-project-1-n510.onrender.com/api/clients")
      .then((res) => res.json())
      .then((data) => setClients(data))
      .catch((err) => console.log(err));
  }, [id]);

  const handleChange = (e) => {
    setVendor({ ...vendor, [e.target.name]: e.target.value });
  };

  const handleUpdate = async () => {
    await fetch(`https://fullstack-project-1-n510.onrender.com/api/vendors/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(vendor),
    });

    setEditMode(false);
  };

  const handleDelete = async () => {
    if (!window.confirm("Are you sure?")) return;

    await fetch(`https://fullstack-project-1-n510.onrender.com/api/vendors/${id}`, {
      method: "DELETE",
    });

    navigate("/vendor");
  };

  if (!vendor) return <p>Loading...</p>;

  return (
    <DashboardLayout>
      <DashboardNavbar />

      <Box sx={{ p: 3 }}>
        <Grid container spacing={3}>
          {/* MAIN CARD */}
          <Grid item xs={12}>
            <Card sx={{ p: 4, borderRadius: 3, boxShadow: 4 }}>
              {/* HEADER */}
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                <Box display="flex" alignItems="center">
                  <Avatar sx={{ bgcolor: '#1976d2', mr: 2 , color:"#fff" }}>
                    {vendor.vendorName?.charAt(0)}
                  </Avatar>
                  <Typography variant="h5" fontWeight="bold">
                    {editMode ? "Edit Vendor" : vendor.vendorName}
                  </Typography>
                </Box>

                <Box>
                  {!editMode ? (
                    <>
                      <Button variant="contained" sx={{ mr: 1, color :"#fff" }} onClick={() => setEditMode(true)}>
                        Edit
                      </Button>
                      <Button variant="contained" color="error" onClick={handleDelete}>
                        Delete
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button variant="contained" sx={{ mr: 1 }} onClick={handleUpdate}>
                        Save
                      </Button>
                      <Button variant="outlined" onClick={() => setEditMode(false)}>
                        Cancel
                      </Button>
                    </>
                  )}
                </Box>
              </Box>

              <Divider sx={{ mb: 3 }} />

              {/* DETAILS */}
              {!editMode ? (
                <Grid container spacing={2}>
                  <Grid item xs={12} md={6}>
                    <Typography>📞 {vendor.phone}</Typography>
                    <Typography>📧 {vendor.email}</Typography>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Typography>🏢 {vendor.company}</Typography>
                    <Typography>📂 {vendor.category}</Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <Typography fontWeight="bold">👤 Client: {vendor.clientName} ({vendor.clientId})</Typography>
                  </Grid>
                </Grid>
              ) : (
                <Grid container spacing={2}>
                  <Grid item xs={12} md={6}>
                    <TextField fullWidth label="Vendor Name" name="vendorName" value={vendor.vendorName} onChange={handleChange} />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField fullWidth label="Phone" name="phone" value={vendor.phone} onChange={handleChange} />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField fullWidth label="Email" name="email" value={vendor.email} onChange={handleChange} />
                  </Grid>
                   <Grid item xs={12} md={6}>
                    <TextField fullWidth label="Company" name="company" value={vendor.company} onChange={handleChange} />
                  </Grid>
                  <Grid item xs={12}>
                    <Typography variant="button" fontWeight="bold">Client</Typography>
                    <Select
                      fullWidth
                      value={vendor.clientId || ""}
                      displayEmpty
                      onChange={(e) => {
                        const selected = clients.find((c) => c.clientId === e.target.value);
                        if (!selected) return;
                        setVendor({
                          ...vendor,
                          clientId: selected.clientId,
                          clientName: selected.name,
                        });
                      }}
                      sx={{ height: "45px", mt: 1 }}
                    >
                      <MenuItem value="" disabled>Select Client</MenuItem>
                      {clients.map((c) => (
                        <MenuItem key={c._id} value={c.clientId}>
                          {c.name} ({c.clientId})
                        </MenuItem>
                      ))}
                    </Select>
                  </Grid>
                </Grid>
              )}
            </Card>
          </Grid>

          {/* MATERIALS */}
          <Grid item xs={12}>
            <Card sx={{ p: 4, borderRadius: 3, boxShadow: 3 }}>
              <Typography variant="h6" mb={2} fontWeight="bold">
                Materials
              </Typography>

              {!editMode ? (
                vendor.materials?.length ? (
                  vendor.materials.map((m, i) => (
                   <Box key={i} display="flex" justifyContent="space-between" p={1} sx={{ borderBottom: '1px solid #eee' }}>
                      <Typography>{m.materialName}</Typography>
                      <Box display="flex" gap={4}>
                        <Typography>Qty: {m.quantity || 0}</Typography>
                        <Typography fontWeight="bold">₹{m.rate}</Typography>
                      </Box>
                    </Box>
                  ))
                ) : (
                  <Typography>No materials</Typography>
                )
              ) : (
                <>
                  {vendor.materials?.map((m, index) => (
                    <Grid container spacing={2} key={index} sx={{ mb: 1 }}>
                       <Grid item xs={4}>
                        <TextField fullWidth label="Material" value={m.materialName} onChange={(e) => {
                          const updated = [...vendor.materials];
                          updated[index].materialName = e.target.value;
                          setVendor({ ...vendor, materials: updated });
                        }} />
                      </Grid>

                      <Grid item xs={3}>
                        <TextField fullWidth type="number" label="Rate" value={m.rate} onChange={(e) => {
                          const updated = [...vendor.materials];
                          updated[index].rate = e.target.value;
                          setVendor({ ...vendor, materials: updated });
                        }} />
                      </Grid>

                      <Grid item xs={3}>
                        <TextField fullWidth type="number" label="Qty" value={m.quantity} onChange={(e) => {
                          const updated = [...vendor.materials];
                          updated[index].quantity = e.target.value;
                          setVendor({ ...vendor, materials: updated });
                        }} />
                      </Grid>

                      <Grid item xs={2}>
                        <Button color="error" onClick={() => {
                          const updated = vendor.materials.filter((_, i) => i !== index);
                          setVendor({ ...vendor, materials: updated });
                        }}>Delete</Button>
                      </Grid>
                    </Grid>
                  ))}

                   <Button variant="contained" sx={{ mt: 2 }} onClick={() => setVendor({
                    ...vendor,
                    materials: [...(vendor.materials || []), { materialName: "", rate: "", quantity: "" }]
                  })}>
                    + Add Material
                  </Button>
                </>
              )}
            </Card>
          </Grid>
        </Grid>
      </Box>

      <Footer />
    </DashboardLayout>
  );
}

export default VendorDetail;
