"use client";

import { useEffect, useState } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Stack,
  Paper,
} from "@mui/material";
import { CustomerService } from "@/services/CustomerService";
import CustomerDialog from "@/components/CustomerDialog";

const service = new CustomerService();

export default function CustomerPage() {
  const [data, setData] = useState<any[]>([]);
  const [keyword, setKeyword] = useState("");
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<any>(null);

  const loadData = async () => {
    try {
      const res = await service.search({ keyword }, 0, 10);
      setData(res?.body?.content || []);
    } catch (error) {
      console.error("Load customer error:", error);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleAdd = () => {
    setSelected(null);
    setOpen(true);
  };

  const handleEdit = (row: any) => {
    setSelected(row);
    setOpen(true);
  };

  const handleDelete = async (row: any) => {
    const confirmDelete = confirm(
      `Delete customer: ${row.customerName}?`
    );

    if (!confirmDelete) return;

    try {
      await service.delete({ customerId: row.customerId });
      loadData();
    } catch (error) {
      console.error("Delete error:", error);
    }
  };

  return (
    <Box>
      <Typography variant="h5" mb={2}>
        Customer Management
      </Typography>

      <Stack direction="row" spacing={2} mb={2}>
        <TextField
          label="Search"
          size="small"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
        />

        <Button variant="contained" onClick={loadData}>
          Search
        </Button>

        <Button variant="outlined" onClick={handleAdd}>
          Add Customer
        </Button>
      </Stack>


      <Paper>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Customer Code</TableCell>
              <TableCell>Customer Name</TableCell>
              <TableCell>Tel</TableCell>
              <TableCell width={150}>Action</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {data.map((row) => (
              <TableRow key={row.customerId}>
                <TableCell>{row.customerCode}</TableCell>
                <TableCell>{row.customerName}</TableCell>
                <TableCell>{row.telNo}</TableCell>

                <TableCell>
                  <Button size="small" onClick={() => handleEdit(row)}>
                    Edit
                  </Button>

                  <Button
                    size="small"
                    color="error"
                    onClick={() => handleDelete(row)}
                  >
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}

            {data.length === 0 && (
              <TableRow>
                <TableCell colSpan={4} align="center">
                  No data found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Paper>

      {/* Dialog */}
      <CustomerDialog
        open={open}
        onClose={() => setOpen(false)}
        onSuccess={loadData}
        data={selected}
      />
    </Box>
  );
}