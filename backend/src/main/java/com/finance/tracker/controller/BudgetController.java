package com.finance.tracker.controller;

import com.finance.tracker.Util.AuthUtil;
import com.finance.tracker.dto.BudgetRequest;
import com.finance.tracker.dto.BudgetResponse;
import com.finance.tracker.entity.BudgetEntity;
import com.finance.tracker.service.BudgetService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/budget")
@RequiredArgsConstructor
public class BudgetController {

    private final BudgetService budgetService;
    private final AuthUtil authUtil;

    @PostMapping("/set")
    public ResponseEntity<BudgetEntity> setBudget(@Valid @RequestBody BudgetRequest request) {
        String userId = authUtil.getCurrentUserId();
        BudgetEntity budget = budgetService.setBudget(userId, request);
        return ResponseEntity.status(HttpStatus.CREATED).body(budget);
    }

    @GetMapping("/all")
    public ResponseEntity<List<BudgetEntity>> getBudgets(@RequestParam String month) {
        String userId = authUtil.getCurrentUserId();
        return ResponseEntity.ok(budgetService.getBudgets(userId, month));
    }

    @GetMapping("/summary")
    public ResponseEntity<List<BudgetResponse>> getBudgetSummary(@RequestParam String month) {
        String userId = authUtil.getCurrentUserId();
        return ResponseEntity.ok(budgetService.getBudgetSummary(userId, month));
    }
}
