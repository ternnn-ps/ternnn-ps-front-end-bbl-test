"use client";

import { Dialog, TextField, Button } from "@mui/material";
import { useEffect, useState } from "react";
import { UserService } from "@/services/UserService";
import { Snackbar, Alert } from "@mui/material";

const service = new UserService();

export default function UserDialog({ open, onClose, onSuccess, data }: any) {
  const [form, setForm] = useState<any>({
    userId: null,
    userName: "",
    userFullName: "",
    email: "",
    phone: "",
    website: "",
  });

  const [errors, setErrors] = useState<any>({});

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success" as "success" | "error",
  });

  const showMessage = (msg: string, type: "success" | "error") => {
    setSnackbar({
      open: true,
      message: msg,
      severity: type,
    });
  };

  const validate = () => {
    const newErrors: any = {};

    if (!form.userName?.trim()) {
      newErrors.userName = "Username is required";
    }

    if (!form.userFullName?.trim()) {
      newErrors.userFullName = "Full Name is required";
    }

    if (!form.email?.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(form.email)) {
      newErrors.email = "Invalid email format";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  useEffect(() => {
    if (data) setForm(data);
  }, [data]);

  const handleSubmit = async () => {
  try {
    let res;

    if (form.userId) {
      res = await service.update(form);
    } else {
      res = await service.create(form);
    }

    console.log("API Response:", res);

    if (res?.result) {
      onSuccess();
      onClose();
    } else {
      console.warn("Business error:", res?.msgDetail);
    }

  } catch (error) {
    console.error("Server error:", error);
  }
};

  return (
    <Dialog open={open} onClose={onClose}>
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert
          severity={snackbar.severity}
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>

      <div
        style={{
          padding: 20,
          display: "flex",
          flexDirection: "column",
          gap: 12,
          width: 350,
        }}
      >
        <TextField
          label="Username *"
          value={form.userName}
          error={!!errors.userName}
          helperText={errors.userName}
          onChange={(e) => setForm({ ...form, userName: e.target.value })}
        />

        <TextField
          label="Full Name *"
          value={form.userFullName}
          error={!!errors.userFullName}
          helperText={errors.userFullName}
          onChange={(e) => setForm({ ...form, userFullName: e.target.value })}
        />

        <TextField
          label="Email *"
          value={form.email}
          error={!!errors.email}
          helperText={errors.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />

        <TextField
          label="Phone"
          value={form.phone}
          onChange={(e) => setForm({ ...form, phone: e.target.value })}
        />

        <TextField
          label="Website"
          value={form.website}
          onChange={(e) => setForm({ ...form, website: e.target.value })}
        />

        <Button
          variant="contained"
          onClick={handleSubmit}
          disabled={!form.userName || !form.userFullName || !form.email}
        >
          Save
        </Button>
      </div>
    </Dialog>
  );
}
