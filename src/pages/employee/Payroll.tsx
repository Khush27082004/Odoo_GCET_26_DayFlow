import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import DashboardLayout from '@/components/layout/DashboardLayout';
import PageHeader from '@/components/ui/page-header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { DollarSign, TrendingUp, TrendingDown, Calendar, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Payroll: React.FC = () => {
  const { user } = useAuth();

  if (!user) return null;

  const { salary } = user;
  const grossSalary = salary.basic + salary.hra + salary.allowances;
  const netSalary = grossSalary - salary.deductions;
  const monthlySalary = Math.round(netSalary / 12);

  // Mock payroll history
  const payrollHistory = [
    { month: 'January 2024', gross: grossSalary / 12, deductions: salary.deductions / 12, net: monthlySalary, status: 'paid' },
    { month: 'December 2023', gross: grossSalary / 12, deductions: salary.deductions / 12, net: monthlySalary, status: 'paid' },
    { month: 'November 2023', gross: grossSalary / 12, deductions: salary.deductions / 12, net: monthlySalary, status: 'paid' },
    { month: 'October 2023', gross: grossSalary / 12, deductions: salary.deductions / 12, net: monthlySalary, status: 'paid' },
    { month: 'September 2023', gross: grossSalary / 12, deductions: salary.deductions / 12, net: monthlySalary, status: 'paid' },
  ];

  return (
    <DashboardLayout>
      <PageHeader
        title="Payroll"
        description="View your salary details and payment history"
      />

      {/* Salary Overview */}
      <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="shadow-card">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-primary/10 p-2">
                <DollarSign className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Basic Salary</p>
                <p className="text-xl font-bold">₹{salary.basic.toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-card">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-info/10 p-2">
                <TrendingUp className="h-5 w-5 text-info" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">HRA</p>
                <p className="text-xl font-bold">₹{salary.hra.toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-card">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-success/10 p-2">
                <TrendingUp className="h-5 w-5 text-success" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Allowances</p>
                <p className="text-xl font-bold text-success">+₹{salary.allowances.toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-card">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-destructive/10 p-2">
                <TrendingDown className="h-5 w-5 text-destructive" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Deductions</p>
                <p className="text-xl font-bold text-destructive">-₹{salary.deductions.toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Salary Breakdown */}
        <Card className="shadow-card lg:col-span-1">
          <CardHeader>
            <CardTitle className="text-lg">Salary Structure</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground">Earnings</p>
                <div className="mt-2 space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm">Basic Salary</span>
                    <span className="font-medium">₹{salary.basic.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">House Rent Allowance</span>
                    <span className="font-medium">₹{salary.hra.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Other Allowances</span>
                    <span className="font-medium">₹{salary.allowances.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              <Separator />

              <div>
                <div className="flex justify-between">
                  <span className="font-medium">Gross Salary</span>
                  <span className="font-bold">₹{grossSalary.toLocaleString()}</span>
                </div>
              </div>

              <Separator />

              <div>
                <p className="text-sm text-muted-foreground">Deductions</p>
                <div className="mt-2 space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm">Tax</span>
                    <span className="font-medium text-destructive">-₹{Math.round(salary.deductions * 0.6).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Insurance</span>
                    <span className="font-medium text-destructive">-₹{Math.round(salary.deductions * 0.25).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Other Deductions</span>
                    <span className="font-medium text-destructive">-₹{Math.round(salary.deductions * 0.15).toLocaleString()}</span>
                  </div>
                </div>
              </div>

              <Separator />

              <div className="rounded-lg bg-primary/5 p-4">
                <div className="flex justify-between">
                  <span className="font-semibold">Net Salary (Annual)</span>
                  <span className="text-xl font-bold text-primary">₹{netSalary.toLocaleString()}</span>
                </div>
                <div className="mt-2 flex justify-between text-sm text-muted-foreground">
                  <span>Monthly (Approx.)</span>
                  <span>₹{monthlySalary.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Payment History */}
        <Card className="shadow-card lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg">Payment History</CardTitle>
            <Button variant="outline" size="sm">
              <Download className="mr-2 h-4 w-4" />
              Download All
            </Button>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Month</TableHead>
                  <TableHead className="text-right">Gross</TableHead>
                  <TableHead className="text-right">Deductions</TableHead>
                  <TableHead className="text-right">Net Pay</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {payrollHistory.map((record, index) => (
                  <TableRow key={index}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium">{record.month}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      ₹{Math.round(record.gross).toLocaleString()}
                    </TableCell>
                    <TableCell className="text-right text-destructive">
                      -₹{Math.round(record.deductions).toLocaleString()}
                    </TableCell>
                    <TableCell className="text-right font-medium">
                      ₹{Math.round(record.net).toLocaleString()}
                    </TableCell>
                    <TableCell>
                      <Badge className="bg-success/10 text-success border-success/20">
                        Paid
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Button variant="ghost" size="sm">
                        <Download className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Payroll;
