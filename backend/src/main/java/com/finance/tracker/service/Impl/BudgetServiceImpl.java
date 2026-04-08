package com.finance.tracker.service.Impl;

import com.finance.tracker.dto.BudgetRequest;
import com.finance.tracker.dto.BudgetResponse;
import com.finance.tracker.entity.BudgetEntity;
import com.finance.tracker.enums.Category;
import com.finance.tracker.repository.BudgetRepository;
import com.finance.tracker.repository.ExpenseRepository;
import com.finance.tracker.service.BudgetService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.YearMonth;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class BudgetServiceImpl implements BudgetService {

    private final BudgetRepository budgetRepository;
    private final ExpenseRepository expenseRepository;

    @Override
    public BudgetEntity setBudget(String userId, BudgetRequest request) {
        // Upsert: update if exists, create if not
        Optional<BudgetEntity> existing = budgetRepository.findByUserIdAndCategoryAndMonth(userId, request.getCategory(), request.getMonth());

        if (existing.isPresent()) {
            BudgetEntity budget = existing.get();
            budget.setBudgetAmount(request.getBudgetAmount());
            return budgetRepository.save(budget);
        }

        BudgetEntity budget = BudgetEntity.builder().userId(userId).category(request.getCategory()).budgetAmount(request.getBudgetAmount()).month(request.getMonth()).build();
        return budgetRepository.save(budget);
    }

    @Override
    public List<BudgetEntity> getBudgets(String userId, String month) {
        return budgetRepository.findByUserIdAndMonth(userId, month);
    }

    @Override
    public List<BudgetResponse> getBudgetSummary(String userId, String month) {
        List<BudgetEntity> budgets = budgetRepository.findByUserIdAndMonth(userId, month);
        List<BudgetResponse> summaries = new ArrayList<>();

        YearMonth ym = YearMonth.parse(month);
        LocalDate dateFrom = ym.atDay(1);
        LocalDate dateTo = ym.atEndOfMonth();

        for (BudgetEntity budget : budgets) {
            Category category = budget.getCategory();
            Double actualSpend = expenseRepository.sumAmountByUserIdAndCategoryAndDateBetween(userId, category, dateFrom, dateTo);

            double remaining = budget.getBudgetAmount() - actualSpend;
            double percentUsed = budget.getBudgetAmount() > 0 ? (actualSpend / budget.getBudgetAmount()) * 100 : 0;

            summaries.add(BudgetResponse.builder().category(category).budgetAmount(budget.getBudgetAmount()).actualSpend(actualSpend).remaining(remaining).percentUsed(Math.min(percentUsed, 100.0)).build());
        }
        return summaries;
    }
}
