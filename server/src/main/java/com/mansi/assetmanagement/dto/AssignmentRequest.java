package com.sciforn.assetmanagement.dto;

import lombok.Data;

@Data
public class AssignmentRequest {
    private Long assetId;
    private Long employeeId;
    private String notes;
}
