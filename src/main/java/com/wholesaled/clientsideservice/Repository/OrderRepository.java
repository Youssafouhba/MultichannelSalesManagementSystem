package com.wholesaled.clientsideservice.Repository;

import java.util.List;

import feign.Param;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.wholesaled.clientsideservice.Model.Order1;


@Repository
public interface OrderRepository extends JpaRepository<Order1, Long> {
    List<Order1> findOrder1sByUser_Id(Long customerId);
    List<Order1> findAll();
    @Modifying
    @Query("DELETE FROM Order1 o WHERE o.user.id = :userId")
    void deleteByUserId(@Param("userId") Long userId);
    void deleteOrder1sByUser_Id(Long customerId);
    List<Order1> findByStatus(String status);
}

