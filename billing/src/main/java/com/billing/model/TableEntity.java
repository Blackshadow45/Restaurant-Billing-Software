package com.billing.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "tables")
public class TableEntity {

    @Id
    private String id;

    private String restaurantId;   // SaaS isolation
    private String tableNumber;    // 1, 2, 3...
    private String status;         // FREE, BUSY, RESERVED

    public TableEntity() {
        this.status = "FREE";
    }

    // getters & setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getRestaurantId() { return restaurantId; }
    public void setRestaurantId(String restaurantId) { this.restaurantId = restaurantId; }

    public String getTableNumber() { return tableNumber; }
    public void setTableNumber(String tableNumber) { this.tableNumber = tableNumber; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
}
