
package com.billing.repository;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.billing.model.Restaurant;

public interface RestaurantRepository extends MongoRepository<Restaurant, String> {

	boolean existsByEmail(String email);
	
	Restaurant findByEmail(String email);
}
