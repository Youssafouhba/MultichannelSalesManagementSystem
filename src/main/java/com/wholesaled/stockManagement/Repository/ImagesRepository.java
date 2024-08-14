package com.wholesaled.stockManagement.Repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.wholesaled.stockManagement.Model.Images;

@Repository
public interface ImagesRepository extends JpaRepository<Images, Long> {
}
