"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  CircularProgress,
} from "@mui/material";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

import { UserService } from "@/services/UserService";
import { CustomerService } from "@/services/CustomerService";

const userService = new UserService();
const customerService = new CustomerService();

const COLORS = ["#1976d2", "#2e7d32"];

export default function Home() {
  const [loading, setLoading] = useState(true);
  const [summary, setSummary] = useState({
    user: 0,
    customer: 0,
  });

  const loadSummary = async () => {
    try {
      setLoading(true);

      const [userRes, customerRes] = await Promise.all([
        userService.search({}, 0, 1),
        customerService.search({}, 0, 1),
      ]);

      setSummary({
        user: userRes?.body?.totalElements ?? 0,
        customer: customerRes?.body?.totalElements ?? 0,
      });
    } catch (error) {
      console.error("Summary load error:", error);

      setSummary({
        user: 0,
        customer: 0,
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSummary();
  }, []);

  const chartData = useMemo(() => {
    return [
      {
        name: "System Summary",
        Users: summary.user,
        Customers: summary.customer,
      },
    ];
  }, [summary]);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" mt={10}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h4" fontWeight="bold" mb={8}>
        Dashboard Summary
      </Typography>

      {/* Cards */}
      <Grid container spacing={8}>
        <Grid item xs={12} md={6}>
          <Card sx={{ borderRadius: 3, boxShadow: 3 }}>
            <CardContent>
              <Typography variant="h6">Users</Typography>
              <Typography variant="h3">{summary.user}</Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card sx={{ borderRadius: 3, boxShadow: 3 }}>
            <CardContent>
              <Typography variant="h6">Customers</Typography>
              <Typography variant="h3">{summary.customer}</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* <Box mt={5}>
        <Typography variant="h6" mb={2}>
          System Overview
        </Typography>

        <Card sx={{ p: 2, borderRadius: 3 }}>
          <Box height={300}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />

                <Bar dataKey="Users" fill="#1976d2" />
                <Bar dataKey="Customers" fill="#2e7d32" />
              </BarChart>
            </ResponsiveContainer>
          </Box>
        </Card>
      </Box> */}
    </Box>
  );
}
