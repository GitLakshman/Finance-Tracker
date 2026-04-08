package com.finance.tracker.service;

import com.finance.tracker.dto.ExpenseRequest;
import com.finance.tracker.entity.ExpenseEntity;
import com.finance.tracker.enums.Category;
import org.springframework.data.domain.Page;

import java.util.List;

public interface ExpenseService {
    ExpenseEntity addExpense(String userId, ExpenseRequest request);

    Page<ExpenseEntity> getAllExpenses(String userId, int page, int size);

    List<ExpenseEntity> filterExpenses(String userId, String month, Category category);

    void deleteExpense(String userId, Long id);
}
