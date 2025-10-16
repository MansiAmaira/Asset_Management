package com.sciforn.assetmanagement.service;

import com.sciforn.assetmanagement.entity.Asset;
import com.sciforn.assetmanagement.entity.AssignmentHistory;
import com.sciforn.assetmanagement.entity.Employee;
import com.sciforn.assetmanagement.repository.AssetRepository;
import com.sciforn.assetmanagement.repository.AssignmentHistoryRepository;
import com.sciforn.assetmanagement.repository.EmployeeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Transactional
public class AssignmentService {
    
    private final AssignmentHistoryRepository assignmentHistoryRepository;
    private final AssetRepository assetRepository;
    private final EmployeeRepository employeeRepository;
    
    public AssignmentHistory assignAsset(Long assetId, Long employeeId, String notes) {
        Asset asset = assetRepository.findById(assetId)
            .orElseThrow(() -> new RuntimeException("Asset not found with id: " + assetId));
        
        Employee employee = employeeRepository.findById(employeeId)
            .orElseThrow(() -> new RuntimeException("Employee not found with id: " + employeeId));
        
        if (asset.getStatus() != Asset.AssetStatus.AVAILABLE) {
            throw new RuntimeException("Asset is not available for assignment");
        }
        
        Optional<AssignmentHistory> activeAssignment = assignmentHistoryRepository.findActiveAssignmentByAssetId(assetId);
        if (activeAssignment.isPresent()) {
            throw new RuntimeException("Asset is already assigned");
        }
        
        AssignmentHistory assignment = new AssignmentHistory();
        assignment.setAsset(asset);
        assignment.setEmployee(employee);
        assignment.setAssignedDate(LocalDate.now());
        assignment.setNotes(notes);
        
        asset.setStatus(Asset.AssetStatus.ASSIGNED);
        assetRepository.save(asset);
        
        return assignmentHistoryRepository.save(assignment);
    }
    
    public AssignmentHistory returnAsset(Long assignmentId, String notes) {
        AssignmentHistory assignment = assignmentHistoryRepository.findById(assignmentId)
            .orElseThrow(() -> new RuntimeException("Assignment not found with id: " + assignmentId));
        
        if (assignment.getReturnedDate() != null) {
            throw new RuntimeException("Asset has already been returned");
        }
        
        assignment.setReturnedDate(LocalDate.now());
        if (notes != null && !notes.isEmpty()) {
            assignment.setNotes(assignment.getNotes() + "\nReturn notes: " + notes);
        }
        
        Asset asset = assignment.getAsset();
        asset.setStatus(Asset.AssetStatus.AVAILABLE);
        assetRepository.save(asset);
        
        return assignmentHistoryRepository.save(assignment);
    }
    
    public List<AssignmentHistory> getAllAssignments() {
        return assignmentHistoryRepository.findAll();
    }
    
    public List<AssignmentHistory> getAssetAssignmentHistory(Long assetId) {
        return assignmentHistoryRepository.findByAssetId(assetId);
    }
    
    public List<AssignmentHistory> getEmployeeAssignmentHistory(Long employeeId) {
        return assignmentHistoryRepository.findByEmployeeId(employeeId);
    }
    
    public Optional<AssignmentHistory> getActiveAssignmentForAsset(Long assetId) {
        return assignmentHistoryRepository.findActiveAssignmentByAssetId(assetId);
    }
}
