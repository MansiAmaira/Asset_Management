import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchAssets, deleteAsset, setFilters, clearFilters } from "@/store/slices/assetSlice";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Pencil, Trash2, Search, Filter, X, Package } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { AssetDialog } from "@/components/assets/asset-dialog";
import { AssetFilters } from "@/components/assets/asset-filters";
import type { Asset, AssetStatus, AssetCondition } from "@shared/schema";
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
import { format } from "date-fns";

const statusColors: Record<AssetStatus, string> = {
  AVAILABLE: "bg-chart-2 text-white",
  ASSIGNED: "bg-chart-4 text-white",
  UNDER_REPAIR: "bg-chart-3 text-white",
  RETIRED: "bg-destructive text-white",
};

const conditionColors: Record<AssetCondition, string> = {
  NEW: "bg-chart-2 text-white",
  GOOD: "bg-primary text-white",
  NEEDS_REPAIR: "bg-chart-3 text-white",
  DAMAGED: "bg-destructive text-white",
};

export default function Assets() {
  const dispatch = useAppDispatch();
  const { assets, loading, filters } = useAppSelector((state) => state.assets);
  const { toast } = useToast();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingAsset, setEditingAsset] = useState<Asset | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [assetToDelete, setAssetToDelete] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    dispatch(fetchAssets());
  }, [dispatch]);

  const handleEdit = (asset: Asset) => {
    setEditingAsset(asset);
    setDialogOpen(true);
  };

  const handleDelete = async () => {
    if (assetToDelete !== null) {
      try {
        await dispatch(deleteAsset(assetToDelete)).unwrap();
        toast({
          title: "Success",
          description: "Asset deleted successfully",
        });
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to delete asset",
          variant: "destructive",
        });
      } finally {
        setDeleteDialogOpen(false);
        setAssetToDelete(null);
      }
    }
  };

  const filteredAssets = assets.filter((asset) => {
    const matchesSearch = 
      asset.assetName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      asset.serialNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      asset.assetType.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesType = !filters.assetType || asset.assetType === filters.assetType;
    const matchesStatus = !filters.status || asset.status === filters.status;
    const matchesSerial = !filters.serialNumber || asset.serialNumber.toLowerCase().includes(filters.serialNumber.toLowerCase());
    
    return matchesSearch && matchesType && matchesStatus && matchesSerial;
  });

  const hasActiveFilters = filters.assetType || filters.status || filters.serialNumber;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Assets</h1>
          <p className="text-muted-foreground mt-1">Manage your organization's assets</p>
        </div>
        <Button 
          onClick={() => {
            setEditingAsset(null);
            setDialogOpen(true);
          }}
          data-testid="button-add-asset"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Asset
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Asset Inventory</CardTitle>
          <div className="mt-4 space-y-4">
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search assets by name, serial number, or type..."
                  className="pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  data-testid="input-search-assets"
                />
              </div>
              <Button
                variant={showFilters ? "default" : "outline"}
                onClick={() => setShowFilters(!showFilters)}
                data-testid="button-toggle-filters"
              >
                <Filter className="w-4 h-4 mr-2" />
                Filters
              </Button>
              {hasActiveFilters && (
                <Button
                  variant="ghost"
                  onClick={() => dispatch(clearFilters())}
                  data-testid="button-clear-filters"
                >
                  <X className="w-4 h-4 mr-2" />
                  Clear
                </Button>
              )}
            </div>
            {showFilters && <AssetFilters />}
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8 text-muted-foreground">Loading assets...</div>
          ) : filteredAssets.length === 0 ? (
            <div className="text-center py-12">
              <Package className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">
                {searchTerm || hasActiveFilters ? "No assets found matching your criteria" : "No assets yet"}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-3 px-4 font-medium text-sm text-muted-foreground">ID</th>
                    <th className="text-left py-3 px-4 font-medium text-sm text-muted-foreground">Name</th>
                    <th className="text-left py-3 px-4 font-medium text-sm text-muted-foreground">Type</th>
                    <th className="text-left py-3 px-4 font-medium text-sm text-muted-foreground">Serial Number</th>
                    <th className="text-left py-3 px-4 font-medium text-sm text-muted-foreground">Status</th>
                    <th className="text-left py-3 px-4 font-medium text-sm text-muted-foreground">Condition</th>
                    <th className="text-left py-3 px-4 font-medium text-sm text-muted-foreground">Spare</th>
                    <th className="text-right py-3 px-4 font-medium text-sm text-muted-foreground">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredAssets.map((asset) => (
                    <tr 
                      key={asset.id} 
                      className="border-b border-border hover-elevate"
                      data-testid={`row-asset-${asset.id}`}
                    >
                      <td className="py-3 px-4 font-mono text-sm">{asset.id}</td>
                      <td className="py-3 px-4 font-medium">{asset.assetName}</td>
                      <td className="py-3 px-4">{asset.assetType}</td>
                      <td className="py-3 px-4 font-mono text-sm">{asset.serialNumber}</td>
                      <td className="py-3 px-4">
                        <Badge className={statusColors[asset.status]}>
                          {asset.status.replace('_', ' ')}
                        </Badge>
                      </td>
                      <td className="py-3 px-4">
                        <Badge className={conditionColors[asset.condition]} variant="secondary">
                          {asset.condition.replace('_', ' ')}
                        </Badge>
                      </td>
                      <td className="py-3 px-4">
                        {asset.isSpare ? (
                          <Badge variant="outline">Yes</Badge>
                        ) : (
                          <span className="text-muted-foreground text-sm">No</span>
                        )}
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleEdit(asset)}
                            data-testid={`button-edit-asset-${asset.id}`}
                          >
                            <Pencil className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => {
                              setAssetToDelete(asset.id);
                              setDeleteDialogOpen(true);
                            }}
                            data-testid={`button-delete-asset-${asset.id}`}
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

      <AssetDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        asset={editingAsset}
      />

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Asset</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this asset? This action cannot be undone.
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
