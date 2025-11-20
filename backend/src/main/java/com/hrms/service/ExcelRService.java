package com.hrms.service;

import java.io.IOException;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.hrms.model.User;
import com.hrms.repository.*;
import com.hrms.repository.UserRepository;

//import software.amazon.awssdk.auth.credentials.AwsBasicCredentials;
//import software.amazon.awssdk.auth.credentials.StaticCredentialsProvider;
//import software.amazon.awssdk.core.sync.RequestBody;
//import software.amazon.awssdk.regions.Region;
//import software.amazon.awssdk.services.s3.S3Client;
//import software.amazon.awssdk.services.s3.model.PutObjectRequest;

//import com.razorpay.Order;
//import com.razorpay.RazorpayClient;
//import com.razorpay.RazorpayException;
//import org.json.JSONObject;

@Service
public class ExcelRService {

	@Autowired
	private UserRepository userRepository;
	
	
//	 @Value("${aws.s3.bucket.name}")
//	 private String bucketName;
//	    
	    
//	 @Value("${aws.accessKeyId}")
//	 private String accessKeyId;
//
//	 @Value("${aws.secretAccessKey}")
//	 private String secretAccessKey;
	
	
	 
//	 //getting reference of s3 buckets
//	 private final S3Client s3Client = S3Client.builder()
//	            .region(Region.EU_NORTH_1)
//	            .credentialsProvider(StaticCredentialsProvider.create(
//	                AwsBasicCredentials.create("***REMOVED_AWS_ACCESS_KEY***", "***REMOVED_AWS_SECRET_KEY***")
//	            ))
//	            .build();
//	 
//	 
	 
//	 public Laptops saveLaptop(String pname, int pcost, int pqty, MultipartFile file) throws IOException {
//	        String fileName = System.currentTimeMillis() + "_" + file.getOriginalFilename();
//	        try {
//	            // Upload to S3
//	            s3Client.putObject(
//	                PutObjectRequest.builder()
//	                    .bucket(bucketName)
//	                    .key(fileName)
//	                    
//	                    .contentType("image/jpeg")
//	                    .build(),
//	                RequestBody.fromBytes(file.getBytes())
//	            );
//	        } catch (Exception e) {
//	            throw new RuntimeException("Error uploading file to S3: " + e.getMessage());
//	        }
//
//	        //String fileUrl = String.format("https://%s.s3.%s.amazonaws.com/%s", bucketName, Region.US_EAST_1.id(), fileName);
//
//	        String fileUrl = String.format("https://%s.s3.%s.amazonaws.com/%s", bucketName, Region.EU_NORTH_1.id(), fileName);
//	        System.out.println("File uploaded successfully. File URL: " + fileUrl);
//
//	        
//	        try {
//	            // Save to database
//	            Laptops laptop = new Laptops();
//	            laptop.setPname(pname);
//	            laptop.setPcost(pcost);
//	            laptop.setPimage(fileUrl);
//	            laptop.setPqty(pqty);
//	            System.out.println("Saving Laptop: pname=" + pname + ", pcost=" + pcost + ", pimage=" + fileUrl);
//
//	            return laptopsRepo.save(laptop);
//	        } catch (Exception e) {
//	            throw new RuntimeException("Error saving laptop to database: " + e.getMessage());
//	        }
//	    }
//	 
//	 
	 
	 
	 
	 
	
	public User saveUser(User user) {
		return userRepository.save(user);
	}
	
	
	
	/*
	 * Razorpay
	 */
//	@Value("${razorpay.api.key}")
//    private String key;
//
//    @Value("${razorpay.api.secret}")
//    private String secret;

//    public String createOrder(int amount, String currency, String receipt) throws RazorpayException {
//        RazorpayClient razorpay = new RazorpayClient("***REMOVED_RAZORPAY_KEY***", "***REMOVED_RAZORPAY_SECRET***");
//
//        JSONObject orderRequest = new JSONObject();
//        orderRequest.put("amount", amount * 100); // Amount in paise
//        orderRequest.put("currency", currency);
//        orderRequest.put("receipt", receipt);
//
//        Order order = razorpay.orders.create(orderRequest);
//        return order.toString();
//    }
//
//    public boolean verifyPayment(String orderId, String paymentId, String signature) {
//        String generatedSignature = HmacSHA256(orderId + "|" + paymentId, "***REMOVED_RAZORPAY_SECRET***");
//        return generatedSignature.equals(signature);
//    }
//
//    private String HmacSHA256(String data, String secret) {
//        try {
//            javax.crypto.Mac mac = javax.crypto.Mac.getInstance("HmacSHA256");
//            mac.init(new javax.crypto.spec.SecretKeySpec(secret.getBytes(), "HmacSHA256"));
//            byte[] hmacData = mac.doFinal(data.getBytes());
//            return javax.xml.bind.DatatypeConverter.printHexBinary(hmacData).toLowerCase();
//        } catch (Exception e) {
//            throw new RuntimeException("Failed to calculate HMAC SHA256", e);
//        }
//    }
//	
//	
	
	
	
	
}
