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
import { UserService } from "@/services/UserService";
import UserDialog from "@/components/UserDialog";

const service = new UserService();

export default function UserPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [keyword, setKeyword] = useState("");
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any>(null);

  const loadData = async () => {
    try {
      const res = await service.search({ keyword }, 0, 10);
      setUsers(res?.body?.content || []);
    } catch (error) {
      console.error("Load user error:", error);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleAdd = () => {
    setSelectedUser(null);
    setOpenDialog(true);
  };

  const handleEdit = (row: any) => {
    setSelectedUser(row);
    setOpenDialog(true);
  };

  const handleDelete = async (row: any) => {
    if (!confirm("Are you sure to delete this user?")) return;

    await service.delete(row.userId);
    loadData();
  };

  return (
    <Box sx={{ p: 3, mt: 2 }}>
      <Typography variant="h5" mb={2} mt={4}>
        User Management
      </Typography>

      <Stack direction="row" spacing={2} mb={3}>
        <TextField
          label="Search"
          value={keyword}
          size="small"
          onChange={(e) => setKeyword(e.target.value)}
        />

        <Button variant="contained" onClick={loadData}>
          Search
        </Button>

        <Button variant="outlined" onClick={handleAdd}>
          Add User
        </Button>
      </Stack>

      <Paper
        elevation={3}
        sx={{
          borderRadius: 3,
          overflow: "hidden",
          mt: 2,
        }}
      >
        <Box
          sx={{
            p: 2,
            backgroundColor: "#1976d2",
            color: "white",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Typography variant="h5" mb={3}>
            User Management
          </Typography>
        </Box>

        {/* TABLE */}
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: "#f5f5f5" }}>
              <TableCell>
                <b>Username *</b>
              </TableCell>
              <TableCell>
                <b>Full Name *</b>
              </TableCell>
              <TableCell>
                <b>Email *</b>
              </TableCell>
              <TableCell>Phone</TableCell>
              <TableCell>Website</TableCell>
              <TableCell width={150}>
                <b>Action</b>
              </TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {users.map((row) => (
              <TableRow key={row.userId} hover>
                <TableCell
                  sx={{
                    color: row.userName ? "inherit" : "red",
                    fontWeight: row.userName ? "normal" : "bold",
                  }}
                >
                  {row.userName || "Required"}
                </TableCell>

                <TableCell
                  sx={{
                    color: row.userFullName ? "inherit" : "red",
                    fontWeight: row.userFullName ? "normal" : "bold",
                  }}
                >
                  {row.userFullName || "Required"}
                </TableCell>

                <TableCell
                  sx={{
                    color: row.email ? "inherit" : "red",
                    fontWeight: row.email ? "normal" : "bold",
                  }}
                >
                  {row.email || "Required"}
                </TableCell>

                <TableCell>{row.phone}</TableCell>
                <TableCell>{row.website}</TableCell>

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

            {users.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} align="center" sx={{ py: 4 }}>
                  <Typography color="text.secondary">No data found</Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Paper>

      <UserDialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        onSuccess={loadData}
        data={selectedUser}
      />
    </Box>
  );
}
