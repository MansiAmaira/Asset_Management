package com.sciforn.assetmanagement.service;

import com.sciforn.assetmanagement.entity.Employee;
import com.sciforn.assetmanagement.repository.EmployeeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Transactional
public class EmployeeService {
    
    private final EmployeeRepository employeeRepository;
    
    public List<Employee> getAllEmployees() {
        return employeeRepository.findAll();
    }
    
    public Optional<Employee> getEmployeeById(Long id) {
        return employeeRepository.findById(id);
    }
    
    public Employee createEmployee(Employee employee) {
        if (employeeRepository.findByEmail(employee.getEmail()).isPresent()) {
            throw new RuntimeException("Employee with email " + employee.getEmail() + " already exists");
        }
        return employeeRepository.save(employee);
    }
    
    public Employee updateEmployee(Long id, Employee employeeDetails) {
        Employee employee = employeeRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Employee not found with id: " + id));
        
        Optional<Employee> existingEmail = employeeRepository.findByEmail(employeeDetails.getEmail());
        if (existingEmail.isPresent() && !existingEmail.get().getId().equals(id)) {
            throw new RuntimeException("Email already in use by another employee");
        }
        
        employee.setFullName(employeeDetails.getFullName());
        employee.setDepartment(employeeDetails.getDepartment());
        employee.setEmail(employeeDetails.getEmail());
        employee.setPhoneNumber(employeeDetails.getPhoneNumber());
        employee.setDesignation(employeeDetails.getDesignation());
        employee.setStatus(employeeDetails.getStatus());
        
        return employeeRepository.save(employee);
    }
    
    public void deleteEmployee(Long id) {
        if (!employeeRepository.existsById(id)) {
            throw new RuntimeException("Employee not found with id: " + id);
        }
        employeeRepository.deleteById(id);
    }
    
    public List<Employee> getActiveEmployees() {
        return employeeRepository.findByStatus(Employee.EmployeeStatus.ACTIVE);
    }
}
