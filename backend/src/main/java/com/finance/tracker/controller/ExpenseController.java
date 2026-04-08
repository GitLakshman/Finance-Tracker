package com.finance.tracker.controller;

import com.finance.tracker.Util.AuthUtil;
import com.finance.tracker.dto.ExpenseRequest;
import com.finance.tracker.entity.ExpenseEntity;
import com.finance.tracker.enums.Category;
import com.finance.tracker.service.ExpenseService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/expense")
@RequiredArgsConstructor
public class ExpenseController {

    private final ExpenseService expenseService;
    private final AuthUtil authUtil;

    @PostMapping("/add")
    public ResponseEntity<ExpenseEntity> addExpense(@Valid @RequestBody ExpenseRequest request) {
        String userId = authUtil.getCurrentUserId();
        ExpenseEntity expense = expenseService.addExpense(userId, request);
        return ResponseEntity.status(HttpStatus.CREATED).body(expense);
    }

    @GetMapping("/all")
    public ResponseEntity<Page<ExpenseEntity>> getAllExpenses(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        String userId = authUtil.getCurrentUserId();
        return ResponseEntity.ok(expenseService.getAllExpenses(userId, page, size));
    }

    @GetMapping("/filter")
    public ResponseEntity<List<ExpenseEntity>> filterExpenses(
            @RequestParam String month,
            @RequestParam(required = false) Category category) {
        String userId = authUtil.getCurrentUserId();
        return ResponseEntity.ok(expenseService.filterExpenses(userId, month, category));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteExpense(@PathVariable Long id) {
        String userId = authUtil.getCurrentUserId();
        expenseService.deleteExpense(userId, id);
        return ResponseEntity.ok("Expense deleted successfully");
    }
}
