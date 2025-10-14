import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchAssignments, returnAsset } from "@/store/slices/assignmentSlice";
import { fetchAssets } from "@/store/slices/assetSlice";
import { fetchEmployees } from "@/store/slices/employeeSlice";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, ArrowLeftRight, Calendar } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { AssignAssetDialog } from "@/components/assignments/assign-asset-dialog";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";
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

export default function Assignments() {
  const dispatch = useAppDispatch();
  const { assignments, loading } = useAppSelector((state) => state.assignments);
  const { assets } = useAppSelector((state) => state.assets);
  const { employees } = useAppSelector((state) => state.employees);
  const { toast } = useToast();
  const [assignDialogOpen, setAssignDialogOpen] = useState(false);
  const [returnDialogOpen, setReturnDialogOpen] = useState(false);
  const [assignmentToReturn, setAssignmentToReturn] = useState<number | null>(null);

  useEffect(() => {
    dispatch(fetchAssignments());
    dispatch(fetchAssets());
    dispatch(fetchEmployees());
  }, [dispatch]);

  const handleReturn = async () => {
    if (assignmentToReturn !== null) {
      try {
        await dispatch(returnAsset({ assignmentId: assignmentToReturn })).unwrap();
        toast({
          title: "Success",
          description: "Asset returned successfully",
        });
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to return asset",
          variant: "destructive",
        });
      } finally {
        setReturnDialogOpen(false);
        setAssignmentToReturn(null);
      }
    }
  };

  const getAssetName = (assetId: number) => {
    const asset = assets.find(a => a.id === assetId);
    return asset?.assetName || `Asset #${assetId}`;
  };

  const getEmployeeName = (employeeId: number) => {
    const employee = employees.find(e => e.id === employeeId);
    return employee?.fullName || `Employee #${employeeId}`;
  };

  const activeAssignments = assignments.filter(a => !a.returnedDate);
  const completedAssignments = assignments.filter(a => a.returnedDate);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Assignments</h1>
          <p className="text-muted-foreground mt-1">Track asset assignments and returns</p>
        </div>
        <Button 
          onClick={() => setAssignDialogOpen(true)}
          data-testid="button-assign-asset"
        >
          <Plus className="w-4 h-4 mr-2" />
          Assign Asset
        </Button>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ArrowLeftRight className="w-5 h-5" />
              Active Assignments ({activeAssignments.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-8 text-muted-foreground">Loading assignments...</div>
            ) : activeAssignments.length === 0 ? (
              <div className="text-center py-12">
                <ArrowLeftRight className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">No active assignments</p>
              </div>
            ) : (
              <div className="space-y-3">
                {activeAssignments.map((assignment) => (
                  <div 
                    key={assignment.id} 
                    className="p-4 border rounded-md hover-elevate"
                    data-testid={`assignment-active-${assignment.id}`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <p className="font-medium">{getAssetName(assignment.assetId)}</p>
                        <p className="text-sm text-muted-foreground">
                          Assigned to: {getEmployeeName(assignment.employeeId)}
                        </p>
                      </div>
                      <Badge variant="default">Active</Badge>
                    </div>
                    <div className="flex items-center justify-between mt-3">
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Calendar className="w-3 h-3" />
                        {format(new Date(assignment.assignedDate), 'MMM dd, yyyy')}
                      </div>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setAssignmentToReturn(assignment.id);
                          setReturnDialogOpen(true);
                        }}
                        data-testid={`button-return-${assignment.id}`}
                      >
                        Return Asset
                      </Button>
                    </div>
                    {assignment.notes && (
                      <p className="text-sm text-muted-foreground mt-2 italic">
                        Note: {assignment.notes}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              Assignment History ({completedAssignments.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {completedAssignments.length === 0 ? (
              <div className="text-center py-12">
                <Calendar className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">No completed assignments</p>
              </div>
            ) : (
              <div className="space-y-3 max-h-[600px] overflow-y-auto">
                {completedAssignments.map((assignment) => (
                  <div 
                    key={assignment.id} 
                    className="p-4 border rounded-md"
                    data-testid={`assignment-completed-${assignment.id}`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <p className="font-medium">{getAssetName(assignment.assetId)}</p>
                        <p className="text-sm text-muted-foreground">
                          Assigned to: {getEmployeeName(assignment.employeeId)}
                        </p>
                      </div>
                      <Badge variant="secondary">Returned</Badge>
                    </div>
                    <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {format(new Date(assignment.assignedDate), 'MMM dd, yyyy')}
                      </div>
                      {assignment.returnedDate && (
                        <div className="flex items-center gap-1">
                          → {format(new Date(assignment.returnedDate), 'MMM dd, yyyy')}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <AssignAssetDialog
        open={assignDialogOpen}
        onOpenChange={setAssignDialogOpen}
      />

      <AlertDialog open={returnDialogOpen} onOpenChange={setReturnDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Return Asset</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to mark this asset as returned? This will make it available for reassignment.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel data-testid="button-cancel-return">Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleReturn}
              data-testid="button-confirm-return"
            >
              Return Asset
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
