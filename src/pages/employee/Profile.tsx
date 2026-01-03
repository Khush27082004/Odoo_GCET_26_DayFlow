import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import DashboardLayout from '@/components/layout/DashboardLayout';
import PageHeader from '@/components/ui/page-header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import {
  User,
  Mail,
  Phone,
  MapPin,
  Building,
  Briefcase,
  Calendar,
  DollarSign,
  FileText,
  Edit2,
  Save,
  X,
} from 'lucide-react';
import { updateUser } from '@/services/storage';
import { useToast } from '@/hooks/use-toast';

const Profile: React.FC = () => {
  const { user, refreshUser } = useAuth();
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    phone: user?.phone || '',
    address: user?.address || '',
  });

  if (!user) return null;

  const handleSave = () => {
    const updatedUser = {
      ...user,
      phone: formData.phone,
      address: formData.address,
    };

    updateUser(updatedUser);
    refreshUser();
    setIsEditing(false);
    toast({
      title: 'Profile Updated',
      description: 'Your profile has been updated successfully.',
    });
  };

  const handleCancel = () => {
    setFormData({
      phone: user.phone,
      address: user.address,
    });
    setIsEditing(false);
  };

  const netSalary =
    user.salary.basic + user.salary.hra + user.salary.allowances - user.salary.deductions;

  return (
    <DashboardLayout>
      <PageHeader
        title="My Profile"
        description="View and manage your personal information"
      >
        {!isEditing ? (
          <Button onClick={() => setIsEditing(true)}>
            <Edit2 className="mr-2 h-4 w-4" />
            Edit Profile
          </Button>
        ) : (
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleCancel}>
              <X className="mr-2 h-4 w-4" />
              Cancel
            </Button>
            <Button onClick={handleSave}>
              <Save className="mr-2 h-4 w-4" />
              Save Changes
            </Button>
          </div>
        )}
      </PageHeader>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Profile Card */}
        <Card className="shadow-card lg:col-span-1">
          <CardContent className="pt-6">
            <div className="flex flex-col items-center text-center">
              <div className="mb-4 flex h-24 w-24 items-center justify-center rounded-full bg-gradient-primary text-3xl font-bold text-primary-foreground">
                {user.firstName[0]}
                {user.lastName[0]}
              </div>
              <h2 className="text-xl font-bold">
                {user.firstName} {user.lastName}
              </h2>
              <p className="text-muted-foreground">{user.designation}</p>
              <Badge className="mt-2 capitalize">{user.role}</Badge>

              <div className="mt-6 w-full space-y-3 text-left">
                <div className="flex items-center gap-3 text-sm">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span className="truncate">{user.email}</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <Building className="h-4 w-4 text-muted-foreground" />
                  <span>{user.department}</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span>Joined {user.joiningDate}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Details Tabs */}
        <div className="lg:col-span-2">
          <Tabs defaultValue="personal" className="w-full">
            <TabsList className="w-full justify-start">
              <TabsTrigger value="personal">Personal Details</TabsTrigger>
              <TabsTrigger value="job">Job Details</TabsTrigger>
              <TabsTrigger value="salary">Salary</TabsTrigger>
              <TabsTrigger value="documents">Documents</TabsTrigger>
            </TabsList>

            <TabsContent value="personal" className="mt-4">
              <Card className="shadow-card">
                <CardHeader>
                  <CardTitle className="text-lg">Personal Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <Label className="text-muted-foreground">Employee ID</Label>
                      <p className="font-medium">{user.employeeId}</p>
                    </div>
                    <div>
                      <Label className="text-muted-foreground">Full Name</Label>
                      <p className="font-medium">
                        {user.firstName} {user.lastName}
                      </p>
                    </div>
                    <div>
                      <Label className="text-muted-foreground">Email</Label>
                      <p className="font-medium">{user.email}</p>
                    </div>
                    <div>
                      <Label className="text-muted-foreground">Phone</Label>
                      {isEditing ? (
                        <Input
                          value={formData.phone}
                          onChange={(e) =>
                            setFormData({ ...formData, phone: e.target.value })
                          }
                          placeholder="Enter phone number"
                        />
                      ) : (
                        <p className="font-medium">{user.phone || 'Not provided'}</p>
                      )}
                    </div>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Address</Label>
                    {isEditing ? (
                      <Input
                        value={formData.address}
                        onChange={(e) =>
                          setFormData({ ...formData, address: e.target.value })
                        }
                        placeholder="Enter your address"
                      />
                    ) : (
                      <p className="font-medium">{user.address || 'Not provided'}</p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="job" className="mt-4">
              <Card className="shadow-card">
                <CardHeader>
                  <CardTitle className="text-lg">Job Information</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="flex items-start gap-3">
                      <Building className="mt-0.5 h-5 w-5 text-muted-foreground" />
                      <div>
                        <Label className="text-muted-foreground">Department</Label>
                        <p className="font-medium">{user.department}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Briefcase className="mt-0.5 h-5 w-5 text-muted-foreground" />
                      <div>
                        <Label className="text-muted-foreground">Designation</Label>
                        <p className="font-medium">{user.designation}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <User className="mt-0.5 h-5 w-5 text-muted-foreground" />
                      <div>
                        <Label className="text-muted-foreground">Role</Label>
                        <p className="font-medium capitalize">{user.role}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Calendar className="mt-0.5 h-5 w-5 text-muted-foreground" />
                      <div>
                        <Label className="text-muted-foreground">Joining Date</Label>
                        <p className="font-medium">{user.joiningDate}</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="salary" className="mt-4">
              <Card className="shadow-card">
                <CardHeader>
                  <CardTitle className="text-lg">Salary Structure</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="rounded-lg border bg-muted/30 p-4">
                        <p className="text-sm text-muted-foreground">Basic Salary</p>
                        <p className="text-xl font-bold">
                          ₹{user.salary.basic.toLocaleString()}
                        </p>
                      </div>
                      <div className="rounded-lg border bg-muted/30 p-4">
                        <p className="text-sm text-muted-foreground">HRA</p>
                        <p className="text-xl font-bold">
                          ₹{user.salary.hra.toLocaleString()}
                        </p>
                      </div>
                      <div className="rounded-lg border bg-muted/30 p-4">
                        <p className="text-sm text-muted-foreground">Allowances</p>
                        <p className="text-xl font-bold text-success">
                          +₹{user.salary.allowances.toLocaleString()}
                        </p>
                      </div>
                      <div className="rounded-lg border bg-muted/30 p-4">
                        <p className="text-sm text-muted-foreground">Deductions</p>
                        <p className="text-xl font-bold text-destructive">
                          -₹{user.salary.deductions.toLocaleString()}
                        </p>
                      </div>
                    </div>
                    <div className="rounded-lg border-2 border-primary/20 bg-primary/5 p-4">
                      <div className="flex items-center gap-2">
                        <DollarSign className="h-5 w-5 text-primary" />
                        <p className="text-sm font-medium text-muted-foreground">
                          Net Salary (Annual)
                        </p>
                      </div>
                      <p className="mt-1 text-3xl font-bold text-primary">
                        ₹{netSalary.toLocaleString()}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="documents" className="mt-4">
              <Card className="shadow-card">
                <CardHeader>
                  <CardTitle className="text-lg">Documents</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {['Resume', 'ID Proof', 'Address Proof', 'Educational Certificates'].map(
                      (doc) => (
                        <div
                          key={doc}
                          className="flex items-center justify-between rounded-lg border p-4"
                        >
                          <div className="flex items-center gap-3">
                            <FileText className="h-5 w-5 text-muted-foreground" />
                            <span className="font-medium">{doc}</span>
                          </div>
                          <Badge variant="secondary">Uploaded</Badge>
                        </div>
                      )
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Profile;
