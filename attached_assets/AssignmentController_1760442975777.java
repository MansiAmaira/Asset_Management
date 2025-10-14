package com.sciforn.assetmanagement.controller;

import com.sciforn.assetmanagement.dto.AssignmentRequest;
import com.sciforn.assetmanagement.dto.ReturnRequest;
import com.sciforn.assetmanagement.entity.AssignmentHistory;
import com.sciforn.assetmanagement.service.AssignmentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/assignments")
@RequiredArgsConstructor
public class AssignmentController {
    
    private final AssignmentService assignmentService;
    
    @PostMapping("/assign")
    public ResponseEntity<AssignmentHistory> assignAsset(@RequestBody AssignmentRequest request) {
        try {
            AssignmentHistory assignment = assignmentService.assignAsset(
                request.getAssetId(), 
                request.getEmployeeId(), 
                request.getNotes()
            );
            return ResponseEntity.status(HttpStatus.CREATED).body(assignment);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    @PutMapping("/return/{assignmentId}")
    public ResponseEntity<AssignmentHistory> returnAsset(
            @PathVariable Long assignmentId, 
            @RequestBody ReturnRequest request) {
        try {
            AssignmentHistory assignment = assignmentService.returnAsset(assignmentId, request.getNotes());
            return ResponseEntity.ok(assignment);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    @GetMapping
    public ResponseEntity<List<AssignmentHistory>> getAllAssignments() {
        return ResponseEntity.ok(assignmentService.getAllAssignments());
    }
    
    @GetMapping("/asset/{assetId}")
    public ResponseEntity<List<AssignmentHistory>> getAssetHistory(@PathVariable Long assetId) {
        return ResponseEntity.ok(assignmentService.getAssetAssignmentHistory(assetId));
    }
    
    @GetMapping("/employee/{employeeId}")
    public ResponseEntity<List<AssignmentHistory>> getEmployeeHistory(@PathVariable Long employeeId) {
        return ResponseEntity.ok(assignmentService.getEmployeeAssignmentHistory(employeeId));
    }
    
    @GetMapping("/asset/{assetId}/active")
    public ResponseEntity<AssignmentHistory> getActiveAssignment(@PathVariable Long assetId) {
        return assignmentService.getActiveAssignmentForAsset(assetId)
            .map(ResponseEntity::ok)
            .orElse(ResponseEntity.notFound().build());
    }
}
