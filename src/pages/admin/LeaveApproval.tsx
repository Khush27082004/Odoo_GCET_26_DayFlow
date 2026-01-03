import React, { useState, useEffect } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import PageHeader from '@/components/ui/page-header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { CheckCircle2, XCircle, MessageSquare, Eye } from 'lucide-react';
import { getLeaveRequests, updateLeaveRequest } from '@/services/storage';
import { LeaveRequest } from '@/services/types';
import { useToast } from '@/hooks/use-toast';

const LeaveApproval: React.FC = () => {
  const { toast } = useToast();
  const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>([]);
  const [selectedRequest, setSelectedRequest] = useState<LeaveRequest | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [adminComment, setAdminComment] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    const requests = getLeaveRequests();
    setLeaveRequests(requests.sort((a, b) => b.createdAt.localeCompare(a.createdAt)));
  };

  const handleViewRequest = (request: LeaveRequest) => {
    setSelectedRequest(request);
    setAdminComment(request.adminComment || '');
    setIsDialogOpen(true);
  };

  const handleApprove = (request: LeaveRequest) => {
    const updatedRequest = {
      ...request,
      status: 'approved' as const,
      adminComment: adminComment || 'Leave request approved.',
    };

    updateLeaveRequest(updatedRequest);
    loadData();
    setIsDialogOpen(false);
    toast({
      title: 'Leave Approved',
      description: `Leave request for ${request.employeeName} has been approved.`,
    });
  };

  const handleReject = (request: LeaveRequest) => {
    if (!adminComment) {
      toast({
        title: 'Comment Required',
        description: 'Please provide a reason for rejection.',
        variant: 'destructive',
      });
      return;
    }

    const updatedRequest = {
      ...request,
      status: 'rejected' as const,
      adminComment,
    };

    updateLeaveRequest(updatedRequest);
    loadData();
    setIsDialogOpen(false);
    toast({
      title: 'Leave Rejected',
      description: `Leave request for ${request.employeeName} has been rejected.`,
    });
  };

  const getStatusBadge = (status: LeaveRequest['status']) => {
    switch (status) {
      case 'approved':
        return <Badge className="bg-success/10 text-success border-success/20">Approved</Badge>;
      case 'rejected':
        return <Badge className="bg-destructive/10 text-destructive border-destructive/20">Rejected</Badge>;
      default:
        return <Badge className="bg-warning/10 text-warning border-warning/20">Pending</Badge>;
    }
  };

  const getLeaveTypeBadge = (type: LeaveRequest['leaveType']) => {
    switch (type) {
      case 'paid':
        return <Badge variant="secondary">Paid Leave</Badge>;
      case 'sick':
        return <Badge variant="secondary">Sick Leave</Badge>;
      case 'unpaid':
        return <Badge variant="outline">Unpaid Leave</Badge>;
    }
  };

  const pendingRequests = leaveRequests.filter((r) => r.status === 'pending');
  const processedRequests = leaveRequests.filter((r) => r.status !== 'pending');

  const RequestsTable = ({ requests }: { requests: LeaveRequest[] }) => (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Employee</TableHead>
          <TableHead>Leave Type</TableHead>
          <TableHead>Duration</TableHead>
          <TableHead>Remarks</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {requests.length === 0 ? (
          <TableRow>
            <TableCell colSpan={6} className="h-24 text-center">
              No leave requests found.
            </TableCell>
          </TableRow>
        ) : (
          requests.map((request) => (
            <TableRow key={request.id}>
              <TableCell>
                <div>
                  <p className="font-medium">{request.employeeName}</p>
                  <p className="text-sm text-muted-foreground">
                    Applied: {request.createdAt}
                  </p>
                </div>
              </TableCell>
              <TableCell>{getLeaveTypeBadge(request.leaveType)}</TableCell>
              <TableCell>
                <div className="text-sm">
                  <p className="font-medium">{request.startDate}</p>
                  <p className="text-muted-foreground">to {request.endDate}</p>
                </div>
              </TableCell>
              <TableCell className="max-w-[200px] truncate">
                {request.remarks || '-'}
              </TableCell>
              <TableCell>{getStatusBadge(request.status)}</TableCell>
              <TableCell className="text-right">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleViewRequest(request)}
                >
                  <Eye className="mr-2 h-4 w-4" />
                  View
                </Button>
              </TableCell>
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  );

  return (
    <DashboardLayout>
      <PageHeader
        title="Leave Approval"
        description="Review and manage employee leave requests"
      />

      {/* Stats */}
      <div className="mb-6 grid gap-4 sm:grid-cols-3">
        <Card className="shadow-card">
          <CardContent className="p-4">
            <p className="text-2xl font-bold text-warning">{pendingRequests.length}</p>
            <p className="text-sm text-muted-foreground">Pending Requests</p>
          </CardContent>
        </Card>
        <Card className="shadow-card">
          <CardContent className="p-4">
            <p className="text-2xl font-bold text-success">
              {leaveRequests.filter((r) => r.status === 'approved').length}
            </p>
            <p className="text-sm text-muted-foreground">Approved</p>
          </CardContent>
        </Card>
        <Card className="shadow-card">
          <CardContent className="p-4">
            <p className="text-2xl font-bold text-destructive">
              {leaveRequests.filter((r) => r.status === 'rejected').length}
            </p>
            <p className="text-sm text-muted-foreground">Rejected</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="pending" className="w-full">
        <TabsList>
          <TabsTrigger value="pending">
            Pending ({pendingRequests.length})
          </TabsTrigger>
          <TabsTrigger value="processed">
            Processed ({processedRequests.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="pending" className="mt-4">
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="text-lg">Pending Leave Requests</CardTitle>
            </CardHeader>
            <CardContent>
              <RequestsTable requests={pendingRequests} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="processed" className="mt-4">
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="text-lg">Processed Leave Requests</CardTitle>
            </CardHeader>
            <CardContent>
              <RequestsTable requests={processedRequests} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* View/Action Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Leave Request Details</DialogTitle>
            <DialogDescription>
              Review and take action on this leave request
            </DialogDescription>
          </DialogHeader>
          {selectedRequest && (
            <div className="space-y-4">
              <div className="rounded-lg bg-muted/50 p-4">
                <h4 className="font-semibold">{selectedRequest.employeeName}</h4>
                <p className="text-sm text-muted-foreground">
                  Applied on {selectedRequest.createdAt}
                </p>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <Label className="text-muted-foreground">Leave Type</Label>
                  <p className="font-medium capitalize">{selectedRequest.leaveType} Leave</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Current Status</Label>
                  <div className="mt-1">{getStatusBadge(selectedRequest.status)}</div>
                </div>
                <div>
                  <Label className="text-muted-foreground">Start Date</Label>
                  <p className="font-medium">{selectedRequest.startDate}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">End Date</Label>
                  <p className="font-medium">{selectedRequest.endDate}</p>
                </div>
              </div>

              <div>
                <Label className="text-muted-foreground">Employee Remarks</Label>
                <p className="font-medium">{selectedRequest.remarks || 'No remarks provided'}</p>
              </div>

              {selectedRequest.status === 'pending' ? (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="adminComment">
                      <MessageSquare className="mr-1 inline h-4 w-4" />
                      Admin Comment
                    </Label>
                    <Textarea
                      id="adminComment"
                      placeholder="Add a comment (required for rejection)"
                      value={adminComment}
                      onChange={(e) => setAdminComment(e.target.value)}
                      rows={3}
                    />
                  </div>

                  <div className="flex justify-end gap-3">
                    <Button
                      variant="outline"
                      className="text-destructive hover:bg-destructive hover:text-destructive-foreground"
                      onClick={() => handleReject(selectedRequest)}
                    >
                      <XCircle className="mr-2 h-4 w-4" />
                      Reject
                    </Button>
                    <Button onClick={() => handleApprove(selectedRequest)}>
                      <CheckCircle2 className="mr-2 h-4 w-4" />
                      Approve
                    </Button>
                  </div>
                </>
              ) : (
                <div className="rounded-lg bg-muted/50 p-4">
                  <Label className="text-muted-foreground">Admin Comment</Label>
                  <p className="font-medium">
                    {selectedRequest.adminComment || 'No comment provided'}
                  </p>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
};

export default LeaveApproval;
