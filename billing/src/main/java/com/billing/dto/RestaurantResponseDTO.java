package com.billing.dto;

public class RestaurantResponseDTO {

    private String id;
    private String name;
    private String email;
    private boolean active;

    public RestaurantResponseDTO(String id, String name, String email, boolean active) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.active = active;
    }

    public String getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public String getEmail() {
        return email;
    }

    public boolean isActive() {
        return active;
    }
}
