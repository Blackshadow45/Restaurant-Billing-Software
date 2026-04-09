package com.billing.dto;

public class TableStatusDTO {

    private String tableNumber;
    private String status; // FREE / BUSY

    public TableStatusDTO(String tableNumber, String status) {
        this.tableNumber = tableNumber;
        this.status = status;
    }

    public String getTableNumber() {
        return tableNumber;
    }

    public String getStatus() {
        return status;
    }
}
