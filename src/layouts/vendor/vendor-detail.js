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
import IconButton from "@mui/material/IconButton";
import EditIcon from "@mui/icons-material/Edit";
import PhoneIcon from "@mui/icons-material/Phone";
import EmailIcon from "@mui/icons-material/Email";
import BusinessIcon from "@mui/icons-material/Business";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import PersonIcon from "@mui/icons-material/Person";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";

function VendorDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [vendor, setVendor] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [clients, setClients] = useState([]);
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState("");

  const fetchVendor = () => {
    fetch(`https://fullstack-project-1-n510.onrender.com/api/vendors/${id}`)
      .then((res) => res.json())
      .then((res) => {
        setVendor(res.data);
        setPreview(res.data.image || "");
      })
      .catch((err) => console.error(err));
  };

  useEffect(() => {
    fetchVendor();

    fetch("https://fullstack-project-1-n510.onrender.com/api/clients")
      .then((res) => res.json())
      .then((data) => setClients(data))
      .catch((err) => console.log(err));
  }, [id]);

  const handleChange = (e) => {
    setVendor({ ...vendor, [e.target.name]: e.target.value });
  };

  const handleUpdate = async () => {
    const formData = new FormData();
    Object.keys(vendor).forEach(key => {
      if (key === "materials") {
        formData.append(key, JSON.stringify(vendor[key]));
      } else {
        formData.append(key, vendor[key]);
      }
    });

    if (image) {
      formData.append("image", image);
    }

    await fetch(`https://fullstack-project-1-n510.onrender.com/api/vendors/${id}`, {
      method: "PUT",
      body: formData,
    });

    setEditMode(false);
    setImage(null);
    fetchVendor();
  };

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this vendor? This action cannot be undone.")) return;

    await fetch(`https://fullstack-project-1-n510.onrender.com/api/vendors/${id}`, {
      method: "DELETE",
    });

    navigate("/vendor");
  };

  if (!vendor) return <p>Loading...</p>;

  return (
    <DashboardLayout>
      <DashboardNavbar />

      <Box sx={{ p: 4 }}>
        <Grid container spacing={4}>
          {/* LEFT COLUMN: VENDOR PROFILE */}
          <Grid item xs={12} md={4}>
            <Card sx={{ p: 4, textAlign: "center", borderRadius: 5, boxShadow: "0 10px 40px rgba(0,0,0,0.08)", height: "100%" }}>
              <Box sx={{ position: "relative", width: 180, height: 180, mx: "auto", mb: 3 }}>
                <Avatar 
                  src={preview}
                  sx={{ 
                    width: "100%", 
                    height: "100%", 
                    bgcolor: '#3b82f6', 
                    fontSize: "4rem",
                    boxShadow: "0 15px 35px rgba(59, 130, 246, 0.2)",
                    border: "6px solid #fff"
                  }}
                >
                  {vendor.vendorName?.charAt(0)}
                </Avatar>
                
                {editMode && (
                  <IconButton 
                    component="label"
                    sx={{ 
                      position: "absolute", 
                      bottom: 5, 
                      right: 5, 
                      bgcolor: "#fff", 
                      '&:hover': {bgcolor: "#f1f5f9"},
                      boxShadow: 3
                    }}
                  >
                    <CloudUploadIcon color="primary" />
                    <input 
                      type="file" 
                      hidden 
                      accept="image/*" 
                      onChange={(e) => {
                        const file = e.target.files[0];
                        if (file) {
                          setImage(file);
                          setPreview(URL.createObjectURL(file));
                        }
                      }}
                    />
                  </IconButton>
                )}
              </Box>

              <Typography variant="h4" fontWeight="bold" sx={{ mb: 1 }}>
                {vendor.vendorName}
              </Typography>
              <Chip 
                label={vendor.category?.toUpperCase()} 
                size="small" 
                sx={{ mb: 3, bgcolor: "#eff6ff", color: "#3b82f6", fontWeight: "bold", borderRadius: 2 }} 
              />

              <Divider sx={{ my: 3 }} />

              <Box sx={{ textAlign: "left", display: "flex", flexDirection: "column", gap: 2.5 }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                  <PhoneIcon sx={{ color: "#3b82f6" }} />
                  <Typography variant="body2" fontWeight="medium">{vendor.phone}</Typography>
                </Box>
                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                  <EmailIcon sx={{ color: "#3b82f6" }} />
                  <Typography variant="body2" fontWeight="medium">{vendor.email || "No email provided"}</Typography>
                </Box>
                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                  <BusinessIcon sx={{ color: "#3b82f6" }} />
                  <Typography variant="body2" fontWeight="medium">{vendor.company || "No company name"}</Typography>
                </Box>
                <Box sx={{ display: "flex", alignItems: "start", gap: 2 }}>
                  <LocationOnIcon sx={{ color: "#3b82f6", mt: 0.5 }} />
                  <Typography variant="body2" fontWeight="medium">{vendor.address || "No address provided"}</Typography>
                </Box>
              </Box>

              <Box sx={{ mt: 5, display: "flex", gap: 2 }}>
                {!editMode ? (
                  <>
                    <Button 
                      fullWidth 
                      variant="contained" 
                      sx={{ background: "linear-gradient(135deg, #3b82f6, #2563eb)", color: "#fff", borderRadius: 2 }}
                      onClick={() => setEditMode(true)}
                    >
                      Edit Profile
                    </Button>
                    <Button 
                      variant="outlined" 
                      color="error" 
                      sx={{ borderRadius: 2 }}
                      onClick={handleDelete}
                    >
                      Delete
                    </Button>
                  </>
                ) : (
                  <>
                    <Button 
                      fullWidth 
                      variant="contained" 
                      sx={{ background: "linear-gradient(135deg, #10b981, #059669)", color: "#fff", borderRadius: 2 }}
                      onClick={handleUpdate}
                    >
                      Save
                    </Button>
                    <Button 
                      fullWidth 
                      variant="outlined" 
                      sx={{ borderRadius: 2 }}
                      onClick={() => { setEditMode(false); setPreview(vendor.image || ""); }}
                    >
                      Cancel
                    </Button>
                  </>
                )}
              </Box>
            </Card>
          </Grid>

          {/* RIGHT COLUMN: DETAILS & MATERIALS */}
          <Grid item xs={12} md={8}>
            <Grid container spacing={4}>
              {/* ASSOCIATION INFO */}
              <Grid item xs={12}>
                <Card sx={{ p: 4, borderRadius: 5, boxShadow: "0 10px 40px rgba(0,0,0,0.05)" }}>
                  <Typography variant="h5" fontWeight="bold" sx={{ mb: 3, display: "flex", alignItems: "center", gap: 1.5 }}>
                    <PersonIcon sx={{ color: "#3b82f6" }} /> Association Details
                  </Typography>
                  
                  {!editMode ? (
                    <Box sx={{ p: 3, bgcolor: "#f8fafc", borderRadius: 3, border: "1px solid #f1f5f9" }}>
                      <Typography variant="body1">
                        Associated Client: <span style={{ fontWeight: 700, color: "#1e293b" }}>{vendor.clientName || "None"}</span>
                      </Typography>
                      <Typography variant="caption" color="textSecondary">
                        Client ID: {vendor.clientId || "N/A"}
                      </Typography>
                    </Box>
                  ) : (
                    <Box>
                      <Typography variant="button" fontWeight="bold" sx={{ mb: 1, display: "block" }}>Select Client</Typography>
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
                        sx={{ height: "50px", borderRadius: 2 }}
                      >
                        <MenuItem value="" disabled>Select Client</MenuItem>
                        {clients.map((c) => (
                          <MenuItem key={c._id} value={c.clientId}>
                            {c.name} ({c.clientId})
                          </MenuItem>
                        ))}
                      </Select>
                    </Box>
                  )}
                </Card>
              </Grid>

              {/* MATERIALS */}
              <Grid item xs={12}>
                <Card sx={{ p: 4, borderRadius: 5, boxShadow: "0 10px 40px rgba(0,0,0,0.05)" }}>
                  <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                    <Typography variant="h5" fontWeight="bold">
                      Material Inventory
                    </Typography>
                    {editMode && (
                      <Button 
                        variant="contained" 
                        size="small"
                        sx={{ bgcolor: "#3b82f6", color: "#fff", borderRadius: 2 }}
                        onClick={() => setVendor({
                          ...vendor,
                          materials: [...(vendor.materials || []), { materialName: "", rate: "", quantity: "" }]
                        })}
                      >
                        + Add Item
                      </Button>
                    )}
                  </Box>

                  {!editMode ? (
                    vendor.materials?.length ? (
                      <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                        {vendor.materials.map((m, i) => (
                          <Box 
                            key={i} 
                            sx={{ 
                              display: "flex", 
                              justifyContent: "space-between", 
                              alignItems: "center",
                              p: 2.5, 
                              borderRadius: 3,
                              bgcolor: "#fff",
                              border: "1px solid #f1f5f9",
                              '&:hover': { bgcolor: "#f8fafc" }
                            }}
                          >
                            <Box>
                              <Typography fontWeight="bold" sx={{ color: "#1e293b" }}>{m.materialName}</Typography>
                              <Typography variant="caption" color="textSecondary">Premium Quality Material</Typography>
                            </Box>
                            <Box display="flex" gap={6} alignItems="center">
                              <Box sx={{ textAlign: "right" }}>
                                <Typography variant="caption" color="textSecondary" display="block">Quantity</Typography>
                                <Typography variant="body2" fontWeight="bold">{m.quantity || 0}</Typography>
                              </Box>
                              <Box sx={{ textAlign: "right" }}>
                                <Typography variant="caption" color="textSecondary" display="block">Unit Price</Typography>
                                <Typography variant="h6" fontWeight="bold" color="primary">₹{m.rate}</Typography>
                              </Box>
                            </Box>
                          </Box>
                        ))}
                      </Box>
                    ) : (
                      <Typography variant="body2" color="textSecondary" align="center" sx={{ py: 4 }}>
                        No material records found for this vendor.
                      </Typography>
                    )
                  ) : (
                    <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                      {vendor.materials?.map((m, index) => (
                        <Grid container spacing={2} key={index} alignItems="center">
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
                            }}>Remove</Button>
                          </Grid>
                        </Grid>
                      ))}
                    </Box>
                  )}
                </Card>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Box>

      <Footer />
    </DashboardLayout>
  );
}

export default VendorDetail;
