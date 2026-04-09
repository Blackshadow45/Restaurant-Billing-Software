package com.billing.repository;

import java.util.List;
import org.springframework.data.mongodb.repository.MongoRepository;
import com.billing.model.Order;

public interface OrderRepository extends MongoRepository<Order, String> {

    List<Order> findByRestaurantId(String restaurantId);
    List<Order> findByRestaurantIdAndStatus(String restaurantId, String status);

}
