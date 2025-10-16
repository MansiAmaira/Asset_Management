package com.sciforn.assetmanagement.repository;

import com.sciforn.assetmanagement.entity.AssignmentHistory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface AssignmentHistoryRepository extends JpaRepository<AssignmentHistory, Long> {
    List<AssignmentHistory> findByAssetId(Long assetId);
    List<AssignmentHistory> findByEmployeeId(Long employeeId);
    
    @Query("SELECT ah FROM AssignmentHistory ah WHERE ah.asset.id = :assetId AND ah.returnedDate IS NULL")
    Optional<AssignmentHistory> findActiveAssignmentByAssetId(Long assetId);
}
