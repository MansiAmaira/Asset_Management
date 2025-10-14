package com.sciforn.assetmanagement.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/auth")
public class AuthController {
    
    @GetMapping("/user")
    public ResponseEntity<Map<String, Object>> getCurrentUser() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        
        if (auth == null || !auth.isAuthenticated() || auth.getPrincipal().equals("anonymousUser")) {
            return ResponseEntity.ok(Map.of("authenticated", false));
        }
        
        Map<String, Object> response = new HashMap<>();
        response.put("authenticated", true);
        response.put("username", auth.getName());
        response.put("authorities", auth.getAuthorities());
        
        return ResponseEntity.ok(response);
    }
    
    @GetMapping("/login")
    public ResponseEntity<Map<String, String>> login() {
        return ResponseEntity.ok(Map.of("message", "Please use POST to login"));
    }
}
