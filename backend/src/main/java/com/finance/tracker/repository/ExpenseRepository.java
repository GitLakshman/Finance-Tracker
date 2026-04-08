package com.finance.tracker.repository;

import com.finance.tracker.entity.ExpenseEntity;
import com.finance.tracker.enums.Category;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface ExpenseRepository extends JpaRepository<ExpenseEntity, Long> {
    Page<ExpenseEntity> findAllByUserIdOrderByDateDesc(String userId, Pageable pageable);
    List<ExpenseEntity> findByUserIdAndDateBetweenOrderByDateDesc(String userId, LocalDate dateFrom, LocalDate dateTo);
    List<ExpenseEntity> findByUserIdAndCategoryAndDateBetween(String userId, Category category, LocalDate dateFrom, LocalDate dateTo);

    @Query("SELECT COALESCE(SUM(e.amount), 0) FROM ExpenseEntity e WHERE e.userId = :userId AND e.category = :category AND e.date BETWEEN :dateFrom AND :dateTo")
    Double sumAmountByUserIdAndCategoryAndDateBetween(@Param("userId") String userId,
                                                      @Param("category") Category category,
                                                      @Param("dateFrom") LocalDate dateFrom,
                                                      @Param("dateTo") LocalDate dateTo);

    @Query("SELECT COALESCE(SUM(e.amount), 0) FROM ExpenseEntity e WHERE e.userId = :userId AND e.date BETWEEN :dateFrom AND :dateTo")
    Double sumAmountByUserIdAndDateBetween(@Param("userId") String userId,
                                           @Param("dateFrom") LocalDate dateFrom,
                                           @Param("dateTo") LocalDate dateTo);
}
