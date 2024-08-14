package com.wholesaled.clientsideservice.Repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.wholesaled.clientsideservice.Model.Category;

@Repository("CategoryRepository")
public interface CategoryRepository extends JpaRepository<Category, Long> {

    Optional<Category> findByName(String name);
    
}
