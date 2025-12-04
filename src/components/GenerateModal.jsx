import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  IconButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

export default function GenerateModal({
  open,
  onClose,
  generateSealingStatement,
  generateOfferLetter,
}) {
  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      {/* Header */}
      <DialogTitle
        sx={{ backgroundColor: "primary.main", color: "white", display: "flex", justifyContent: "space-between", alignItems: "center" }}
      >
        Generate Documents
        <IconButton onClick={onClose} sx={{ color: "white" }}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      {/* Body */}
      <DialogContent dividers className="text-center">
        <Typography variant="body1" sx={{ mb: 3, textAlign: "center" }}>
          Choose which document you want to generate:
        </Typography>

        <div style={{ display: "flex", justifyContent: "center", gap: "1rem", flexWrap: "wrap" }}>
          <Button
            variant="contained"
            color="success"
            onClick={() => {
              generateSealingStatement();
              onClose();
            }}
          >
            📊 Generate Sealing Statement
          </Button>

          <Button
            variant="contained"
            color="info"
            onClick={() => {
              generateOfferLetter();
              onClose();
            }}
          >
            📑 Generate Offer Letter
          </Button>
        </div>
      </DialogContent>

      {/* Footer (optional, we already have buttons above so you can remove this) */}
      <DialogActions></DialogActions>
    </Dialog>
  );
}