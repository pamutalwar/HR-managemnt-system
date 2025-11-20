package com.hrms.controller;

import java.io.IOException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.hrms.model.User;
import com.hrms.repository.*;
import com.hrms.service.ExcelRService;
import com.hrms.util.JwtUtil;

@RestController
@CrossOrigin(origins = "http://localhost:5173")
public class ExcelRController {

	@Autowired
	private UserRepository userRepository;
	
	@Autowired
	private JwtUtil jwtUtil;
	
	@Autowired
	private ExcelRService excelRService;
	
	@Autowired
	private PasswordEncoder passwordEncoder;

	// FILE: ExcelRController.java (Only login() method shown here for brevity)
	@PostMapping("/login")
	public ResponseEntity<Map<String, String>> login(@RequestBody Map<String, String> loginData) {
	    String username = loginData.get("username");
	    String password = loginData.get("password");

	    Optional<User> user = userRepository.findByUsername(username);

	    if (user.isPresent() && passwordEncoder.matches(password, user.get().getPassword())) {
	        Map<String, String> response = new HashMap<>();
	        String token = jwtUtil.generateToken(username);
	        response.put("login", "success");
	        response.put("token", token);
	        response.put("role", user.get().getRole());
	        return ResponseEntity.ok(response);
	    } else {
	        Map<String, String> response1 = new HashMap<>();
	        response1.put("login", "fail");
	        return ResponseEntity.status(401).body(response1);
	    }
	}
	
	

	
	
//	@PostMapping("/admin/upload/laptops")
//	public ResponseEntity<?> uploadLaptops(@RequestParam String pname,
//								@RequestParam int pqty,
//								@RequestParam int pcost,
//								@RequestParam MultipartFile file) {
//		 if (pname == null || pname.isEmpty() || pcost <= 0 || file == null || file.isEmpty() || pqty<=0) {
//             return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Invalid input parameters");
//         }else {
//        	 Laptops savedLaptop = null;
//			try {
//				savedLaptop = excelRService.saveLaptop(pname, pcost, pqty, file);
//			} catch (IOException e) {
//				// TODO Auto-generated catch block
//				e.printStackTrace();
//			}
//        	return ResponseEntity.ok(savedLaptop);
//         }
//	}
	
	
	
	
	
}
