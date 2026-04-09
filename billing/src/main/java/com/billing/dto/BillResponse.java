package com.billing.dto;

import java.time.LocalDateTime;
import java.util.List;
import com.billing.model.OrderItem;

public class BillResponse {

    private String orderId;
    private String restaurantId;
    private String tableNumber;
    private List<OrderItem> items;
    private double totalAmount;
    private String status;
    private LocalDateTime generatedAt;

    public BillResponse() {}

    public BillResponse(String orderId, String restaurantId, String tableNumber,
                        List<OrderItem> items, double totalAmount, String status) {
        this.orderId = orderId;
        this.restaurantId = restaurantId;
        this.tableNumber = tableNumber;
        this.items = items;
        this.totalAmount = totalAmount;
        this.status = status;
        this.generatedAt = LocalDateTime.now();
    }

    // getters only (invoice read-only hota hai)
    public String getOrderId() { return orderId; }
    public String getRestaurantId() { return restaurantId; }
    public String getTableNumber() { return tableNumber; }
    public List<OrderItem> getItems() { return items; }
    public double getTotalAmount() { return totalAmount; }
    public String getStatus() { return status; }
    public LocalDateTime getGeneratedAt() { return generatedAt; }
}
