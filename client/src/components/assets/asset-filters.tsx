import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { setFilters } from "@/store/slices/assetSlice";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function AssetFilters() {
  const dispatch = useAppDispatch();
  const { filters, assets } = useAppSelector((state) => state.assets);

  const uniqueTypes = Array.from(new Set(assets.map(a => a.assetType))).sort();

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-muted/50 rounded-md">
      <div className="space-y-2">
        <Label>Asset Type</Label>
        <Select
          value={filters.assetType}
          onValueChange={(value) => dispatch(setFilters({ assetType: value }))}
        >
          <SelectTrigger data-testid="select-filter-type">
            <SelectValue placeholder="All types" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">All types</SelectItem>
            {uniqueTypes.map((type) => (
              <SelectItem key={type} value={type}>
                {type}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label>Status</Label>
        <Select
          value={filters.status}
          onValueChange={(value) => dispatch(setFilters({ status: value }))}
        >
          <SelectTrigger data-testid="select-filter-status">
            <SelectValue placeholder="All statuses" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">All statuses</SelectItem>
            <SelectItem value="AVAILABLE">Available</SelectItem>
            <SelectItem value="ASSIGNED">Assigned</SelectItem>
            <SelectItem value="UNDER_REPAIR">Under Repair</SelectItem>
            <SelectItem value="RETIRED">Retired</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label>Serial Number</Label>
        <Input
          placeholder="Filter by serial..."
          value={filters.serialNumber}
          onChange={(e) => dispatch(setFilters({ serialNumber: e.target.value }))}
          data-testid="input-filter-serial"
        />
      </div>
    </div>
  );
}
