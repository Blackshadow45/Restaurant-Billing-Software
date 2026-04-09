package com.billing.controller;

import java.util.List;

import org.springframework.web.bind.annotation.*;

import com.billing.model.TableEntity;
import com.billing.repository.TableRepository;

@RestController
@RequestMapping("/tables")
public class TableController {

    private final TableRepository tableRepository;

    public TableController(TableRepository tableRepository) {
        this.tableRepository = tableRepository;
    }

    // ➕ CREATE TABLE
    @PostMapping
    public TableEntity createTable(@RequestBody TableEntity table) {
        return tableRepository.save(table);
    }

    // 📋 GET TABLES FOR RESTAURANT
    @GetMapping("/{restaurantId}")
    public List<TableEntity> getTables(@PathVariable String restaurantId) {
        return tableRepository.findByRestaurantId(restaurantId);
    }

    // 🔄 UPDATE STATUS
    @PutMapping("/{tableId}/status")
    public TableEntity updateStatus(
            @PathVariable String tableId,
            @RequestParam String status) {

        TableEntity table =
                tableRepository.findById(tableId).orElse(null);

        if (table == null) return null;

        table.setStatus(status);
        return tableRepository.save(table);
    }

    // ✅ To Delete Table (Manage Table)
    @DeleteMapping("/{tableId}")
    public void deleteTable(@PathVariable String tableId) {
        tableRepository.deleteById(tableId);
    }
}
