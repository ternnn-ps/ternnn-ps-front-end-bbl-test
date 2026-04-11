"use client";

import { CustomerService } from "@/services/CustomerService";
import { Dialog, TextField, Button, Stack, Typography } from "@mui/material";
import { useEffect, useState } from "react";

const service = new CustomerService();

export default function CustomerDialog({
  open,
  onClose,
  onSuccess,
  data,
}: any) {
  const [form, setForm] = useState({
    customerId: null,
    customerCode: "",
    customerName: "",
    address: "",
    telNo: "",
  });

  useEffect(() => {
    if (data) {
      setForm(data);
    } else {
      // reset for ADD mode
      setForm({
        customerId: null,
        customerCode: "",
        customerName: "",
        address: "",
        telNo: "",
      });
    }
  }, [data, open]);

  // =========================
  // Submit
  // =========================
  const handleSubmit = async () => {
    try {
      if (form.customerId) {
        await service.update(form);
      } else {
        await service.create(form);
      }

      onSuccess();
      onClose();
    } catch (error) {
      console.error("Save error:", error);
    }
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <Stack spacing={2} sx={{ p: 3, width: 350 }}>
        <Typography variant="h6">
          {form.customerId ? "Edit Customer" : "Add Customer"}
        </Typography>

        <TextField
          label="Customer Code"
          value={form.customerCode}
          onChange={(e) =>
            setForm({ ...form, customerCode: e.target.value })
          }
        />

        <TextField
          label="Customer Name"
          value={form.customerName}
          onChange={(e) =>
            setForm({ ...form, customerName: e.target.value })
          }
        />

        <TextField
          label="Address"
          value={form.address}
          onChange={(e) =>
            setForm({ ...form, address: e.target.value })
          }
        />

        <TextField
          label="Telephone"
          value={form.telNo}
          onChange={(e) =>
            setForm({ ...form, telNo: e.target.value })
          }
        />

        <Button variant="contained" onClick={handleSubmit}>
          Save
        </Button>
      </Stack>
    </Dialog>
  );
}