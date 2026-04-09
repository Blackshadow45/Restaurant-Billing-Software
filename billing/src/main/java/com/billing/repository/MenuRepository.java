package com.billing.repository;

import java.util.List;
import org.springframework.data.mongodb.repository.MongoRepository;
import com.billing.model.MenuItem;

public interface MenuRepository extends MongoRepository<MenuItem, String> {

    List<MenuItem> findByRestaurantIdAndAvailableTrue(String restaurantId);

    List<MenuItem> findByRestaurantIdAndCategoryAndAvailableTrue(
        String restaurantId,
        String category
    );
}
