package com.billing.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Document(collection = "orders")
public class Order {

    @Id
    private String id;

    private String restaurantId;   // SaaS isolation
    private String tableNumber;    // table 1, table 2 etc
  
    private List<OrderItem> items=new ArrayList<>(); // kya kya order hua

    private double totalAmount;
    private String status;         // OPEN, PAID, CANCELLED
    
	private String paymentMode; // CASH, UPI, CARD
    

	private LocalDateTime paidAt;

   

	private LocalDateTime createdAt;

	private List<Integer> mergedTables = new ArrayList<>();
   public List<Integer> getMergedTables() {
		return mergedTables;
	}


	public void setMergedTables(List<Integer> mergedTables) {
		this.mergedTables = mergedTables;
	}


   private boolean merged = false;


    public boolean isMerged() {
	return merged;
}


   public void setMerged(boolean merged) {
	this.merged = merged;
   }


	public Order() {
        this.createdAt = LocalDateTime.now();
        this.status = "OPEN";
        this.items = new ArrayList<>();   // 🔥 THIS LINE IS THE FIX
    }


	public String getId() {
		return id;
	}

	public void setId(String id) {
		this.id = id;
	}

	public String getRestaurantId() {
		return restaurantId;
	}

	public void setRestaurantId(String restaurantId) {
		this.restaurantId = restaurantId;
	}

	public String getTableNumber() {
		return tableNumber;
	}

	public void setTableNumber(String tableNumber) {
		this.tableNumber = tableNumber;
	}

	public List<OrderItem> getItems() {
		return items;
	}

	public void setItems(List<OrderItem> items) {
		this.items = items;
	}

	public double getTotalAmount() {
		return totalAmount;
	}

	public void setTotalAmount(double totalAmount) {
		this.totalAmount = totalAmount;
	}

	public String getStatus() {
		return status;
	}

	public void setStatus(String status) {
		this.status = status;
	}

	public LocalDateTime getCreatedAt() {
		return createdAt;
	}

	public void setCreatedAt(LocalDateTime createdAt) {
		this.createdAt = createdAt;
	}

	public String getPaymentMode() {
		return paymentMode;
	}


	public void setPaymentMode(String paymentMode) {
		this.paymentMode = paymentMode;
	}

	 public LocalDateTime getPaidAt() {
		return paidAt;
	}


	public void setPaidAt(LocalDateTime paidAt) {
		this.paidAt = paidAt;
	}


    // getters & setters
    
}
