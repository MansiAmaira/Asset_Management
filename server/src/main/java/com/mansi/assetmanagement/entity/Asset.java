package com.sciforn.assetmanagement.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Entity
@Table(name = "assets")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Asset {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @NotBlank(message = "Asset name is required")
    @Column(nullable = false)
    private String assetName;
    
    @NotBlank(message = "Asset type is required")
    @Column(nullable = false)
    private String assetType;
    
    @Column(nullable = false)
    private String makeModel;
    
    @Column(unique = true, nullable = false)
    private String serialNumber;
    
    @NotNull(message = "Purchase date is required")
    @Column(nullable = false)
    private LocalDate purchaseDate;
    
    private LocalDate warrantyExpiryDate;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private AssetCondition condition = AssetCondition.NEW;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private AssetStatus status = AssetStatus.AVAILABLE;
    
    @Column(nullable = false)
    private Boolean isSpare = false;
    
    @Column(columnDefinition = "TEXT")
    private String specifications;
    
    public enum AssetCondition {
        NEW, GOOD, NEEDS_REPAIR, DAMAGED
    }
    
    public enum AssetStatus {
        AVAILABLE, ASSIGNED, UNDER_REPAIR, RETIRED
    }
}
