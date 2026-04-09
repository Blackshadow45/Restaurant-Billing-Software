package com.billing.controller;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

import java.util.HashMap;
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.billing.dto.LoginRequest;
import com.billing.dto.RestaurantResponseDTO;
import com.billing.model.Restaurant;
import com.billing.repository.RestaurantRepository;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import com.billing.security.JwtUtil;


@RestController
@RequestMapping("/restaurants")
public class RestaurantController {

    private final RestaurantRepository restaurantRepository;
     
    private final BCryptPasswordEncoder passwordEncoder;
    
    private final JwtUtil jwtUtil;

    public RestaurantController(RestaurantRepository restaurantRepository,
            BCryptPasswordEncoder passwordEncoder,
            JwtUtil jwtUtil) {

        this.restaurantRepository = restaurantRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtil = jwtUtil;
    }


    //  POST API (THIS IS IMPORTANT)
    @PostMapping
    public Restaurant createRestaurant(@RequestBody Restaurant restaurant) {
        return restaurantRepository.save(restaurant);
    }
    
    @GetMapping
    public List<Restaurant> getAllRestaurants() {
        return restaurantRepository.findAll();
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteRestaurant(@PathVariable String id) {

        if (!restaurantRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }

        restaurantRepository.deleteById(id);
        return ResponseEntity.ok("Restaurant deleted successfully");
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<Restaurant> updateRestaurant(
            @PathVariable String id,
            @RequestBody Restaurant updatedRestaurant) {

        return restaurantRepository.findById(id)
                .map(existing -> {
                    existing.setName(updatedRestaurant.getName());
                    existing.setAddress(updatedRestaurant.getAddress());
                    existing.setMobile(updatedRestaurant.getMobile());
                    existing.setGstNumber(updatedRestaurant.getGstNumber());
                    return ResponseEntity.ok(restaurantRepository.save(existing));
                })
                .orElse(ResponseEntity.notFound().build());
    }
    @GetMapping("/{id}")
    public ResponseEntity<Restaurant> getRestaurantById(@PathVariable String id) {

        return restaurantRepository.findById(id)
                .map(restaurant -> ResponseEntity.ok(restaurant))
                .orElse(ResponseEntity.notFound().build());
    }
    
    @PostMapping("/register")
    public ResponseEntity<?> registerRestaurant(@RequestBody Restaurant restaurant) {

        if (restaurantRepository.existsByEmail(restaurant.getEmail())) {
            return ResponseEntity.badRequest().body("Email already registered");
        }

        // 🔐 PASSWORD ENCRYPT HERE
        restaurant.setPassword(
            passwordEncoder.encode(restaurant.getPassword())
        );
         
        restaurant.setRole("OWNER");
        restaurant.setActive(true);

        Restaurant saved = restaurantRepository.save(restaurant);
        return ResponseEntity.ok(saved);
    }
    
    
    
  @PostMapping("/login")
public ResponseEntity<?> login(@RequestBody LoginRequest request) {

    System.out.println("LOGIN API HIT");

    Restaurant restaurant =
            restaurantRepository.findByEmail(request.getEmail());

    if (restaurant == null) {
        return ResponseEntity.status(401).body("Invalid email");
    }

    if (!passwordEncoder.matches(request.getPassword(), restaurant.getPassword())) {
        return ResponseEntity.status(401).body("Invalid password");
    }

    String token = jwtUtil.generateToken(
            restaurant.getId(),
            restaurant.getRole()
    );

    // ✅ SAFE MAP (no NullPointerException)
    Map<String, Object> response = new HashMap<>();
    response.put("token", token);
    response.put("role", restaurant.getRole());
    response.put("restaurantId", restaurant.getId());

    return ResponseEntity.ok(response);
 }
}