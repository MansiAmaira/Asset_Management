package com.sciforn.assetmanagement.service;

import com.sciforn.assetmanagement.entity.Asset;
import com.sciforn.assetmanagement.repository.AssetRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Transactional
public class AssetService {
    
    private final AssetRepository assetRepository;
    
    public List<Asset> getAllAssets() {
        return assetRepository.findAll();
    }
    
    public Page<Asset> getAllAssetsPaginated(Pageable pageable) {
        return assetRepository.findAll(pageable);
    }
    
    public Optional<Asset> getAssetById(Long id) {
        return assetRepository.findById(id);
    }
    
    public Asset createAsset(Asset asset) {
        if (assetRepository.findBySerialNumber(asset.getSerialNumber()).isPresent()) {
            throw new RuntimeException("Asset with serial number " + asset.getSerialNumber() + " already exists");
        }
        return assetRepository.save(asset);
    }
    
    public Asset updateAsset(Long id, Asset assetDetails) {
        Asset asset = assetRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Asset not found with id: " + id));
        
        Optional<Asset> existingSerial = assetRepository.findBySerialNumber(assetDetails.getSerialNumber());
        if (existingSerial.isPresent() && !existingSerial.get().getId().equals(id)) {
            throw new RuntimeException("Serial number already in use by another asset");
        }
        
        asset.setAssetName(assetDetails.getAssetName());
        asset.setAssetType(assetDetails.getAssetType());
        asset.setMakeModel(assetDetails.getMakeModel());
        asset.setSerialNumber(assetDetails.getSerialNumber());
        asset.setPurchaseDate(assetDetails.getPurchaseDate());
        asset.setWarrantyExpiryDate(assetDetails.getWarrantyExpiryDate());
        asset.setCondition(assetDetails.getCondition());
        asset.setStatus(assetDetails.getStatus());
        asset.setIsSpare(assetDetails.getIsSpare());
        asset.setSpecifications(assetDetails.getSpecifications());
        
        return assetRepository.save(asset);
    }
    
    public void deleteAsset(Long id) {
        if (!assetRepository.existsById(id)) {
            throw new RuntimeException("Asset not found with id: " + id);
        }
        assetRepository.deleteById(id);
    }
    
    public List<Asset> getAssetsByType(String assetType) {
        return assetRepository.findByAssetType(assetType);
    }
    
    public List<Asset> getAssetsByStatus(Asset.AssetStatus status) {
        return assetRepository.findByStatus(status);
    }
    
    public Map<String, Long> getAssetStatistics() {
        Map<String, Long> stats = new HashMap<>();
        stats.put("total", assetRepository.count());
        stats.put("available", assetRepository.countByStatus(Asset.AssetStatus.AVAILABLE));
        stats.put("assigned", assetRepository.countByStatus(Asset.AssetStatus.ASSIGNED));
        stats.put("underRepair", assetRepository.countByStatus(Asset.AssetStatus.UNDER_REPAIR));
        stats.put("retired", assetRepository.countByStatus(Asset.AssetStatus.RETIRED));
        stats.put("spare", assetRepository.findAll().stream().filter(Asset::getIsSpare).count());
        return stats;
    }
    
    public Map<String, Long> getAssetsByTypeCount() {
        Map<String, Long> typeCount = new HashMap<>();
        List<Object[]> results = assetRepository.countByAssetType();
        for (Object[] result : results) {
            typeCount.put((String) result[0], (Long) result[1]);
        }
        return typeCount;
    }
}
