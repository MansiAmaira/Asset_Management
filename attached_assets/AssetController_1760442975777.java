package com.sciforn.assetmanagement.controller;

import com.sciforn.assetmanagement.entity.Asset;
import com.sciforn.assetmanagement.service.AssetService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/assets")
@RequiredArgsConstructor
public class AssetController {
    
    private final AssetService assetService;
    
    @GetMapping
    public ResponseEntity<List<Asset>> getAllAssets() {
        return ResponseEntity.ok(assetService.getAllAssets());
    }
    
    @GetMapping("/paginated")
    public ResponseEntity<Page<Asset>> getAllAssetsPaginated(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "id") String sortBy,
            @RequestParam(defaultValue = "ASC") String sortDir) {
        
        Sort sort = sortDir.equalsIgnoreCase("DESC") ? 
            Sort.by(sortBy).descending() : Sort.by(sortBy).ascending();
        Pageable pageable = PageRequest.of(page, size, sort);
        return ResponseEntity.ok(assetService.getAllAssetsPaginated(pageable));
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<Asset> getAssetById(@PathVariable Long id) {
        return assetService.getAssetById(id)
            .map(ResponseEntity::ok)
            .orElse(ResponseEntity.notFound().build());
    }
    
    @PostMapping
    public ResponseEntity<Asset> createAsset(@Valid @RequestBody Asset asset) {
        try {
            Asset created = assetService.createAsset(asset);
            return ResponseEntity.status(HttpStatus.CREATED).body(created);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<Asset> updateAsset(@PathVariable Long id, @Valid @RequestBody Asset asset) {
        try {
            Asset updated = assetService.updateAsset(id, asset);
            return ResponseEntity.ok(updated);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteAsset(@PathVariable Long id) {
        try {
            assetService.deleteAsset(id);
            return ResponseEntity.noContent().build();
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
    
    @GetMapping("/type/{assetType}")
    public ResponseEntity<List<Asset>> getAssetsByType(@PathVariable String assetType) {
        return ResponseEntity.ok(assetService.getAssetsByType(assetType));
    }
    
    @GetMapping("/status/{status}")
    public ResponseEntity<List<Asset>> getAssetsByStatus(@PathVariable Asset.AssetStatus status) {
        return ResponseEntity.ok(assetService.getAssetsByStatus(status));
    }
    
    @GetMapping("/statistics")
    public ResponseEntity<Map<String, Long>> getAssetStatistics() {
        return ResponseEntity.ok(assetService.getAssetStatistics());
    }
    
    @GetMapping("/statistics/by-type")
    public ResponseEntity<Map<String, Long>> getAssetsByTypeCount() {
        return ResponseEntity.ok(assetService.getAssetsByTypeCount());
    }
}
