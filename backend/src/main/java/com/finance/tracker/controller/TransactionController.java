package com.finance.tracker.controller;

import com.finance.tracker.Util.AuthUtil;
import com.finance.tracker.dto.TransactionResponse;
import com.finance.tracker.enums.TransactionType;
import com.finance.tracker.service.TransactionService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/transaction")
@RequiredArgsConstructor
public class TransactionController {

    private final TransactionService transactionService;
    private final AuthUtil authUtil;

    @GetMapping("/history")
    public ResponseEntity<Page<TransactionResponse>> getTransactionHistory(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) TransactionType type,
            @RequestParam(required = false) String dateFrom,
            @RequestParam(required = false) String dateTo,
            @RequestParam(required = false) String keyword) {
        String userId = authUtil.getCurrentUserId();
        Page<TransactionResponse> history = transactionService.getTransactionHistory(
                userId, page, size, type, dateFrom, dateTo, keyword);
        return ResponseEntity.ok(history);
    }
}
