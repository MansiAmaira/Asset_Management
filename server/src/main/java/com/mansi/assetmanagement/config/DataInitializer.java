package com.sciforn.assetmanagement.config;

import com.sciforn.assetmanagement.entity.Asset;
import com.sciforn.assetmanagement.entity.Employee;
import com.sciforn.assetmanagement.repository.AssetRepository;
import com.sciforn.assetmanagement.repository.EmployeeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.util.Arrays;

@Component
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {
    
    private final EmployeeRepository employeeRepository;
    private final AssetRepository assetRepository;
    
    @Override
    public void run(String... args) {
        if (employeeRepository.count() == 0) {
            Employee emp1 = new Employee();
            emp1.setFullName("John Doe");
            emp1.setDepartment("IT");
            emp1.setEmail("john.doe@company.com");
            emp1.setPhoneNumber("+1-555-0101");
            emp1.setDesignation("Software Engineer");
            emp1.setStatus(Employee.EmployeeStatus.ACTIVE);
            
            Employee emp2 = new Employee();
            emp2.setFullName("Jane Smith");
            emp2.setDepartment("HR");
            emp2.setEmail("jane.smith@company.com");
            emp2.setPhoneNumber("+1-555-0102");
            emp2.setDesignation("HR Manager");
            emp2.setStatus(Employee.EmployeeStatus.ACTIVE);
            
            Employee emp3 = new Employee();
            emp3.setFullName("Mike Johnson");
            emp3.setDepartment("Finance");
            emp3.setEmail("mike.johnson@company.com");
            emp3.setPhoneNumber("+1-555-0103");
            emp3.setDesignation("Accountant");
            emp3.setStatus(Employee.EmployeeStatus.ACTIVE);
            
            Employee emp4 = new Employee();
            emp4.setFullName("Sarah Williams");
            emp4.setDepartment("IT");
            emp4.setEmail("sarah.williams@company.com");
            emp4.setPhoneNumber("+1-555-0104");
            emp4.setDesignation("DevOps Engineer");
            emp4.setStatus(Employee.EmployeeStatus.INACTIVE);
            
            employeeRepository.saveAll(Arrays.asList(emp1, emp2, emp3, emp4));
        }
        
        if (assetRepository.count() == 0) {
            Asset asset1 = new Asset();
            asset1.setAssetName("Dell Laptop");
            asset1.setAssetType("Laptop");
            asset1.setMakeModel("Dell XPS 15");
            asset1.setSerialNumber("DL-2023-001");
            asset1.setPurchaseDate(LocalDate.of(2023, 1, 15));
            asset1.setWarrantyExpiryDate(LocalDate.of(2026, 1, 15));
            asset1.setCondition(Asset.AssetCondition.GOOD);
            asset1.setStatus(Asset.AssetStatus.AVAILABLE);
            asset1.setIsSpare(false);
            asset1.setSpecifications("Intel i7, 16GB RAM, 512GB SSD");
            
            Asset asset2 = new Asset();
            asset2.setAssetName("HP Monitor");
            asset2.setAssetType("Monitor");
            asset2.setMakeModel("HP 27-inch 4K");
            asset2.setSerialNumber("HP-2023-002");
            asset2.setPurchaseDate(LocalDate.of(2023, 3, 20));
            asset2.setWarrantyExpiryDate(LocalDate.of(2025, 3, 20));
            asset2.setCondition(Asset.AssetCondition.NEW);
            asset2.setStatus(Asset.AssetStatus.AVAILABLE);
            asset2.setIsSpare(false);
            asset2.setSpecifications("27-inch, 4K UHD, IPS Panel");
            
            Asset asset3 = new Asset();
            asset3.setAssetName("Logitech Keyboard");
            asset3.setAssetType("Keyboard");
            asset3.setMakeModel("Logitech MX Keys");
            asset3.setSerialNumber("LG-2023-003");
            asset3.setPurchaseDate(LocalDate.of(2023, 2, 10));
            asset3.setWarrantyExpiryDate(LocalDate.of(2024, 2, 10));
            asset3.setCondition(Asset.AssetCondition.GOOD);
            asset3.setStatus(Asset.AssetStatus.ASSIGNED);
            asset3.setIsSpare(false);
            asset3.setSpecifications("Wireless, Backlit, Multi-device");
            
            Asset asset4 = new Asset();
            asset4.setAssetName("Cisco Router");
            asset4.setAssetType("Network Equipment");
            asset4.setMakeModel("Cisco 2901");
            asset4.setSerialNumber("CS-2023-004");
            asset4.setPurchaseDate(LocalDate.of(2022, 11, 5));
            asset4.setWarrantyExpiryDate(LocalDate.of(2025, 11, 5));
            asset4.setCondition(Asset.AssetCondition.NEEDS_REPAIR);
            asset4.setStatus(Asset.AssetStatus.UNDER_REPAIR);
            asset4.setIsSpare(false);
            asset4.setSpecifications("Integrated Services Router, 3 ports");
            
            Asset asset5 = new Asset();
            asset5.setAssetName("HP Printer");
            asset5.setAssetType("Printer");
            asset5.setMakeModel("HP LaserJet Pro");
            asset5.setSerialNumber("HP-2023-005");
            asset5.setPurchaseDate(LocalDate.of(2021, 6, 15));
            asset5.setWarrantyExpiryDate(LocalDate.of(2023, 6, 15));
            asset5.setCondition(Asset.AssetCondition.DAMAGED);
            asset5.setStatus(Asset.AssetStatus.RETIRED);
            asset5.setIsSpare(false);
            asset5.setSpecifications("Black & White Laser Printer");
            
            Asset asset6 = new Asset();
            asset6.setAssetName("Dell Mouse");
            asset6.setAssetType("Mouse");
            asset6.setMakeModel("Dell Wireless Mouse");
            asset6.setSerialNumber("DL-2023-006");
            asset6.setPurchaseDate(LocalDate.of(2023, 4, 1));
            asset6.setWarrantyExpiryDate(LocalDate.of(2024, 4, 1));
            asset6.setCondition(Asset.AssetCondition.NEW);
            asset6.setStatus(Asset.AssetStatus.AVAILABLE);
            asset6.setIsSpare(true);
            asset6.setSpecifications("Wireless, Ergonomic Design");
            
            assetRepository.saveAll(Arrays.asList(asset1, asset2, asset3, asset4, asset5, asset6));
        }
        
        System.out.println("Sample data initialized successfully!");
    }
}
