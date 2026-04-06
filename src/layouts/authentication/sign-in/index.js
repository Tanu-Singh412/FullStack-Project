import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import Card from "@mui/material/Card";
import Switch from "@mui/material/Switch";
import Grid from "@mui/material/Grid";

import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDInput from "components/MDInput";
import MDButton from "components/MDButton";

import BasicLayout from "layouts/authentication/components/BasicLayout";
import bgImage from "assets/images/bg-sign-in-basic.jpeg";

import { login, isAuthenticated } from "./auth";

function Basic() {
  const navigate = useNavigate();

  const [rememberMe, setRememberMe] = useState(false);

  const [form, setForm] = useState({
    username: "",
    password: "",
  });

  const handleSetRememberMe = () => setRememberMe(!rememberMe);

  // AUTO REDIRECT IF ALREADY LOGGED IN
  useEffect(() => {
    if (isAuthenticated()) {
      navigate("/dashboard");
    }
  }, []);

  const handleLogin = () => {
    const success = login(form.username, form.password);

    if (success) {
      navigate("/dashboard");
    } else {
      alert("Invalid username or password");
    }
  };

  return (
    <BasicLayout image={bgImage}>
      <Card>
        <MDBox
          variant="gradient"
          bgColor="info"
          borderRadius="lg"
          coloredShadow="info"
          mx={2}
          mt={-3}
          p={2}
          mb={1}
          textAlign="center"
        >
          <MDTypography variant="h4" fontWeight="medium" color="white">
            Sign in
          </MDTypography>
        </MDBox>

        <MDBox pt={4} pb={3} px={3}>
          <MDBox component="form" role="form">
            {/* USERNAME */}
            <MDBox mb={2}>
              <MDInput
                type="text"
                label="Username"
                fullWidth
                onChange={(e) => setForm({ ...form, username: e.target.value })}
              />
            </MDBox>

            {/* PASSWORD */}
            <MDBox mb={2}>
              <MDInput
                type="password"
                label="Password"
                fullWidth
                onChange={(e) => setForm({ ...form, password: e.target.value })}
              />
            </MDBox>

            {/* REMEMBER ME */}
            <MDBox display="flex" alignItems="center" ml={-1}>
              <Switch checked={rememberMe} onChange={handleSetRememberMe} />
              <MDTypography
                variant="button"
                onClick={handleSetRememberMe}
                sx={{ cursor: "pointer" }}
              >
                Remember me
              </MDTypography>
            </MDBox>

            {/* LOGIN BUTTON */}
            <MDBox mt={4} mb={1}>
              <MDButton variant="gradient" color="info" fullWidth onClick={handleLogin}>
                Sign In
              </MDButton>
            </MDBox>
          </MDBox>
        </MDBox>
      </Card>
    </BasicLayout>
  );
}

export default Basic;
