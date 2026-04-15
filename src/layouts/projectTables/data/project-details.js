import { useLocation } from "react-router-dom";
import { useState } from "react";

import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";

import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";

function ProjectDetails() {
  const { state } = useLocation();
  const [tab, setTab] = useState(0);
  const [drawingType, setDrawingType] = useState(null);

  if (!state) return <div>No Data</div>;

  const handleChange = (event, newValue) => {
    setTab(newValue);
  };

  const total = Number(state.totalAmount || 0);
  const paid = (state.payments || []).reduce((sum, p) => sum + Number(p.amount), 0);
  const balance = total - paid;

  return (
    <MDBox p={3}>
      <MDTypography variant="h4">{state.projectName}</MDTypography>

      <Box sx={{ borderBottom: 1, borderColor: "divider", mt: 2 }}>
        <Tabs value={tab} onChange={handleChange}>
          <Tab label="Overview" />
          <Tab label="Drawings" />
          <Tab label="Accounts" />
        </Tabs>
      </Box>

      {/* OVERVIEW */}
      {tab === 0 && (
        <MDBox mt={2}>
          <MDTypography>{state.description}</MDTypography>
        </MDBox>
      )}

      {/* DRAWINGS */}
      {tab === 1 && (
        <MDBox mt={2}>
          {!drawingType && (
            <MDBox display="flex" gap={2}>
              <MDBox onClick={() => setDrawingType("civil")}>Civil</MDBox>
              <MDBox onClick={() => setDrawingType("interior")}>Interior</MDBox>
            </MDBox>
          )}

          {drawingType && (
            <>
              <button onClick={() => setDrawingType(null)}>Back</button>

              <MDBox display="flex" flexWrap="wrap" gap={2}>
                {(drawingType === "civil"
                  ? state.civilImages
                  : state.interiorImages
                )?.map((img, i) => (
                  <img key={i} src={img} width="200" />
                ))}
              </MDBox>
            </>
          )}
        </MDBox>
      )}

      {/* ACCOUNTS */}
      {tab === 2 && (
        <MDBox mt={2}>
          <MDTypography>Total: ₹ {total}</MDTypography>
          <MDTypography>Paid: ₹ {paid}</MDTypography>
          <MDTypography>Balance: ₹ {balance}</MDTypography>
        </MDBox>
      )}
    </MDBox>
  );
}

export default ProjectDetails;