package com.wholesaled.clientsideservice.Repository;

import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import com.wholesaled.clientsideservice.Model.Category;
import com.wholesaled.clientsideservice.Model.Product;

import java.util.List;

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
    @EntityGraph(attributePaths = {"imageUrls"})
    List<Product> getAllByIdIsNotNull();
    Product findProductByCategory(Category category);
    Product findProductByIdIs(Long id);

}
