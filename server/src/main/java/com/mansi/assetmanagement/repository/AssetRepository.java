package com.sciforn.assetmanagement.repository;

import com.sciforn.assetmanagement.entity.Asset;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface AssetRepository extends JpaRepository<Asset, Long> {
    Optional<Asset> findBySerialNumber(String serialNumber);
    List<Asset> findByAssetType(String assetType);
    List<Asset> findByStatus(Asset.AssetStatus status);
    
    @Query("SELECT COUNT(a) FROM Asset a WHERE a.status = :status")
    long countByStatus(Asset.AssetStatus status);
    
    @Query("SELECT a.assetType, COUNT(a) FROM Asset a GROUP BY a.assetType")
    List<Object[]> countByAssetType();
}
