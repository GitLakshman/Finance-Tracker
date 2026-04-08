package com.finance.tracker.service.Impl;

import com.finance.tracker.dto.ExpenseRequest;
import com.finance.tracker.entity.ExpenseEntity;
import com.finance.tracker.enums.Category;
import com.finance.tracker.exception.ResourceNotFoundException;
import com.finance.tracker.repository.ExpenseRepository;
import com.finance.tracker.service.ExpenseService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.YearMonth;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ExpenseServiceImpl implements ExpenseService {

    private final ExpenseRepository expenseRepository;

    @Override
    public ExpenseEntity addExpense(String userId, ExpenseRequest request) {
        ExpenseEntity expense = ExpenseEntity.builder().userId(userId).amount(request.getAmount()).category(request.getCategory()).description(request.getDescription()).date(request.getDate()).build();
        return expenseRepository.save(expense);
    }

    @Override
    public Page<ExpenseEntity> getAllExpenses(String userId, int page, int size) {
        PageRequest pageable = PageRequest.of(page, size, Sort.by("date").descending());
        return expenseRepository.findAllByUserIdOrderByDateDesc(userId, pageable);
    }

    @Override
    public List<ExpenseEntity> filterExpenses(String userId, String month, Category category) {
        YearMonth ym = YearMonth.parse(month);
        LocalDate dateFrom = ym.atDay(1);
        LocalDate dateTo = ym.atEndOfMonth();

        if (category != null) {
            return expenseRepository.findByUserIdAndCategoryAndDateBetween(userId, category, dateFrom, dateTo);
        }
        return expenseRepository.findByUserIdAndDateBetweenOrderByDateDesc(userId, dateFrom, dateTo);
    }

    @Override
    public void deleteExpense(String userId, Long id) {
        ExpenseEntity expense = expenseRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Expense", "id", id));

        if (!expense.getUserId().equals(userId)) {
            throw new RuntimeException("Access denied: You can only delete your own expenses");
        }
        expenseRepository.delete(expense);
    }
}
