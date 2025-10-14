import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchEmployees, deleteEmployee } from "@/store/slices/employeeSlice";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Pencil, Trash2, Search, Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { EmployeeDialog } from "@/components/employees/employee-dialog";
import type { Employee } from "@shared/schema";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";

export default function Employees() {
  const dispatch = useAppDispatch();
  const { employees, loading } = useAppSelector((state) => state.employees);
  const { toast } = useToast();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [employeeToDelete, setEmployeeToDelete] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    dispatch(fetchEmployees());
  }, [dispatch]);

  const handleEdit = (employee: Employee) => {
    setEditingEmployee(employee);
    setDialogOpen(true);
  };

  const handleDelete = async () => {
    if (employeeToDelete !== null) {
      try {
        await dispatch(deleteEmployee(employeeToDelete)).unwrap();
        toast({
          title: "Success",
          description: "Employee deleted successfully",
        });
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to delete employee",
          variant: "destructive",
        });
      } finally {
        setDeleteDialogOpen(false);
        setEmployeeToDelete(null);
      }
    }
  };

  const filteredEmployees = employees.filter((emp) =>
    emp.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    emp.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    emp.department.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Employees</h1>
          <p className="text-muted-foreground mt-1">Manage your organization's employees</p>
        </div>
        <Button 
          onClick={() => {
            setEditingEmployee(null);
            setDialogOpen(true);
          }}
          data-testid="button-add-employee"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Employee
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Employee List</CardTitle>
          <div className="mt-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search employees by name, email, or department..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                data-testid="input-search-employees"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8 text-muted-foreground">Loading employees...</div>
          ) : filteredEmployees.length === 0 ? (
            <div className="text-center py-12">
              <Users className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">
                {searchTerm ? "No employees found matching your search" : "No employees yet"}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-3 px-4 font-medium text-sm text-muted-foreground">ID</th>
                    <th className="text-left py-3 px-4 font-medium text-sm text-muted-foreground">Name</th>
                    <th className="text-left py-3 px-4 font-medium text-sm text-muted-foreground">Email</th>
                    <th className="text-left py-3 px-4 font-medium text-sm text-muted-foreground">Department</th>
                    <th className="text-left py-3 px-4 font-medium text-sm text-muted-foreground">Designation</th>
                    <th className="text-left py-3 px-4 font-medium text-sm text-muted-foreground">Phone</th>
                    <th className="text-left py-3 px-4 font-medium text-sm text-muted-foreground">Status</th>
                    <th className="text-right py-3 px-4 font-medium text-sm text-muted-foreground">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredEmployees.map((employee) => (
                    <tr 
                      key={employee.id} 
                      className="border-b border-border hover-elevate"
                      data-testid={`row-employee-${employee.id}`}
                    >
                      <td className="py-3 px-4 font-mono text-sm">{employee.id}</td>
                      <td className="py-3 px-4 font-medium">{employee.fullName}</td>
                      <td className="py-3 px-4 text-sm text-muted-foreground">{employee.email}</td>
                      <td className="py-3 px-4">{employee.department}</td>
                      <td className="py-3 px-4">{employee.designation}</td>
                      <td className="py-3 px-4 font-mono text-sm">{employee.phoneNumber}</td>
                      <td className="py-3 px-4">
                        <Badge variant={employee.status === "ACTIVE" ? "default" : "secondary"}>
                          {employee.status}
                        </Badge>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleEdit(employee)}
                            data-testid={`button-edit-employee-${employee.id}`}
                          >
                            <Pencil className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => {
                              setEmployeeToDelete(employee.id);
                              setDeleteDialogOpen(true);
                            }}
                            data-testid={`button-delete-employee-${employee.id}`}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      <EmployeeDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        employee={editingEmployee}
      />

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Employee</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this employee? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel data-testid="button-cancel-delete">Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              data-testid="button-confirm-delete"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
