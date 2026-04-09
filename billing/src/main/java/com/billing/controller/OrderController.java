package com.billing.controller;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.billing.dto.BillResponse;
import com.billing.dto.MergeTableRequest;
import com.billing.dto.TableStatusDTO;
import com.billing.model.Order;
import com.billing.model.OrderItem;
import com.billing.repository.OrderRepository;

@RestController
@RequestMapping("/orders")
public class OrderController {

    private final OrderRepository orderRepository;

    public OrderController(OrderRepository orderRepository) {
        this.orderRepository = orderRepository;
    }

    // 1️⃣ CREATE NEW ORDER (Table open)
    @PostMapping("/{restaurantId}")
    public Order createOrder(
            @PathVariable String restaurantId,
            @RequestParam String tableNumber) {

        Order order = new Order();
        order.setRestaurantId(restaurantId);
        order.setTableNumber(tableNumber);
        order.setStatus("OPEN");

        return orderRepository.save(order);
    }

    // 2️⃣ ADD ITEM TO ORDER
    @PostMapping("/{orderId}/add-item")
    public ResponseEntity<Order> addItemToOrder(
            @PathVariable String orderId,
            @RequestBody OrderItem newItem) {

        Order order = orderRepository.findById(orderId).orElse(null);

        if (order == null) {
            return ResponseEntity.notFound().build();
        }

        // 🔁 Check if item already exists (name + variant)
        for (OrderItem item : order.getItems()) {
            if (item.getName().equals(newItem.getName()) &&
                ((item.getVariant() == null && newItem.getVariant() == null) ||
                 (item.getVariant() != null && item.getVariant().equals(newItem.getVariant())))) {

                item.setQuantity(item.getQuantity() + newItem.getQuantity());
                recalculateTotal(order);
                return ResponseEntity.ok(orderRepository.save(order));
            }
        }

        // 🆕 New item
        order.getItems().add(newItem);
        recalculateTotal(order);

        return ResponseEntity.ok(orderRepository.save(order));
    }

    // 3️⃣ GET ORDERS FOR RESTAURANT
    @GetMapping("/{restaurantId}")
    public List<Order> getOrdersByRestaurant(
            @PathVariable String restaurantId) {

        return orderRepository.findByRestaurantId(restaurantId);
    }

    // 4️⃣ CLOSE ORDER (PAYMENT DONE)
    @PutMapping("/{orderId}/close")
    public ResponseEntity<Order> closeOrder(
            @PathVariable String orderId,
            @RequestParam String paymentMode) {

        Order order = orderRepository.findById(orderId).orElse(null);

        if (order == null) {
            return ResponseEntity.notFound().build();
        }

        order.setStatus("PAID");
        order.setPaymentMode(paymentMode);
        order.setPaidAt(LocalDateTime.now());

        return ResponseEntity.ok(orderRepository.save(order));
    }

    // 5️⃣ GET ORDER BY ORDER ID
    @GetMapping("/order/{orderId}")
    public ResponseEntity<Order> getOrderById(@PathVariable String orderId) {

        Order order = orderRepository.findById(orderId).orElse(null);

        if (order == null) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok(order);
    }

    // 6️⃣ GENERATE BILL
    @GetMapping("/bill/{orderId}")
    public ResponseEntity<BillResponse> generateBill(@PathVariable String orderId) {

        Order order = orderRepository.findById(orderId).orElse(null);

        if (order == null) {
            return ResponseEntity.notFound().build();
        }

        if (!"PAID".equals(order.getStatus())) {
            return ResponseEntity.badRequest().build();
        }

        BillResponse bill = new BillResponse(
                order.getId(),
                order.getRestaurantId(),
                order.getTableNumber(),
                order.getItems(),
                order.getTotalAmount(),
                order.getStatus()
        );

        return ResponseEntity.ok(bill);
    }

    // 7️⃣ TABLE STATUS (FREE / BUSY / MERGED)
   @GetMapping("/tables/status/{restaurantId}")
public List<TableStatusDTO> getTableStatus(
        @PathVariable String restaurantId) {

    List<Order> openOrders =
            orderRepository.findByRestaurantIdAndStatus(
                    restaurantId, "OPEN");

    Set<String> busyTables = new HashSet<>();
    Set<String> mergedTables = new HashSet<>();

    for (Order order : openOrders) {

        // ✅ Normal order
        if (!order.isMerged()) {
            busyTables.add(order.getTableNumber());
        }

        // ✅ Merged order
        if (order.isMerged() && order.getMergedTables() != null) {
            for (Integer t : order.getMergedTables()) {
                mergedTables.add(String.valueOf(t));
            }
        }
    }

    List<TableStatusDTO> response = new ArrayList<>();

    for (int i = 1; i <= 10; i++) {
        String table = String.valueOf(i);

        if (mergedTables.contains(table)) {
            response.add(new TableStatusDTO(table, "MERGED"));
        }
        else if (busyTables.contains(table)) {
            response.add(new TableStatusDTO(table, "BUSY"));
        }
        else {
            response.add(new TableStatusDTO(table, "FREE"));
        }
    }

    return response;
}


    // 8️⃣ GET OPEN ORDER FOR A TABLE
    @GetMapping("/open")
public ResponseEntity<Order> getOpenOrder(
        @RequestParam String restaurantId,
        @RequestParam String tableNumber) {

    List<Order> orders =
            orderRepository.findByRestaurantIdAndStatus(
                    restaurantId, "OPEN");

    for (Order order : orders) {

        // ✅ Normal table order
        if (!order.isMerged() &&
            order.getTableNumber() != null &&
            order.getTableNumber().equals(tableNumber)) {

            return ResponseEntity.ok(order);
        }

        // ✅ Merged table order
        if (order.isMerged() &&
            order.getMergedTables() != null &&
            order.getMergedTables().contains(
                Integer.parseInt(tableNumber))) {

            return ResponseEntity.ok(order);
        }
    }

    return ResponseEntity.notFound().build();
}


    // 9️⃣ UPDATE ITEM QUANTITY
    @PutMapping("/{orderId}/item/{index}")
    public ResponseEntity<Order> updateQuantity(
            @PathVariable String orderId,
            @PathVariable int index,
            @RequestParam int delta) {

        Order order = orderRepository.findById(orderId).orElse(null);

        if (order == null) {
            return ResponseEntity.notFound().build();
        }

        OrderItem item = order.getItems().get(index);
        item.setQuantity(item.getQuantity() + delta);

        // ❌ Remove item if quantity = 0
        if (item.getQuantity() <= 0) {
            order.getItems().remove(index);
        }

        recalculateTotal(order);
        return ResponseEntity.ok(orderRepository.save(order));
    }

    // 🔁 Helper Method
    private void recalculateTotal(Order order) {
        double total = 0;
        for (OrderItem i : order.getItems()) {
            total += i.getPrice() * i.getQuantity();
        }
        order.setTotalAmount(total);
    }

    // 🔥 SEND KOT
    @PutMapping("/{orderId}/kot")
    public Order sendKOT(@PathVariable String orderId) {

        Order order = orderRepository.findById(orderId).orElseThrow();

        order.getItems().forEach(item -> {
            if (!item.isSentToKitchen()) {
                item.setSentToKitchen(true);
            }
        });

        return orderRepository.save(order);
    }

    // 🔗 MERGE TABLES
    @PostMapping("/merge")
    public Order mergeTables(@RequestBody MergeTableRequest request) {

        Order order = new Order();
        order.setRestaurantId(request.getRestaurantId());
        order.setMerged(true);
        order.setMergedTables(request.getTables());
        order.setStatus("OPEN");

        return orderRepository.save(order);
    }

// 🔓 UNMERGE TABLES (Delete merged order)
@DeleteMapping("/unmerge/{orderId}")
public ResponseEntity<String> unmergeTables(@PathVariable String orderId) {

    Order order = orderRepository.findById(orderId).orElse(null);

    if (order == null) {
        return ResponseEntity.notFound().build();
    }

    if (!order.isMerged()) {
        return ResponseEntity.badRequest()
                .body("This order is not a merged order");
    }

    // ✅ Delete merged order completely
    orderRepository.deleteById(orderId);

    return ResponseEntity.ok("Merged tables released successfully");
}




}
