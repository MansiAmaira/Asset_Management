import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAppDispatch } from "@/store/hooks";
import { createAsset, updateAsset } from "@/store/slices/assetSlice";
import { insertAssetSchema, type Asset, type InsertAsset } from "@shared/schema";
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
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

interface AssetDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  asset: Asset | null;
}

export function AssetDialog({ open, onOpenChange, asset }: AssetDialogProps) {
  const dispatch = useAppDispatch();
  const { toast } = useToast();

  const form = useForm<InsertAsset>({
    resolver: zodResolver(insertAssetSchema),
    defaultValues: {
      assetName: "",
      assetType: "",
      makeModel: "",
      serialNumber: "",
      purchaseDate: "",
      warrantyExpiryDate: null,
      condition: "GOOD",
      status: "AVAILABLE",
      isSpare: false,
      specifications: null,
    },
  });

  useEffect(() => {
    if (asset) {
      form.reset({
        assetName: asset.assetName,
        assetType: asset.assetType,
        makeModel: asset.makeModel,
        serialNumber: asset.serialNumber,
        purchaseDate: asset.purchaseDate,
        warrantyExpiryDate: asset.warrantyExpiryDate,
        condition: asset.condition,
        status: asset.status,
        isSpare: asset.isSpare,
        specifications: asset.specifications,
      });
    } else {
      form.reset({
        assetName: "",
        assetType: "",
        makeModel: "",
        serialNumber: "",
        purchaseDate: "",
        warrantyExpiryDate: null,
        condition: "GOOD",
        status: "AVAILABLE",
        isSpare: false,
        specifications: null,
      });
    }
  }, [asset, form]);

  const onSubmit = async (data: InsertAsset) => {
    try {
      if (asset) {
        await dispatch(updateAsset({ id: asset.id, data })).unwrap();
        toast({
          title: "Success",
          description: "Asset updated successfully",
        });
      } else {
        await dispatch(createAsset(data)).unwrap();
        toast({
          title: "Success",
          description: "Asset created successfully",
        });
      }
      onOpenChange(false);
      form.reset();
    } catch (error) {
      toast({
        title: "Error",
        description: `Failed to ${asset ? "update" : "create"} asset`,
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{asset ? "Edit Asset" : "Add New Asset"}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="assetName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Asset Name</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Dell Laptop" 
                        {...field} 
                        data-testid="input-assetName"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="assetType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Asset Type</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Laptop" 
                        {...field} 
                        data-testid="input-assetType"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="makeModel"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Make/Model</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Dell XPS 15" 
                        {...field} 
                        data-testid="input-makeModel"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="serialNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Serial Number</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="SN123456789" 
                        {...field} 
                        data-testid="input-serialNumber"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="purchaseDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Purchase Date</FormLabel>
                    <FormControl>
                      <Input 
                        type="date" 
                        {...field} 
                        data-testid="input-purchaseDate"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="warrantyExpiryDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Warranty Expiry Date</FormLabel>
                    <FormControl>
                      <Input 
                        type="date" 
                        {...field} 
                        value={field.value || ""}
                        data-testid="input-warrantyExpiryDate"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="condition"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Condition</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger data-testid="select-condition">
                          <SelectValue placeholder="Select condition" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="NEW">New</SelectItem>
                        <SelectItem value="GOOD">Good</SelectItem>
                        <SelectItem value="NEEDS_REPAIR">Needs Repair</SelectItem>
                        <SelectItem value="DAMAGED">Damaged</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger data-testid="select-status">
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="AVAILABLE">Available</SelectItem>
                        <SelectItem value="ASSIGNED">Assigned</SelectItem>
                        <SelectItem value="UNDER_REPAIR">Under Repair</SelectItem>
                        <SelectItem value="RETIRED">Retired</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="isSpare"
              render={({ field }) => (
                <FormItem className="flex items-center justify-between rounded-md border p-3">
                  <div className="space-y-0.5">
                    <FormLabel>Is Spare Asset</FormLabel>
                    <div className="text-sm text-muted-foreground">
                      Mark this asset as a spare
                    </div>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      data-testid="switch-isSpare"
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="specifications"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Specifications / Details</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Enter detailed specifications..." 
                      {...field} 
                      value={field.value || ""}
                      rows={3}
                      data-testid="textarea-specifications"
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
                disabled={form.formState.isSubmitting}
                data-testid="button-save-asset"
              >
                {form.formState.isSubmitting ? "Saving..." : asset ? "Update" : "Create"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
