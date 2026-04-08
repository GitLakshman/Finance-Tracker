package com.finance.tracker.service;

import com.finance.tracker.dto.BudgetRequest;
import com.finance.tracker.dto.BudgetResponse;
import com.finance.tracker.entity.BudgetEntity;

import java.util.List;

public interface BudgetService {
    BudgetEntity setBudget(String userId, BudgetRequest request);
    List<BudgetEntity> getBudgets(String userId, String month);
    List<BudgetResponse> getBudgetSummary(String userId, String month);
}
