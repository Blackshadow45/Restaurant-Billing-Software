package com.billing.model;

public class OrderItem {

    private String menuItemId;
    private String name;
    private String variant; // HALF / FULL
    private double price;
    private int quantity;
    private boolean sentToKitchen = false;


    public String getMenuItemId() {
        return menuItemId;
    }

    public void setMenuItemId(String menuItemId) {
        this.menuItemId = menuItemId;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public double getPrice() {
        return price;
    }

    public void setPrice(double price) {
        this.price = price;
    }

    public int getQuantity() {
        return quantity;
    }

    public void setQuantity(int quantity) {
        this.quantity = quantity;
    }

    public String getVariant() {
        return variant;
    }

    public void setVariant(String variant) {
        this.variant = variant;
    }

    public boolean isSentToKitchen() {
    return sentToKitchen;
}

public void setSentToKitchen(boolean sentToKitchen) {
    this.sentToKitchen = sentToKitchen;
}

}

