import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Box,
  Paper,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  IconButton,
  TextField,
  InputAdornment
} from '@mui/material';
import {
  Search as SearchIcon,
  Add as AddIcon,
  Delete as DeleteIcon,
  Visibility as VisibilityIcon
} from '@mui/icons-material';
import Layout from '../components/Layout';
import { DeleteConfirmDialog, ActionSuccessDialog } from '../components/ConfirmationDialog';
import PurchaseOrderDetail from '../components/PurchaseOrderDetail';

function PurchaseOrders() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Dialog states
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [successDialogOpen, setSuccessDialogOpen] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const [actionType, setActionType] = useState('');
  
  // Order detail dialog
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    // Try to get saved orders from localStorage
    const savedOrders = localStorage.getItem('purchaseOrders');
    
    if (savedOrders) {
      setOrders(JSON.parse(savedOrders));
    } else {
      // Use mock data as fallback
      const mockOrders = [
        { 
          id: 1, 
          orderDate: '22/2/2025', 
          supplier: 'ບໍລິສັດ Gee', 
          employee: 'ເປັນຕຸ້ຍ (ພະນັກງານ)', 
          items: [
            { name: 'ຕູ້ເຢັນ', quantity: 2 },
            { name: 'ແອຄອນດິຊັນ', quantity: 1 }
          ]
        },
        { 
          id: 2, 
          orderDate: '23/2/2025', 
          supplier: 'ບໍລິສັດ Gee', 
          employee: 'ເປັນຕຸ້ຍ (ພະນັກງານ)', 
          items: [
            { name: 'ໂທລະທັດ', quantity: 1 },
            { name: 'ຈັກຊັກຜ້າ', quantity: 2 }
          ]
        }
      ];
      
      setOrders(mockOrders);
      // Save mock data to localStorage
      localStorage.setItem('purchaseOrders', JSON.stringify(mockOrders));
    }
  }, []);

  // Function to filter orders based on search term
  const filteredOrders = orders.filter(order => 
    order.supplier.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.orderDate.includes(searchTerm)
  );

  // Function to handle delete order
  const handleDeleteOrder = (id) => {
    setSelectedOrderId(id);
    setDeleteDialogOpen(true);
  };
  
  // Function to open order details
  const handleViewOrder = (order) => {
    setSelectedOrder(order);
    setDetailDialogOpen(true);
  };
  
  // Confirm delete action
  const confirmDelete = (id) => {
    const updatedOrders = orders.filter(order => order.id !== id);
    setOrders(updatedOrders);
    // Update localStorage
    localStorage.setItem('purchaseOrders', JSON.stringify(updatedOrders));
    
    // Close delete dialog and show success dialog
    setDeleteDialogOpen(false);
    setActionType('delete');
    setSuccessDialogOpen(true);
  };
  
  // Close dialogs
  const handleCloseDeleteDialog = () => {
    setDeleteDialogOpen(false);
  };
  
  const handleCloseSuccessDialog = () => {
    setSuccessDialogOpen(false);
  };
  
  const handleCloseDetailDialog = () => {
    setDetailDialogOpen(false);
  };

  return (
    <Layout title="ລາຍການສັ່ງຊື້">
      {/* Delete Confirmation Dialog */}
      <DeleteConfirmDialog 
        open={deleteDialogOpen}
        onClose={handleCloseDeleteDialog}
        onConfirm={confirmDelete}
        itemId={selectedOrderId}
      />
      
      {/* Success Dialog */}
      <ActionSuccessDialog 
        open={successDialogOpen}
        onClose={handleCloseSuccessDialog}
        actionType={actionType}
      />
      
      {/* Order Detail Dialog */}
      <PurchaseOrderDetail
        open={detailDialogOpen}
        onClose={handleCloseDetailDialog}
        order={selectedOrder}
      />
      
      <Box sx={{ bgcolor: 'background.paper', p: 2, borderRadius: 1, mb: 2 }}>
        <Typography variant="subtitle1" fontWeight="bold" color="primary">
          ລາຍລະອຽດການສັ່ງຊື້
        </Typography>
      </Box>

      <Paper sx={{ p: 2 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <TextField
            placeholder="ຄົ້ນຫາ..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            size="small"
            sx={{ width: 300 }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          />
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={() => navigate('/buy')}
          >
            ສ້າງການສັ່ງຊື້ໃໝ່
          </Button>
        </Box>

        <TableContainer>
          <Table sx={{ minWidth: 650 }}>
                          <TableHead>
              <TableRow sx={{ bgcolor: 'background.default' }}>
                <TableCell align="center">#</TableCell>
                <TableCell align="center">ເລກທີໃບສັ່ງຊື້</TableCell>
                <TableCell align="center">ວັນທີ ຊື້ສິນຄ້າ</TableCell>
                <TableCell align="center">ຜູ້ສະໜອງ</TableCell>
                <TableCell align="center">ພະນັກງານ</TableCell>
                <TableCell align="center">ຄຳສັ່ງ</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredOrders.map((order, index) => (
                <TableRow
                  key={order.id}
                  sx={{ "&:nth-of-type(odd)": { bgcolor: 'action.hover' } }}
                >
                  <TableCell align="center">{index + 1}</TableCell>
                  <TableCell align="center">{order.id}</TableCell>
                  <TableCell align="center">{order.orderDate}</TableCell>
                  <TableCell align="center">{order.supplier}</TableCell>
                  <TableCell align="center">{order.employee}</TableCell>
                  <TableCell align="center">
                    <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1 }}>
                      <Button
                        variant="contained"
                        color="info"
                        size="small"
                        sx={{ borderRadius: 4 }}
                        onClick={() => handleViewOrder(order)}
                        startIcon={<VisibilityIcon />}
                      >
                        ລາຍລະອຽດ
                      </Button>
                      
                      <Button
                        variant="contained"
                        color="error"
                        size="small"
                        sx={{ borderRadius: 4 }}
                        onClick={() => handleDeleteOrder(order.id)}
                      >
                        ລຶບ
                      </Button>
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Layout>
  );
}

export default PurchaseOrders;