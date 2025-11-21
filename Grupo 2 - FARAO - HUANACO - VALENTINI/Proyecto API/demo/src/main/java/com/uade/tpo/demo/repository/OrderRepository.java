package com.uade.tpo.demo.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.uade.tpo.demo.entity.Order;

@Repository
public interface OrderRepository  extends JpaRepository<Order, Long>{
    @Query(value = "select o from Order o where o.user.id = ?1 order by o.id DESC")
    List<Order> findAllByUserId(Long userId);
}
