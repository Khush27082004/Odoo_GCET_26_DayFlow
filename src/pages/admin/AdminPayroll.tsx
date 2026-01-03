import React, { useState, useEffect } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import PageHeader from '@/components/ui/page-header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Search, Edit2, DollarSign, Save, X } from 'lucide-react';
import { getUsers, updateUser } from '@/services/storage';
import { User } from '@/services/types';
import { useToast } from '@/hooks/use-toast';

const AdminPayroll: React.FC = () => {
  const { toast } = useToast();
  const [employees, setEmployees] = useState<User[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedEmployee, setSelectedEmployee] = useState<User | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [salaryForm, setSalaryForm] = useState({
    basic: 0,
    hra: 0,
    allowances: 0,
    deductions: 0,
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    const users = getUsers();
    setEmployees(users);
  };

  const filteredEmployees = employees.filter(
    (emp) =>
      emp.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      emp.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      emp.employeeId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      emp.department.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleEditSalary = (employee: User) => {
    setSelectedEmployee(employee);
    setSalaryForm({
      basic: employee.salary.basic,
      hra: employee.salary.hra,
      allowances: employee.salary.allowances,
      deductions: employee.salary.deductions,
    });
    setIsEditDialogOpen(true);
  };

  const handleSaveSalary = () => {
    if (!selectedEmployee) return;

    const updatedEmployee = {
      ...selectedEmployee,
      salary: salaryForm,
    };

    updateUser(updatedEmployee);
    loadData();
    setIsEditDialogOpen(false);
    toast({
      title: 'Salary Updated',
      description: `Salary structure for ${selectedEmployee.firstName} ${selectedEmployee.lastName} has been updated.`,
    });
  };

  const totalPayroll = employees.reduce((sum, emp) => {
    const net =
      emp.salary.basic + emp.salary.hra + emp.salary.allowances - emp.salary.deductions;
    return sum + net;
  }, 0);

  return (
    <DashboardLayout>
      <PageHeader
        title="Payroll Management"
        description="View and manage employee salaries"
      />

      {/* Stats */}
      <div className="mb-6 grid gap-4 sm:grid-cols-3">
        <Card className="shadow-card">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-primary/10 p-2">
                <DollarSign className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">₹{totalPayroll.toLocaleString()}</p>
                <p className="text-sm text-muted-foreground">Total Annual Payroll</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-card">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-success/10 p-2">
                <DollarSign className="h-5 w-5 text-success" />
              </div>
              <div>
                <p className="text-2xl font-bold">
                  ₹{Math.round(totalPayroll / 12).toLocaleString()}
                </p>
                <p className="text-sm text-muted-foreground">Monthly Payroll</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-card">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-info/10 p-2">
                <DollarSign className="h-5 w-5 text-info" />
              </div>
              <div>
                <p className="text-2xl font-bold">
                  ₹{employees.length > 0 ? Math.round(totalPayroll / employees.length).toLocaleString() : 0}
                </p>
                <p className="text-sm text-muted-foreground">Avg. Salary</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="shadow-card">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-lg">Employee Payroll</CardTitle>
          <div className="relative w-64">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search employees..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Employee</TableHead>
                <TableHead>Department</TableHead>
                <TableHead className="text-right">Basic</TableHead>
                <TableHead className="text-right">HRA</TableHead>
                <TableHead className="text-right">Allowances</TableHead>
                <TableHead className="text-right">Deductions</TableHead>
                <TableHead className="text-right">Net Salary</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredEmployees.map((emp) => {
                const netSalary =
                  emp.salary.basic +
                  emp.salary.hra +
                  emp.salary.allowances -
                  emp.salary.deductions;

                return (
                  <TableRow key={emp.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
                          {emp.firstName[0]}
                          {emp.lastName[0]}
                        </div>
                        <div>
                          <p className="font-medium">
                            {emp.firstName} {emp.lastName}
                          </p>
                          <p className="text-sm text-muted-foreground">{emp.employeeId}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary">{emp.department}</Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      ₹{emp.salary.basic.toLocaleString()}
                    </TableCell>
                    <TableCell className="text-right">
                      ₹{emp.salary.hra.toLocaleString()}
                    </TableCell>
                    <TableCell className="text-right text-success">
                      +₹{emp.salary.allowances.toLocaleString()}
                    </TableCell>
                    <TableCell className="text-right text-destructive">
                      -₹{emp.salary.deductions.toLocaleString()}
                    </TableCell>
                    <TableCell className="text-right font-bold">
                      ₹{netSalary.toLocaleString()}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEditSalary(emp)}
                      >
                        <Edit2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Edit Salary Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Salary Structure</DialogTitle>
            <DialogDescription>
              Update salary details for {selectedEmployee?.firstName}{' '}
              {selectedEmployee?.lastName}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="basic">Basic Salary (Annual)</Label>
              <Input
                id="basic"
                type="number"
                value={salaryForm.basic}
                onChange={(e) =>
                  setSalaryForm({ ...salaryForm, basic: Number(e.target.value) })
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="hra">House Rent Allowance (Annual)</Label>
              <Input
                id="hra"
                type="number"
                value={salaryForm.hra}
                onChange={(e) =>
                  setSalaryForm({ ...salaryForm, hra: Number(e.target.value) })
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="allowances">Other Allowances (Annual)</Label>
              <Input
                id="allowances"
                type="number"
                value={salaryForm.allowances}
                onChange={(e) =>
                  setSalaryForm({ ...salaryForm, allowances: Number(e.target.value) })
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="deductions">Deductions (Annual)</Label>
              <Input
                id="deductions"
                type="number"
                value={salaryForm.deductions}
                onChange={(e) =>
                  setSalaryForm({ ...salaryForm, deductions: Number(e.target.value) })
                }
              />
            </div>

            <div className="rounded-lg bg-muted/50 p-4">
              <div className="flex justify-between">
                <span className="font-medium">Net Salary (Annual)</span>
                <span className="font-bold text-primary">
                  ₹
                  {(
                    salaryForm.basic +
                    salaryForm.hra +
                    salaryForm.allowances -
                    salaryForm.deductions
                  ).toLocaleString()}
                </span>
              </div>
            </div>

            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                <X className="mr-2 h-4 w-4" />
                Cancel
              </Button>
              <Button onClick={handleSaveSalary}>
                <Save className="mr-2 h-4 w-4" />
                Save Changes
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
};

export default AdminPayroll;
