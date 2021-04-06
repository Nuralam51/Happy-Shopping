package com.example.ecommerce.repository;

import com.example.ecommerce.entity.Orders;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;

@RepositoryRestResource(collectionResourceRel = "orders", path = "orders")
public interface OrderRepository extends JpaRepository<Orders, Long> {
    Page<Orders> findByCustomerEmailOrderByDateCreatedDesc(@Param("email") String email, Pageable pageable);
}
