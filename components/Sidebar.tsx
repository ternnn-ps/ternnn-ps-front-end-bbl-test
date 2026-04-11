"use client";

import { Drawer, List, ListItemButton, ListItemText } from "@mui/material";
import { useRouter } from "next/navigation";

export default function Sidebar() {
  const router = useRouter();

  return (
    <Drawer variant="permanent">
      <List>
        {/* ✅ Summary first */}
        <ListItemButton onClick={() => router.push("/")}>
          <ListItemText primary="Summary" />
        </ListItemButton>

        <ListItemButton onClick={() => router.push("/user")}>
          <ListItemText primary="User Management" />
        </ListItemButton>

        <ListItemButton onClick={() => router.push("/customer")}>
          <ListItemText primary="Customer" />
        </ListItemButton>

      </List>
    </Drawer>
  );
}