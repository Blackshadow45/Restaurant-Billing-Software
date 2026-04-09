package com.billing.dto;

import java.util.List;

public class MergeTableRequest {
    private String restaurantId;
    private List<Integer> tables;

    public String getRestaurantId() {
        return restaurantId;
    }

    public void setRestaurantId(String restaurantId) {
        this.restaurantId = restaurantId;
    }

    public List<Integer> getTables() {
        return tables;
    }

    public void setTables(List<Integer> tables) {
        this.tables = tables;
    }
}

