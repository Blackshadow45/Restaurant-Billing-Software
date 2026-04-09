package com.billing.model;
import com.billing.model.Price;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
@Document(collection = "menu_items")
public class MenuItem {

    @Id
    private String id;

    private String restaurantId;
    private String name;
    private String category;

    private boolean hasHalf;
    private Price prices;     // for half/full
    private double price;     // ✅ for single-price items

    private String imageUrl;
    private boolean available = true;

    // GETTERS & SETTERS

    public String getId() { return id; }

    public String getRestaurantId() { return restaurantId; }
    public void setRestaurantId(String restaurantId) {
        this.restaurantId = restaurantId;
    }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }

    public boolean isHasHalf() { return hasHalf; }
    public void setHasHalf(boolean hasHalf) { this.hasHalf = hasHalf; }

    public Price getPrices() { return prices; }
    public void setPrices(Price prices) { this.prices = prices; }

    

    public String getImageUrl() { return imageUrl; }
    public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }

    public boolean isAvailable() { return available; }
    public void setAvailable(boolean available) { this.available = available; }

    public double getPrice() {
    return price;
}

public void setPrice(double price) {
    this.price = price;
}

}
