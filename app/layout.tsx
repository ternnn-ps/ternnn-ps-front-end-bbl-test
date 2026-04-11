import Sidebar from "@/components/Sidebar";
import { Box } from "@mui/material";

const drawerWidth = 240;

export default function RootLayout({ children }: any) {
  return (
    <html>
      <body>
        <Box sx={{ display: "flex" }}>
          
          <Sidebar />

          <Box
            component="main"
            sx={{
              flexGrow: 1,
              p: 3,
              marginLeft: `${drawerWidth}px`, 
            }}
          >
            {children}
          </Box>

        </Box>
      </body>
    </html>
  );
}