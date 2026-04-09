package com.billing.controller;

import java.util.List;
import org.springframework.web.bind.annotation.*;
import com.billing.model.MenuItem;
import com.billing.repository.MenuRepository;

@RestController
@RequestMapping("/menu")
public class MenuController {

    private final MenuRepository menuRepository;

    public MenuController(MenuRepository menuRepository) {
        this.menuRepository = menuRepository;
    }

    // ➕ Add menu item
    @PostMapping("/{restaurantId}")
    public MenuItem addMenuItem(
            @PathVariable String restaurantId,
            @RequestBody MenuItem item) {

        item.setRestaurantId(restaurantId);
        item.setAvailable(true);
        return menuRepository.save(item);
    }

    // 📋 Get ALL available menu
    @GetMapping("/{restaurantId}")
    public List<MenuItem> getMenu(@PathVariable String restaurantId) {
        return menuRepository.findByRestaurantIdAndAvailableTrue(restaurantId);
    }

    // 📋 Get CATEGORY-wise menu
    @GetMapping("/{restaurantId}/category/{category}")
    public List<MenuItem> getMenuByCategory(
            @PathVariable String restaurantId,
            @PathVariable String category) {

        return menuRepository
                .findByRestaurantIdAndCategoryAndAvailableTrue(
                        restaurantId,
                        category
                );
    }
    // ✏️ UPDATE MENU ITEM

@PutMapping("/update/{id}")
public MenuItem updateMenu(
        @PathVariable String id,
        @RequestBody MenuItem updated) {

    MenuItem item = menuRepository.findById(id).orElseThrow();

    item.setName(updated.getName());
    item.setCategory(updated.getCategory());
    item.setHasHalf(updated.isHasHalf());
    item.setAvailable(updated.isAvailable());

    if (updated.isHasHalf()) {
        // ✅ half/full item
        item.setPrices(updated.getPrices());
        item.setPrice(0);
    } else {
        // ✅ single price item
        item.setPrice(updated.getPrice());
        item.setPrices(null);
    }

    return menuRepository.save(item);
}

// 👁️ ENABLE / DISABLE
@PutMapping("/toggle/{id}")
public void toggleAvailability(@PathVariable String id) {
    MenuItem item = menuRepository.findById(id).orElseThrow();
    item.setAvailable(!item.isAvailable());
    menuRepository.save(item);
}




}
