package com.wholesaled.clientsideservice.Repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.wholesaled.clientsideservice.Model.CartElement;

import java.util.List;

@Repository("CartElementRepository")
public interface CartElementRepository extends JpaRepository<CartElement, Long> {
    void deleteCartElementsByProductId(Long productId);
}
