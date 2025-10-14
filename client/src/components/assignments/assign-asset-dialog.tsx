import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { assignAsset } from "@/store/slices/assignmentSlice";
import { assignmentRequestSchema, type AssignmentRequest } from "@shared/schema";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

interface AssignAssetDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AssignAssetDialog({ open, onOpenChange }: AssignAssetDialogProps) {
  const dispatch = useAppDispatch();
  const { toast } = useToast();
  const { assets } = useAppSelector((state) => state.assets);
  const { employees } = useAppSelector((state) => state.employees);

  const availableAssets = assets.filter(a => a.status === "AVAILABLE");
  const activeEmployees = employees.filter(e => e.status === "ACTIVE");

  const form = useForm<AssignmentRequest>({
    resolver: zodResolver(assignmentRequestSchema),
    defaultValues: {
      assetId: 0,
      employeeId: 0,
      notes: "",
    },
  });

  const onSubmit = async (data: AssignmentRequest) => {
    try {
      await dispatch(assignAsset(data)).unwrap();
      toast({
        title: "Success",
        description: "Asset assigned successfully",
      });
      onOpenChange(false);
      form.reset();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to assign asset",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Assign Asset to Employee</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="assetId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Select Asset</FormLabel>
                  <Select 
                    onValueChange={(value) => field.onChange(Number(value))} 
                    value={field.value?.toString()}
                  >
                    <FormControl>
                      <SelectTrigger data-testid="select-asset">
                        <SelectValue placeholder="Choose an available asset" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {availableAssets.length === 0 ? (
                        <div className="p-2 text-sm text-muted-foreground">
                          No available assets
                        </div>
                      ) : (
                        availableAssets.map((asset) => (
                          <SelectItem key={asset.id} value={asset.id.toString()}>
                            {asset.assetName} - {asset.serialNumber}
                          </SelectItem>
                        ))
                      )}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="employeeId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Select Employee</FormLabel>
                  <Select 
                    onValueChange={(value) => field.onChange(Number(value))} 
                    value={field.value?.toString()}
                  >
                    <FormControl>
                      <SelectTrigger data-testid="select-employee">
                        <SelectValue placeholder="Choose an active employee" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {activeEmployees.length === 0 ? (
                        <div className="p-2 text-sm text-muted-foreground">
                          No active employees
                        </div>
                      ) : (
                        activeEmployees.map((employee) => (
                          <SelectItem key={employee.id} value={employee.id.toString()}>
                            {employee.fullName} - {employee.department}
                          </SelectItem>
                        ))
                      )}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Notes (Optional)</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Add any notes about this assignment..." 
                      {...field} 
                      rows={3}
                      data-testid="textarea-notes"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end gap-3 pt-4">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => onOpenChange(false)}
                data-testid="button-cancel"
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                disabled={form.formState.isSubmitting || availableAssets.length === 0 || activeEmployees.length === 0}
                data-testid="button-assign"
              >
                {form.formState.isSubmitting ? "Assigning..." : "Assign Asset"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
