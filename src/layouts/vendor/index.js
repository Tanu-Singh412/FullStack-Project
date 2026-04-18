import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import TextField from "@mui/material/TextField";

import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";

function VendorHome() {
  const navigate = useNavigate();

  const [categories, setCategories] = useState([]);
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");

  useEffect(() => {
    fetch("/api/vendor-categories")
      .then((res) => res.json())
      .then((data) => setCategories(data));
  }, []);

  const addCategory = async () => {
    const res = await fetch("/api/vendor-categories", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name }),
    });

    const data = await res.json();
    setCategories([...categories, data]);
    setOpen(false);
    setName("");
  };

  return (
    <MDBox p={3}>
      <Button onClick={() => setOpen(true)}>+ Add Category</Button>

      <Grid container spacing={3}>
        {categories.map((c) => (
          <Grid item xs={3} key={c._id}>
            <Card onClick={() => navigate(`/vendors/${c.name}`)}>
              <MDTypography>{c.name}</MDTypography>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Dialog open={open}>
        <MDBox p={3}>
          <TextField onChange={(e) => setName(e.target.value)} />
          <Button onClick={addCategory}>Save</Button>
        </MDBox>
      </Dialog>
    </MDBox>
  );
}

export default VendorHome;