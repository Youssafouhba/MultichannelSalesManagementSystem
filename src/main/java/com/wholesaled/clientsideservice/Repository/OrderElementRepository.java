package com.wholesaled.clientsideservice.Repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.wholesaled.clientsideservice.Model.OrderElement;

import java.util.List;

@Repository
public interface OrderElementRepository extends JpaRepository<OrderElement,Long> {
    int countOrderElementsByProductId(Long productId);
    void deleteOrderElementsByProductId(Long productId);
    void deleteOrderElementsByOrderId(Long orderId);
}