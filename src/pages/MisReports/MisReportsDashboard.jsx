import React, { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
} from "@mui/material";
import AssessmentIcon from "@mui/icons-material/Assessment";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import PlaylistAddCheckIcon from "@mui/icons-material/PlaylistAddCheck";
import PendingActionsIcon from "@mui/icons-material/PendingActions";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import FeedbackIcon from '@mui/icons-material/Feedback';
import { MyContext } from "../../App";
import { Inventory } from "@mui/icons-material";

const MisReportsDashboard = () => {
  const { setIsHideSidebarAndHeader } = useContext(MyContext);

  useEffect(() => {
    setIsHideSidebarAndHeader(true);
    window.scrollTo(0, 0);
  }, [setIsHideSidebarAndHeader]);

  const navigate = useNavigate();

  const pages = [
    {
      title: "Offer Details",
      icon: <AssessmentIcon sx={{ fontSize: 40, color: "#1976d2" }} />,
      route: "/materialOfferedButNominationPending-list",
      color: "#E3F2FD",
    },
    {
      title: "Nomination Details",
      icon: <PlaylistAddCheckIcon sx={{ fontSize: 40, color: "#388e3c" }} />,
      route: "/nomination-done",
      color: "#E8F5E9",
    },
    {
      title: "Inspection Details",
      icon: <PendingActionsIcon sx={{ fontSize: 40, color: "#f57c00" }} />,
      route: "/inspection-done",
      color: "#FFF3E0",
    },
    {
      title: "D.I. Received Details",
      icon: <LocalShippingIcon sx={{ fontSize: 40, color: "#d32f2f" }} />,
      route: "/di-received",
      color: "#FFEBEE",
    },
    {
      title: "Production Planning Details",
      icon: <Inventory sx={{ fontSize: 40, color: "#d3c52fff" }} />,
      route: "/production-planning",
      color: "#fffcebff",
    },
    {
      title: "MIS Of New G.P. Transformers",
      icon: <FeedbackIcon sx={{ fontSize: 40, color: "#cd2fd3ff" }} />,
      route: "/new-gp-transformers",
      color: "#ffebfdff",
    },
  ];

  return (
    <Box sx={{ p: 4 }}>
      {/* 🔙 Back Button */}
      <Button
        variant="outlined"
        startIcon={<ArrowBackIcon />}
        onClick={() => navigate("/")}
        sx={{
          mb: 3,
          borderRadius: "25px",
          textTransform: "none",
          fontWeight: "bold",
          px: 3,
          "&:hover": {
            backgroundColor: "#f5f5f5",
          },
        }}
      >
        Back to Home
      </Button>

      <Typography
        variant="h4"
        align="center"
        gutterBottom
        sx={{ fontWeight: "bold", mb: 4 }}
      >
        MIS Reports Dashboard
      </Typography>

      <Grid container spacing={3} justifyContent="center">
        {pages.map((page, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Card
              sx={{
                backgroundColor: page.color,
                borderRadius: "20px",
                textAlign: "center",
                boxShadow: 3,
                cursor: "pointer",
                transition: "all 0.3s ease",
                "&:hover": {
                  transform: "translateY(-8px)",
                  boxShadow: 6,
                },
              }}
              onClick={() => navigate(page.route)}
            >
              <CardContent>
                {page.icon}
                <Typography
                  variant="h6"
                  sx={{ fontWeight: "bold", mt: 1, color: "#333" }}
                >
                  {page.title}
                </Typography>
                <Button
                  variant="contained"
                  size="small"
                  sx={{ mt: 2, borderRadius: "20px" }}
                >
                  View
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default MisReportsDashboard;
