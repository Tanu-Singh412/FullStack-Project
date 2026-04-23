import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom"; 

// MUI
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import Divider from "@mui/material/Divider";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";

// Dashboard
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";

import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";

function AddVendor() {
  const navigate = useNavigate();
  const { category } = useParams(); 

  // =====================
  // FORM STATE
  // =====================
  const [form, setForm] = useState({
    vendorName: "",
    phone: "",
    email: "",
    address: "",
    company: "",
    gst: "",
    status: "Active",
    note: "",
    category: "",
    clientId: "",
    clientName: "",
    materials: [],
  });

  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState("");

  // =====================
  // AUTO SET CATEGORY FROM URL ✅
  // =====================
  useEffect(() => {
    if (category) {
      setForm((prev) => ({
        ...prev,
        category: category.toLowerCase(),
      }));
    }
  }, [category]);

  // =====================
  // FETCH CATEGORIES & CLIENTS
  // =====================
  const [categories, setCategories] = useState([]);
  const [clients, setClients] = useState([]);

  useEffect(() => {
    fetch("https://fullstack-project-1-n510.onrender.com/api/vendor-categories")
      .then((res) => res.json())
      .then((data) => setCategories(data.data || data))
      .catch((err) => console.log(err));

    fetch("https://fullstack-project-1-n510.onrender.com/api/clients")
      .then((res) => res.json())
      .then((data) => setClients(data))
      .catch((err) => console.log(err));
  }, []);

  // =====================
  // INPUT CHANGE
  // =====================
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // =====================
  // ADD MATERIAL
  // =====================
  const addMaterial = () => {
    setForm({
      ...form,
      materials: [...form.materials, { materialName: "", rate: "", quantity: "" }],
    });
  };

  // =====================
  // UPDATE MATERIAL
  // =====================
  const updateMaterial = (index, field, value) => {
    const updated = [...form.materials];
    updated[index][field] = value;

    // ✅ AUTO-CATEGORY LOGIC
    if (field === "materialName" && value) {
      const matchedCat = categories.find(
        (cat) => cat.name.toLowerCase() === value.toLowerCase()
      );
      if (matchedCat) {
        setForm((prev) => ({
          ...prev,
          category: matchedCat.name.toLowerCase(),
          materials: updated,
        }));
        return;
      }
    }

    setForm({ ...form, materials: updated });
  };

  // =====================
  // REMOVE MATERIAL
  // =====================
  const removeMaterial = (index) => {
    const updated = form.materials.filter((_, i) => i !== index);
    setForm({ ...form, materials: updated });
  };

  // =====================
  // SUBMIT
  // =====================
  const handleSubmit = async () => {
    if (!form.vendorName || !form.phone || !form.category) {
      alert("Vendor Name, Phone & Category required");
      return;
    }

    const formData = new FormData();
    // Append simple fields
    Object.keys(form).forEach(key => {
      if (key !== "materials") {
        formData.append(key, form[key]);
      }
    });

    // Append materials as JSON string
    const cleanedMaterials = form.materials
      .filter((m) => m.materialName?.trim())
      .map((m) => ({
        materialName: m.materialName,
        rate: Number(m.rate) || 0,
        quantity: Number(m.quantity) || 0,
      }));
    formData.append("materials", JSON.stringify(cleanedMaterials));

    // Append image
    if (image) {
      formData.append("image", image);
    }

    try {
      await fetch(
        "https://fullstack-project-1-n510.onrender.com/api/vendors",
        {
          method: "POST",
          body: formData, // ✅ Send FormData
        }
      );

      alert("Vendor Saved Successfully");
      navigate(`/vendor/category/${form.category}`);
    } catch (err) {
      console.log(err);
      alert("Something went wrong");
    }
  };

  // =====================
  // UI
  // =====================
  return (
    <DashboardLayout>
      <DashboardNavbar />

      <MDBox pt={6} pb={3} px={3}>
        <Grid container justifyContent="center">
          <Grid item xs={12} md={10} lg={8}>
            <Card sx={{ p: 4, borderRadius: 4, boxShadow: "0 10px 30px rgba(0,0,0,0.1)" }}>

              <MDBox display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                <MDTypography variant="h4" fontWeight="bold">
                  Register New Vendor
                </MDTypography>
                <MDTypography variant="button" fontWeight="medium" color="text">
                  Category: <span style={{color: "#3b82f6", textTransform: "capitalize"}}>{category || form.category}</span>
                </MDTypography>
              </MDBox>

              <Divider sx={{ mb: 4 }} />

              <Grid container spacing={3}>
                {/* PHOTO UPLOAD */}
                <Grid item xs={12}>
                  <MDBox 
                    sx={{ 
                      border: "2px dashed #e2e8f0", 
                      borderRadius: 4, 
                      p: 4, 
                      textAlign: "center",
                      bgcolor: "#f8fafc",
                      cursor: "pointer",
                      transition: "0.3s",
                      '&:hover': { borderColor: "#3b82f6", bgcolor: "#f1f5f9" }
                    }}
                    onClick={() => document.getElementById("vendor-img").click()}
                  >
                    {preview ? (
                      <MDBox sx={{ position: "relative", width: 120, height: 120, mx: "auto" }}>
                        <img src={preview} style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: "50%" }} />
                        <IconButton 
                          size="small" 
                          sx={{ position: "absolute", bottom: 0, right: 0, bgcolor: "#fff", boxShadow: 1 }}
                          onClick={(e) => { e.stopPropagation(); setImage(null); setPreview(""); }}
                        >
                          <DeleteIcon fontSize="small" color="error" />
                        </IconButton>
                      </MDBox>
                    ) : (
                      <MDBox>
                        <CloudUploadIcon sx={{ fontSize: 48, color: "#94a3b8", mb: 1 }} />
                        <MDTypography variant="h6" fontWeight="bold" color="textSecondary">
                          Upload Vendor Photo
                        </MDTypography>
                        <MDTypography variant="caption" color="textSecondary">
                          PNG, JPG or JPEG (Max 5MB)
                        </MDTypography>
                      </MDBox>
                    )}
                    <input 
                      type="file" 
                      id="vendor-img" 
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
                  </MDBox>
                </Grid>

                {/* CLIENT SELECT */}
                <Grid item xs={12}>
                  <MDTypography variant="button" fontWeight="bold" textTransform="capitalize" sx={{ mb: 1, display: "block" }}>
                    Associated Client
                  </MDTypography>
                  <Select
                    fullWidth
                    value={form.clientId || ""}
                    displayEmpty
                    onChange={(e) => {
                      const selected = clients.find((c) => c.clientId === e.target.value);
                      if (!selected) return;
                      setForm({
                        ...form,
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
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Vendor Name *"
                    name="vendorName"
                    value={form.vendorName}
                    onChange={handleChange}
                    variant="outlined"
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Phone *"
                    name="phone"
                    value={form.phone}
                    onChange={handleChange}
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Email Address"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="GST Number"
                    name="gst"
                    value={form.gst}
                    onChange={handleChange}
                  />
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Company Name"
                    name="company"
                    value={form.company}
                    onChange={handleChange}
                  />
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    multiline
                    rows={2}
                    label="Office/Business Address"
                    name="address"
                    value={form.address}
                    onChange={handleChange}
                  />
                </Grid>

                <Grid item xs={12}>
                  <MDTypography variant="button" fontWeight="bold" textTransform="capitalize" sx={{ mb: 1, display: "block" }}>
                    Business Category
                  </MDTypography>
                  <TextField
                    select
                    fullWidth
                    name="category"
                    value={form.category}
                    onChange={handleChange}
                    SelectProps={{ native: true }}
                    sx={{ height: "50px" }}
                  >
                    <option value=""></option>
                    {categories.map((cat) => (
                      <option key={cat._id || cat.name} value={cat.name.toLowerCase()}>
                        {cat.name}
                      </option>
                    ))}
                  </TextField>
                </Grid>

                {/* MATERIALS */}
                <Grid item xs={12}>
                  <MDBox display="flex" justifyContent="space-between" alignItems="center" mt={2} mb={2}>
                    <MDTypography variant="h5" fontWeight="bold">
                      Material Rates & Stock
                    </MDTypography>

                    <Button 
                      variant="contained"
                      startIcon={<AddIcon />}
                      onClick={addMaterial}
                      sx={{
                        background: "linear-gradient(135deg, #10b981, #059669)",
                        color: "#fff",
                        borderRadius: 2,
                        '&:hover': { background: "linear-gradient(135deg, #059669, #047857)" }
                      }}
                    >
                      Add Material
                    </Button>
                  </MDBox>
                  
                  {form.materials.length === 0 && (
                    <MDBox sx={{ p: 4, textAlign: "center", bgcolor: "#f8fafc", borderRadius: 3, border: "1px dashed #cbd5e1" }}>
                      <MDTypography variant="body2" color="textSecondary">
                        No materials added yet. Click the button above to add material rates.
                      </MDTypography>
                    </MDBox>
                  )}

                  {form.materials.map((mat, index) => (
                    <MDBox key={index} sx={{ mb: 2, p: 2, bgcolor: "#fff", border: "1px solid #f1f5f9", borderRadius: 3, boxShadow: "0 2px 5px rgba(0,0,0,0.02)" }}>
                      <Grid container spacing={2} alignItems="center">
                        <Grid item xs={12} sm={5}>
                          <TextField
                            fullWidth
                            label="Material Name"
                            placeholder="e.g. 53 Grade Cement"
                            value={mat.materialName}
                            onChange={(e) =>
                              updateMaterial(index, "materialName", e.target.value)
                            }
                          />
                        </Grid>

                        <Grid item xs={5} sm={3}>
                          <TextField
                            fullWidth
                            label="Rate (₹)"
                            type="number"
                            value={mat.rate}
                            onChange={(e) =>
                              updateMaterial(index, "rate", e.target.value)
                            }
                          />
                        </Grid>

                        <Grid item xs={5} sm={3}>
                          <TextField
                            fullWidth
                            label="Quantity"
                            type="number"
                            value={mat.quantity}
                            onChange={(e) =>
                              updateMaterial(index, "quantity", e.target.value)
                            }
                          />
                        </Grid>

                        <Grid item xs={2} sm={1}>
                          <IconButton
                            onClick={() => removeMaterial(index)}
                            sx={{ color: "#ef4444", '&:hover': {bgcolor: "#fef2f2"} }}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </Grid>
                      </Grid>
                    </MDBox>
                  ))}
                </Grid>

                <Grid item xs={12} mt={4}>
                  <Button 
                    fullWidth
                    variant="contained"
                    size="large"
                    onClick={handleSubmit}
                    sx={{
                      background: "linear-gradient(135deg, #3b82f6, #2563eb)",
                      color: "#fff",
                      py: 2,
                      borderRadius: 3,
                      fontWeight: "bold",
                      fontSize: "1rem",
                      boxShadow: "0 10px 20px rgba(59, 130, 246, 0.3)",
                      '&:hover': { 
                        background: "linear-gradient(135deg, #2563eb, #1d4ed8)",
                        transform: "translateY(-2px)",
                        boxShadow: "0 15px 30px rgba(59, 130, 246, 0.4)",
                      }
                    }}
                  >
                    Complete Registration
                  </Button>
                </Grid>

              </Grid>
            </Card>
          </Grid>
        </Grid>
      </MDBox>

      <Footer />
    </DashboardLayout>
  );
}

export default AddVendor;