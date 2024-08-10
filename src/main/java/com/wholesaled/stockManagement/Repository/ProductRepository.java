package com.wholesaled.stockManagement.Repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.wholesaled.stockManagement.Model.Category;
import com.wholesaled.stockManagement.Model.Product;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {
    @Query(
            "" +
                    "SELECT CASE WHEN COUNT(u) > 0 THEN " +
                    "TRUE ELSE FALSE END " +
                    "FROM Product u " +
                    "WHERE u.name = ?1"
    )
    Boolean selectExistsName(String name);
    Product findProductByCategory(Category category);
    Product findProductByIdIs(Long id);
}
