package com.finance.tracker.controller;

import com.finance.tracker.Util.AuthUtil;
import com.finance.tracker.dto.IncomeRequest;
import com.finance.tracker.entity.IncomeEntity;
import com.finance.tracker.service.IncomeService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/income")
@RequiredArgsConstructor
public class IncomeController {

    private final IncomeService incomeService;
    private final AuthUtil authUtil;

    @PostMapping("/add")
    public ResponseEntity<IncomeEntity> addIncome(@Valid @RequestBody IncomeRequest request) {
        String userId = authUtil.getCurrentUserId();
        IncomeEntity income = incomeService.addIncome(userId, request);
        return ResponseEntity.status(HttpStatus.CREATED).body(income);
    }

    @GetMapping("/all")
    public ResponseEntity<Page<IncomeEntity>> getAllIncomes(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        String userId = authUtil.getCurrentUserId();
        return ResponseEntity.ok(incomeService.getAllIncomes(userId, page, size));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteIncome(@PathVariable Long id) {
        String userId = authUtil.getCurrentUserId();
        incomeService.deleteIncome(userId, id);
        return ResponseEntity.ok("Income entry deleted successfully");
    }
}
