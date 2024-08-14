package com.wholesaled.clientsideservice.Repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.wholesaled.clientsideservice.Model.Cart;

import java.util.List;

@Repository("CartRepository")
public interface CartRepository extends JpaRepository<Cart, Long> {

    Cart findCartById(long id);

    List<Cart> findCartsByClient_Id(long id);

    void deleteCartById(long id);

    void deleteCartsByClient_Id(Long id);

    void deleteCartByClient_Id(Long id);

    Cart findCartByClientId(Long clientId);
}
