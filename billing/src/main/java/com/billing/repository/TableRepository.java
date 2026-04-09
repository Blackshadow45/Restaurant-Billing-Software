package com.billing.repository;

import java.util.List;
import org.springframework.data.mongodb.repository.MongoRepository;
import com.billing.model.TableEntity;

public interface TableRepository extends MongoRepository<TableEntity, String> {

    List<TableEntity> findByRestaurantId(String restaurantId);
}
