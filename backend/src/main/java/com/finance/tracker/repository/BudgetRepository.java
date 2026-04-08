package com.finance.tracker.repository;

import com.finance.tracker.entity.BudgetEntity;
import com.finance.tracker.enums.Category;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface BudgetRepository extends JpaRepository<BudgetEntity, Long> {
    List<BudgetEntity> findByUserIdAndMonth(String userId, String month);
    Optional<BudgetEntity> findByUserIdAndCategoryAndMonth(String userId, Category category, String month);
}
